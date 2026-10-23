import json
import logging
from typing import AsyncGenerator, Dict, Any, List
from sqlalchemy.orm import Session
from app.config import settings
from app.ai.tools import execute_tool, ANTHROPIC_TOOLS
from app.ai.fallback_engine import stream_ai_response as stream_fallback_engine, SYSTEM_PROMPT

logger = logging.getLogger("setu.ai")

LANG_NAMES = {
    "hi": "Hindi (हिन्दी)",
    "kn": "Kannada (ಕನ್ನಡ)",
    "ta": "Tamil (தமிழ்)",
    "te": "Telugu (తెలుగు)",
    "mr": "Marathi (मराठी)",
    "ml": "Malayalam (മലയാളം)",
    "bn": "Bengali (বাংলা)",
    "gu": "Gujarati (ગુજરાતી)",
    "pa": "Punjabi (ਪੰਜਾਬੀ)",
    "ur": "Urdu (اردو)",
    "or": "Odia (ଓଡ଼ିଆ)",
    "en": "English"
}

# ── Gemini tool schema (mapped from Anthropic format) ──────────────────────────
def _build_gemini_tools(anthropic_tools: list) -> list:
    """Convert Anthropic tool specs to Gemini function declarations."""
    gemini_functions = []
    for tool in anthropic_tools:
        gemini_functions.append({
            "name": tool["name"],
            "description": tool.get("description", ""),
            "parameters": tool.get("input_schema", {}),
        })
    return gemini_functions


async def _stream_gemini(
    message: str,
    language: str,
    conversation_history: List[Dict[str, str]],
    user_profile: Dict[str, Any],
    db: Session,
    active_system_prompt: str,
) -> AsyncGenerator[str, None]:
    """
    Drive a multi-turn Gemini conversation with function-calling support.
    """
    import google.generativeai as genai

    genai.configure(api_key=settings.GEMINI_API_KEY)

    # Build Gemini history (exclude last user turn — it's sent as `message`)
    history = []
    for m in conversation_history:
        role = "user" if m.get("role") == "user" else "model"
        history.append({"role": role, "parts": [m.get("content", "")]})

    # Function declarations for Gemini tool-use
    gemini_tool_specs = _build_gemini_tools(ANTHROPIC_TOOLS)
    tools = [{"function_declarations": gemini_tool_specs}] if gemini_tool_specs else []

    model = genai.GenerativeModel(
        model_name=settings.GEMINI_MODEL,
        system_instruction=active_system_prompt,
        tools=tools if tools else None,
    )

    chat = model.start_chat(history=history)

    # First turn
    response = chat.send_message(message)
    candidate = response.candidates[0]

    full_text = ""
    tool_called = False

    for part in candidate.content.parts:
        # Function call part
        if hasattr(part, "function_call") and part.function_call:
            fc = part.function_call
            tool_name = fc.name
            tool_input = dict(fc.args) if fc.args else {}
            tool_called = True

            yield f"data: {json.dumps({'type': 'tool_call', 'tool': tool_name, 'input': tool_input})}\n\n"

            tool_res = execute_tool(tool_name, tool_input, db)
            yield f"data: {json.dumps({'type': 'tool_result', 'data': tool_res})}\n\n"

            # Dispatch right-panel actions
            if tool_name == "search_schemes":
                schemes = tool_res.get("schemes", [])
                yield f"data: {json.dumps({'type': 'action', 'action': 'show_schemes', 'data': {'schemes': schemes, 'count': len(schemes)}})}\n\n"
            elif tool_name == "check_payment_status":
                if tool_input.get("requires_digilocker") and not (user_profile and user_profile.get("digilocker_verified")):
                    yield f"data: {json.dumps({'type': 'action', 'action': 'show_digilocker_prompt', 'data': {'scheme_name': tool_input.get('scheme_name')}})}\n\n"
            elif tool_name == "get_required_documents":
                yield f"data: {json.dumps({'type': 'action', 'action': 'show_document_checklist', 'data': tool_res})}\n\n"
            elif tool_name == "check_eligibility":
                yield f"data: {json.dumps({'type': 'action', 'action': 'show_eligibility_breakdown', 'data': tool_res})}\n\n"

            # Second turn: feed tool result back so Gemini can narrate
            followup_response = chat.send_message(
                {
                    "parts": [
                        {
                            "function_response": {
                                "name": tool_name,
                                "response": tool_res,
                            }
                        }
                    ]
                }
            )
            followup_candidate = followup_response.candidates[0]
            for fpart in followup_candidate.content.parts:
                text = getattr(fpart, "text", None)
                if text:
                    for word in text.split(" "):
                        yield f"data: {json.dumps({'type': 'text', 'content': word + ' '})}\n\n"

        # Plain text part
        elif hasattr(part, "text") and part.text:
            full_text += part.text

    if full_text and not tool_called:
        for word in full_text.split(" "):
            yield f"data: {json.dumps({'type': 'text', 'content': word + ' '})}\n\n"

    yield f"data: {json.dumps({'type': 'done'})}\n\n"


async def chat_stream(
    message: str,
    language: str,
    conversation_history: List[Dict[str, str]],
    user_profile: Dict[str, Any],
    db: Session
) -> AsyncGenerator[str, None]:
    """
    Main entry point for AI Chat.
    Priority: Google Gemini → built-in deterministic multilingual engine.
    """
    target_lang_name = LANG_NAMES.get(language, language)
    active_system_prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        f"CRITICAL MULTILINGUAL INSTRUCTION: The citizen has explicitly selected the language '{target_lang_name}'. "
        f"You MUST formulate your response in {target_lang_name} using correct native script and respectful phrasing. "
        f"Do NOT default to English unless the selected language is English."
    )

    # ── 1. Try Google Gemini ─────────────────────────────────────────────────
    if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip():
        try:
            async for chunk in _stream_gemini(
                message, language, conversation_history, user_profile, db, active_system_prompt
            ):
                yield chunk
            return
        except Exception as e:
            logger.warning(f"Gemini API failed: {e}. Trying Anthropic fallback.")

    # ── 2. Try Anthropic Claude (legacy fallback) ────────────────────────────
    anthropic_key = settings.OPENROUTER_API_KEY or settings.ANTHROPIC_API_KEY
    is_openrouter = bool(settings.OPENROUTER_API_KEY and settings.OPENROUTER_API_KEY.strip())

    if anthropic_key and anthropic_key.strip():
        try:
            import anthropic

            if is_openrouter:
                client = anthropic.AsyncAnthropic(
                    api_key=anthropic_key,
                    base_url="https://openrouter.ai/api",
                )
                model_name = "anthropic/claude-3.5-sonnet"
            else:
                client = anthropic.AsyncAnthropic(api_key=anthropic_key)
                model_name = settings.CLAUDE_MODEL

            messages = []
            for m in conversation_history:
                role = "user" if m.get("role") == "user" else "assistant"
                messages.append({"role": role, "content": m.get("content", "")})
            messages.append({"role": "user", "content": message})

            response = await client.messages.create(
                model=model_name,
                max_tokens=1024,
                system=active_system_prompt,
                tools=ANTHROPIC_TOOLS,
                messages=messages
            )

            for content_block in response.content:
                if content_block.type == "tool_use":
                    tool_name = content_block.name
                    tool_input = content_block.input

                    yield f"data: {json.dumps({'type': 'tool_call', 'tool': tool_name, 'input': tool_input})}\n\n"
                    tool_res = execute_tool(tool_name, tool_input, db)
                    yield f"data: {json.dumps({'type': 'tool_result', 'data': tool_res})}\n\n"

                    if tool_name == "search_schemes":
                        schemes = tool_res.get("schemes", [])
                        yield f"data: {json.dumps({'type': 'action', 'action': 'show_schemes', 'data': {'schemes': schemes, 'count': len(schemes)}})}\n\n"
                    elif tool_name == "check_payment_status":
                        if tool_input.get("requires_digilocker") and not (user_profile and user_profile.get("digilocker_verified")):
                            yield f"data: {json.dumps({'type': 'action', 'action': 'show_digilocker_prompt', 'data': {'scheme_name': tool_input.get('scheme_name')}})}\n\n"
                    elif tool_name == "get_required_documents":
                        yield f"data: {json.dumps({'type': 'action', 'action': 'show_document_checklist', 'data': tool_res})}\n\n"
                    elif tool_name == "check_eligibility":
                        yield f"data: {json.dumps({'type': 'action', 'action': 'show_eligibility_breakdown', 'data': tool_res})}\n\n"

                    followup = await client.messages.create(
                        model=model_name,
                        max_tokens=1024,
                        system=active_system_prompt,
                        tools=ANTHROPIC_TOOLS,
                        messages=messages + [
                            {"role": "assistant", "content": [{"type": "tool_use", "id": content_block.id, "name": tool_name, "input": tool_input}]},
                            {"role": "user", "content": [{"type": "tool_result", "tool_use_id": content_block.id, "content": json.dumps(tool_res)}]}
                        ]
                    )
                    for b in followup.content:
                        if b.type == "text":
                            for chunk in b.text.split(" "):
                                yield f"data: {json.dumps({'type': 'text', 'content': chunk + ' '})}\n\n"

                elif content_block.type == "text":
                    for chunk in content_block.text.split(" "):
                        yield f"data: {json.dumps({'type': 'text', 'content': chunk + ' '})}\n\n"

            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            return

        except Exception as e:
            logger.warning(f"Anthropic API failed: {e}. Falling back to deterministic engine.")

    # ── 3. Built-in deterministic multilingual engine ────────────────────────
    async for chunk in stream_fallback_engine(message, language, conversation_history, user_profile, db):
        yield chunk

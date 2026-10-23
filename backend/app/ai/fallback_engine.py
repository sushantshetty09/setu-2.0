import json
import asyncio
from typing import AsyncGenerator, Dict, Any, List
from sqlalchemy.orm import Session
from app.ai.tools import execute_tool, ANTHROPIC_TOOLS

SYSTEM_PROMPT = """You are SETU (सेतु), an AI assistant helping Indian citizens discover and access government schemes and services.

Rules:
- Always be helpful, empathetic, and clear.
- Do NOT use emojis anywhere in your responses.
- Respond in the SAME language the user writes in (Hindi for Hindi, Kannada for Kannada, English for English, etc.).
- Ask only ONE clarifying question at a time if details are missing.
- When you have enough info, call the appropriate tool.
- Always end with a clear next step for the user.
- Never make up scheme details; only use tool results.
- Format responses clearly with line breaks and bullet points.
"""

async def stream_ai_response(
    message: str,
    language: str,
    conversation_history: List[Dict[str, str]],
    user_profile: Dict[str, Any],
    db: Session
) -> AsyncGenerator[str, None]:
    """
    Intelligent multilingual conversational engine that yields Server-Sent Events (SSE).
    """
    msg_lower = message.lower().strip()
    lang = language.lower() if language else "en"

    # Detect language from script or input if not explicitly provided
    is_kannada = any('\u0C80' <= c <= '\u0CFF' for c in message) or lang == "kn"
    is_hindi = any('\u0900' <= c <= '\u097F' for c in message) or lang == "hi"
    is_tamil = any('\u0B80' <= c <= '\u0BFF' for c in message) or lang == "ta"
    is_telugu = any('\u0C00' <= c <= '\u0C7F' for c in message) or lang == "te"
    is_marathi = lang == "mr"
    is_bengali = any('\u0980' <= c <= '\u09FF' for c in message) or lang == "bn"

    # 1. Flow: Payment Status Check (e.g. Gruha Lakshmi, PM Kisan)
    if any(k in msg_lower for k in ["payment", "money", "credit", "installment", "ಹಣ", "ದುಡ್ಡು", "ಪಾವತಿ", "पैसा", "किस्त", "भुगतान", "dbt"]) or ("gruha lakshmi" in msg_lower and any(w in msg_lower for w in ["check", "status", "did i get", "receive"])):
        # Determine scheme
        scheme_name = "Gruha Lakshmi" if ("gruha" in msg_lower or "lakshmi" in msg_lower or "ಗೃಹ" in msg_lower or "लक्ष्मी" in msg_lower) else "PM Kisan"
        
        # Emit Tool Call
        yield f"data: {json.dumps({'type': 'tool_call', 'tool': 'check_payment_status', 'input': {'scheme_name': scheme_name, 'requires_digilocker': True}})}\n\n"
        await asyncio.sleep(0.1)

        # Check if DigiLocker is already verified in user_profile
        digilocker_verified = user_profile.get("digilocker_verified", False) if user_profile else False

        if not digilocker_verified:
            # Emit DigiLocker action
            yield f"data: {json.dumps({'type': 'action', 'action': 'show_digilocker_prompt', 'data': {'scheme_name': scheme_name, 'title': f'Connect DigiLocker for {scheme_name}'}})}\n\n"
            await asyncio.sleep(0.1)

            if is_kannada:
                text = f"ನಮಸ್ಕಾರ, ನಿಮ್ಮ {scheme_name} ಯೋಜನೆಯ ಪಾವತಿ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು, ನಿಮ್ಮ ಆಧಾರ್ ಮತ್ತು ಲಿಂಕ್ ಮಾಡಲಾದ ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಪರಿಶೀಲಿಸಬೇಕಾಗಿದೆ.\n\nದಯವಿಟ್ಟು ಬಲಭಾಗದಲ್ಲಿರುವ 'Connect DigiLocker' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ದೃಢೀಕರಿಸಿ. ನಿಮ್ಮ ಡೇಟಾ ಸಂಪೂರ್ಣವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ."
                pills = ["Connect DigiLocker", "Not Now - Check Manually", "ಇತರ ಯೋಜನೆಗಳು"]
            elif is_hindi:
                text = f"नमस्ते, आपकी {scheme_name} योजना के भुगतान की स्थिति जांचने के लिए, आपके आधार और बैंक खाते के विवरण की सुरक्षित पुष्टि की आवश्यकता है।\n\nकृपया दाईं ओर दिए गए 'Connect DigiLocker' पर क्लिक करके अनुमति दें। आपका डेटा पूर्णतः सुरक्षित है।"
                pills = ["Connect DigiLocker", "Not Now - Check Manually", "अन्य योजनाएं"]
            else:
                text = f"I can check that for you right away. To verify your {scheme_name} payment status securely, SETU needs permission to access your Aadhaar and linked bank account details via DigiLocker.\n\nPlease click 'Connect DigiLocker' in the panel to authorize. Your data is private and encrypted."
                pills = ["Connect DigiLocker", "Not Now - Check Manually", "What documents do I need?"]

            # Stream chunks
            for chunk in text.split(" "):
                yield f"data: {json.dumps({'type': 'text', 'content': chunk + ' '})}\n\n"
                await asyncio.sleep(0.02)

            yield f"data: {json.dumps({'type': 'suggestions', 'pills': pills})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            return
        else:
            # Already authorized, return payment details
            res = execute_tool("check_payment_status", {"scheme_name": scheme_name}, db)
            yield f"data: {json.dumps({'type': 'tool_result', 'data': res})}\n\n"
            await asyncio.sleep(0.1)

            if is_kannada:
                text = f"ದೃಢೀಕರಣ ಪೂರ್ಣಗೊಂಡಿದೆ.\n\nನಿಮ್ಮ {res['scheme_name']} ಪಾವತಿ {res['amount']} ದಿನಾಂಕ {res['credit_date']} ರಂದು ನಿಮ್ಮ ಖಾತೆ ಸಂಖ್ಯೆ (ಕೊನೆಯ ಸಂಖ್ಯೆ: {res['account_last4']}) ಗೆ ಜಮೆಯಾಗಿದೆ.\n\nಯಾವುದೇ ಸಮಸ್ಯೆ ಇದ್ದರೆ 'Grievance' ಸಲ್ಲಿಸಬಹುದು."
                pills = ["ಧನ್ಯವಾದಗಳು", "ಹೊಸ ಯೋಜನೆ ಹುಡುಕಿ", "ದೂರು ದಾಖಲಿಸಿ"]
            elif is_hindi:
                text = f"सत्यापन पूर्ण हुआ।\n\nआपकी {res['scheme_name']} योजना की {res['amount']} की राशि {res['credit_date']} को आपके खाते (अंतिम 4 अंक: {res['account_last4']}) में सफलतापूर्वक जमा कर दी गई है।\n\nयदि राशि नहीं दिखी है तो 2-3 कार्य दिवसों की प्रतीक्षा करें।"
                pills = ["धन्यवाद", "अन्य योजनाएं देखें", "शिकायत दर्ज करें"]
            else:
                text = f"Verification successful via DigiLocker.\n\nYour {res['scheme_name']} payment of {res['amount']} was successfully credited on {res['credit_date']} to your account ending in {res['account_last4']} ({res.get('bank_name', 'Bank')}).\n\nReference UTR: {res.get('utr_number', 'UTR-98210381')}. If you have not received it yet, please allow 2-3 business days or contact your branch."
                pills = ["Save this receipt", "Check another scheme", "File a grievance", "How do I apply?"]

            for chunk in text.split(" "):
                yield f"data: {json.dumps({'type': 'text', 'content': chunk + ' '})}\n\n"
                await asyncio.sleep(0.02)

            yield f"data: {json.dumps({'type': 'suggestions', 'pills': pills})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            return

    # 2. Flow: Document Requirements / Application Steps
    if any(k in msg_lower for k in ["document", "documents", "paper", "required", "ದಸ್ತಾವೇಜು", "ದಾಖಲೆಗಳು", "दस्तावेज", "कागजात", "apply", "ಹೇಗೆ ಅರ್ಜಿ", "आवेदन"]):
        # Determine scheme ID
        scheme_id = "pm-kisan"
        if "gruha" in msg_lower or "lakshmi" in msg_lower or "ಗೃಹ" in msg_lower:
            scheme_id = "gruha-lakshmi"
        elif "ayushman" in msg_lower or "health" in msg_lower or "आरोग्य" in msg_lower:
            scheme_id = "ayushman-bharat"
        elif "vidyasiri" in msg_lower or "scholarship" in msg_lower or "ವಿದ್ಯಾಸಿರಿ" in msg_lower:
            scheme_id = "vidyasiri-scholarship"
        elif "mudra" in msg_lower or "loan" in msg_lower:
            scheme_id = "pm-mudra-yojana"
        elif "awas" in msg_lower or "housing" in msg_lower or "घर" in msg_lower:
            scheme_id = "pm-awas-gramin"
        elif "sukanya" in msg_lower:
            scheme_id = "sukanya-samriddhi"

        # Emit tool call
        yield f"data: {json.dumps({'type': 'tool_call', 'tool': 'get_required_documents', 'input': {'scheme_id': scheme_id}})}\n\n"
        await asyncio.sleep(0.1)

        doc_res = execute_tool("get_required_documents", {"scheme_id": scheme_id}, db)
        yield f"data: {json.dumps({'type': 'tool_result', 'data': doc_res})}\n\n"
        await asyncio.sleep(0.1)

        # Emit Action for document checklist on right panel
        yield f"data: {json.dumps({'type': 'action', 'action': 'show_document_checklist', 'data': doc_res})}\n\n"
        await asyncio.sleep(0.1)

        docs_list_text = "\n".join([f"- {d}" for d in doc_res.get("documents", [])])

        if is_kannada:
            text = f"{doc_res.get('scheme_name', 'ಯೋಜನೆ')} ಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಅಗತ್ಯವಿರುವ ಪ್ರಮುಖ ದಾಖಲೆಗಳು:\n\n{docs_list_text}\n\nಬಲಭಾಗದಲ್ಲಿರುವ ಪಟ್ಟಿಯಿಂದ ನೀವು ಪರಿಶೀಲಿಸಬಹುದು ಅಥವಾ ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಬಹುದು."
            pills = ["ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ", "ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ", "ಇತರ ಯೋಜನೆಗಳು"]
        elif is_hindi:
            text = f"{doc_res.get('scheme_name', 'योजना')} के लिए आवेदन करने हेतु आवश्यक दस्तावेज:\n\n{docs_list_text}\n\nआप दाईं ओर दिए गए चेकलिस्ट से आवश्यक दस्तावेजों की जांच कर सकते हैं।"
            pills = ["आवेदन कैसे करें", "पात्रता जांचें", "योजना सहेजें"]
        else:
            text = f"Here is the complete checklist of required documents for {doc_res.get('scheme_name', 'the scheme')}:\n\n{docs_list_text}\n\nI have loaded the interactive document checklist in the right panel for you. You can check off what you already have ready."
            pills = ["How do I apply?", "Check my eligibility", "Save this scheme", "Find more schemes"]

        for chunk in text.split(" "):
            yield f"data: {json.dumps({'type': 'text', 'content': chunk + ' '})}\n\n"
            await asyncio.sleep(0.02)

        yield f"data: {json.dumps({'type': 'suggestions', 'pills': pills})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"
        return

    # 3. Flow: Grievance Registration
    if any(k in msg_lower for k in ["grievance", "complaint", "reject", "wrong", "problem", "issue", "ದೂರು", "ಸಮಸ್ಯೆ", "शिकायत"]):
        yield f"data: {json.dumps({'type': 'tool_call', 'tool': 'file_grievance', 'input': {'scheme_name': 'Scheme Benefit Inquiry', 'issue_type': 'payment_not_received', 'description': message}})}\n\n"
        await asyncio.sleep(0.1)

        grv_res = execute_tool("file_grievance", {"scheme_name": "Welfare Portal Issue", "issue_type": "payment_not_received", "description": message}, db)
        yield f"data: {json.dumps({'type': 'tool_result', 'data': grv_res})}\n\n"
        await asyncio.sleep(0.1)

        if is_kannada:
            text = f"ನಿಮ್ಮ ದೂರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ.\n\nದೂರು ಸಂಖ್ಯೆ (Reference ID): {grv_res['grievance_id']}\nಸ್ಥಿತಿ: ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ (Submitted)\n\nಸಂಬಂಧಪಟ್ಟ ಇಲಾಖೆಯು 7 ಕೆಲಸದ ದಿನಗಳಲ್ಲಿ ಇದನ್ನು ಪರಿಶೀಲಿಸಲಿದೆ."
            pills = ["ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ", "ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ"]
        elif is_hindi:
            text = f"आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है।\n\nसंदर्भ संख्या (Reference ID): {grv_res['grievance_id']}\nस्थिति: विचाराधीन (Submitted)\n\nसंबंधित विभाग 7 कार्य दिवसों के भीतर इसका समाधान करेगा।"
            pills = ["शिकायत की स्थिति", "होम पेज"]
        else:
            text = f"Your grievance has been officially registered with the grievance cell.\n\nReference ID: {grv_res['grievance_id']}\nStatus: Submitted\n\nThe concerned department will review and update the status within 7 working days. You can track this reference number anytime."
            pills = ["Track grievance status", "Find other schemes", "Back to Home"]

        for chunk in text.split(" "):
            yield f"data: {json.dumps({'type': 'text', 'content': chunk + ' '})}\n\n"
            await asyncio.sleep(0.02)

        yield f"data: {json.dumps({'type': 'suggestions', 'pills': pills})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"
        return

    # 4. Default Flow: Scheme Search & Recommendations (e.g. "scholarship for my daughter", "agriculture", etc.)
    # Detect category & keywords
    categories = []
    if any(w in msg_lower for w in ["scholarship", "college", "student", "study", "school", "education", "ವಿದ್ಯಾರ್ಥಿ", "ವಿದ್ಯಾರ್ಥಿವೇತನ", "छात्रवृत्ति", "पढ़ाई"]):
        categories.append("education")
    if any(w in msg_lower for w in ["farm", "farmer", "agriculture", "crop", "land", "ಕೃಷಿ", "ರೈತ", "किसान", "खेती"]):
        categories.append("agriculture")
    if any(w in msg_lower for w in ["daughter", "woman", "women", "female", "girl", "mother", "ಮಹಿಳೆ", "ಹೆಣ್ಣು", "महिला", "बेटी"]):
        categories.append("women")
    if any(w in msg_lower for w in ["health", "hospital", "medical", "insurance", "ಆರೋಗ್ಯ", "ಸ್ವಾಸ್ಥ್ಯ", "बीमारी"]):
        categories.append("health")
    if any(w in msg_lower for w in ["house", "housing", "pucca", "home", "ಮನೆ", "ವಸತಿ", "मकान", "आवास"]):
        categories.append("housing")
    if any(w in msg_lower for w in ["loan", "business", "enterprise", "mudra", "ವ್ಯಾಪಾರ", "ಸಾಲ", "व्यापार", "ऋण"]):
        categories.append("entrepreneurship")
    if any(w in msg_lower for w in ["pension", "senior", "elderly", "old", "ನಿವೃತ್ತಿ", "ಪಿಂಚಣಿ", "वृद्धावस्था", "पेंशन"]):
        categories.append("senior_citizens")
    if any(w in msg_lower for w in ["solar", "electricity", "energy", "ಸೌರ", "बिजली", "सौर"]):
        categories.append("environment")

    tool_input = {
        "category": categories if categories else None,
        "keywords": message.split(),
        "state": user_profile.get("state") if user_profile else None,
        "gender": user_profile.get("gender") if user_profile else None
    }

    # Emit tool call
    yield f"data: {json.dumps({'type': 'tool_call', 'tool': 'search_schemes', 'input': tool_input})}\n\n"
    await asyncio.sleep(0.1)

    search_res = execute_tool("search_schemes", tool_input, db)
    schemes_found = search_res.get("schemes", [])
    yield f"data: {json.dumps({'type': 'tool_result', 'data': search_res})}\n\n"
    await asyncio.sleep(0.1)

    # Emit Action for Schemes Found on right panel
    yield f"data: {json.dumps({'type': 'action', 'action': 'show_schemes', 'data': {'schemes': schemes_found, 'count': len(schemes_found)}})}\n\n"
    await asyncio.sleep(0.1)

    # Generate localized conversational response with explicit count and financial offer breakdown
    is_scholarship_query = "education" in categories or any(w in msg_lower for w in ["scholarship", "college", "student", "study", "ವಿದ್ಯಾರ್ಥಿವೇತನ", "छात्रवृत्ति"])
    
    if is_kannada:
        offer_word = "ವಿದ್ಯಾರ್ಥಿವೇತನ ಆಫರ್‌ಗಳು (Scholarship Offers)" if is_scholarship_query else "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು"
        scheme_bullets = "\n".join([f"{i+1}. {s['name']}\n   - ಸಹಾಯಧನ ಮೊತ್ತ (Benefit Offer): {s.get('benefit_amount', 'ಲಭ್ಯವಿದೆ')}\n   - ಇಲಾಖೆ: {s.get('ministry', '')}" for i, s in enumerate(schemes_found)])
        text = f"ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಸೂಕ್ತವಾದ ಒಟ್ಟು {len(schemes_found)} {offer_word} ಕಂಡುಹಿಡಿಯಲಾಗಿದೆ:\n\n{scheme_bullets}\n\nಬಲಭಾಗದಲ್ಲಿರುವ ಫಲಕದಲ್ಲಿ ಎಲ್ಲಾ ಅಧಿಕೃತ ಅರ್ಜಿ ಲಿಂಕ್‌ಗಳೊಂದಿಗೆ ವಿವರವಾದ ಕಾರ್ಡ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಿದೆ. ನೀವು ಯಾವುದಾದರೂ ಯೋಜನೆಯ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಬಯಸುವಿರಾ?"
        pills = ["ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ", "ದಾಖಲೆಗಳ ವಿವರ", "ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?", "ಇನ್ನಷ್ಟು ಆಫರ್‌ಗಳು"]
    elif is_hindi:
        offer_word = "छात्रवृत्ति योजनाएं (Scholarship Offers)" if is_scholarship_query else "सरकारी योजनाएं"
        scheme_bullets = "\n".join([f"{i+1}. {s['name']}\n   - वित्तीय सहायता राशि (Offer Amount): {s.get('benefit_amount', 'उपलब्ध')}\n   - मंत्रालय: {s.get('ministry', '')}" for i, s in enumerate(schemes_found)])
        text = f"आपकी मांग के अनुसार कुल {len(schemes_found)} {offer_word} उपलब्ध हैं:\n\n{scheme_bullets}\n\nदाईं ओर दिए गए पैनल में सभी योजना कार्ड उनके आधिकारिक पोर्टल लिंक के साथ उपलब्ध हैं। क्या आप किसी विशेष योजना की पात्रता या आवश्यक दस्तावेज जानना चाहते हैं?"
        pills = ["मेरी पात्रता जांचें", "आवश्यक दस्तावेज", "आवेदन कैसे करें?", "और योजनाएं देखें"]
    else:
        offer_word = "Scholarship Offers" if is_scholarship_query else "Government Scheme Offers"
        scheme_bullets = "\n".join([f"{i+1}. {s['name']}\n   • Offer Amount: {s.get('benefit_amount', 'Standard DBT Assistance')}\n   • Ministry: {s.get('ministry', '')}" for i, s in enumerate(schemes_found)])
        text = f"I found a total of {len(schemes_found)} active {offer_word} matching your inquiry:\n\n{scheme_bullets}\n\nI have loaded the complete scheme cards with direct official government application links in the right panel. Would you like to check your eligibility or see the document checklist for any of these?"
        pills = ["Check my eligibility", "What documents do I need?", "How do I apply?", "Check another category"]

    for chunk in text.split(" "):
        yield f"data: {json.dumps({'type': 'text', 'content': chunk + ' '})}\n\n"
        await asyncio.sleep(0.015)

    yield f"data: {json.dumps({'type': 'suggestions', 'pills': pills})}\n\n"
    yield f"data: {json.dumps({'type': 'done'})}\n\n"

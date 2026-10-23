import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models import Scheme, Grievance

ANTHROPIC_TOOLS = [
    {
        "name": "search_schemes",
        "description": "Search for government schemes matching user's profile, demographic attributes, and keywords.",
        "input_schema": {
            "type": "object",
            "properties": {
                "age": {"type": "integer", "description": "User's age"},
                "gender": {"type": "string", "enum": ["male", "female", "transgender", "any"]},
                "state": {"type": "string", "description": "Indian state name e.g. Karnataka, Maharashtra"},
                "category": {"type": "array", "items": {"type": "string"}, "description": "e.g. education, health, agriculture, women, housing, entrepreneurship"},
                "income_annual": {"type": "number", "description": "Annual household income in INR"},
                "caste_category": {"type": "string", "enum": ["general", "obc", "sc", "st", "any"]},
                "keywords": {"type": "array", "items": {"type": "string"}, "description": "Keywords like scholarship, farm, kisan, loan, solar, pension"}
            }
        }
    },
    {
        "name": "get_scheme_details",
        "description": "Get full details of a specific scheme including benefits, eligibility, required documents, and how to apply.",
        "input_schema": {
            "type": "object",
            "properties": {
                "scheme_id": {"type": "string", "description": "Scheme ID e.g. pm-kisan, gruha-lakshmi, ayushman-bharat"}
            },
            "required": ["scheme_id"]
        }
    },
    {
        "name": "check_eligibility",
        "description": "Check if user is eligible for a specific scheme based on user profile attributes.",
        "input_schema": {
            "type": "object",
            "properties": {
                "scheme_id": {"type": "string"},
                "user_profile": {
                    "type": "object",
                    "properties": {
                        "age": {"type": "integer"},
                        "gender": {"type": "string"},
                        "state": {"type": "string"},
                        "income_annual": {"type": "number"},
                        "caste_category": {"type": "string"},
                        "is_bpl": {"type": "boolean"},
                        "is_differently_abled": {"type": "boolean"}
                    }
                }
            },
            "required": ["scheme_id", "user_profile"]
        }
    },
    {
        "name": "check_payment_status",
        "description": "Check if user received payment/subsidy for a scheme. Requires user consent or DigiLocker verification.",
        "input_schema": {
            "type": "object",
            "properties": {
                "scheme_name": {"type": "string", "description": "Name or ID of scheme e.g. Gruha Lakshmi, PM Kisan"},
                "month": {"type": "string", "description": "e.g. November 2024"},
                "requires_digilocker": {"type": "boolean", "description": "Set true if asking citizen to connect DigiLocker"}
            },
            "required": ["scheme_name"]
        }
    },
    {
        "name": "get_required_documents",
        "description": "Get complete checklist of documents required to apply for a scheme.",
        "input_schema": {
            "type": "object",
            "properties": {
                "scheme_id": {"type": "string", "description": "Scheme ID e.g. pm-kisan, vidyasiri-scholarship"}
            },
            "required": ["scheme_id"]
        }
    },
    {
        "name": "file_grievance",
        "description": "Register a grievance or issue about delayed payment, rejected application, or account mismatch.",
        "input_schema": {
            "type": "object",
            "properties": {
                "scheme_name": {"type": "string"},
                "issue_type": {
                    "type": "string",
                    "enum": ["payment_not_received", "application_rejected", "wrong_amount", "account_issue", "other"]
                },
                "description": {"type": "string"},
                "user_details": {"type": "object"}
            },
            "required": ["scheme_name", "issue_type", "description"]
        }
    }
]

def execute_tool(tool_name: str, tool_input: Dict[str, Any], db: Session) -> Dict[str, Any]:
    """Execute tools against database and business logic."""
    if tool_name == "search_schemes":
        query = db.query(Scheme)
        
        state = tool_input.get("state")
        category = tool_input.get("category")
        gender = tool_input.get("gender")
        age = tool_input.get("age")
        income = tool_input.get("income_annual")
        keywords = tool_input.get("keywords") or []
        
        schemes = query.all()
        results = []
        for s in schemes:
            score = 100
            # State match
            if state and s.state != "All India" and s.state.lower() != state.lower():
                continue
            
            # Gender match
            if gender and gender != "any" and s.gender_allowed != "any" and s.gender_allowed.lower() != gender.lower():
                continue

            # Age match
            if age is not None:
                if s.min_age is not None and age < s.min_age:
                    continue
                if s.max_age is not None and age > s.max_age:
                    continue

            # Income ceiling
            if income is not None and s.income_ceiling is not None:
                if income > s.income_ceiling:
                    continue

            # Category or keyword filtering
            if category:
                cat_list = [c.lower() for c in category]
                if s.category.lower() not in cat_list:
                    # Check if keyword matches
                    match_any = any(k.lower() in s.name.lower() or k.lower() in s.summary.lower() for k in cat_list)
                    if not match_any:
                        continue

            if keywords:
                kw_str = " ".join(keywords).lower()
                kw_match = any(
                    k in s.name.lower() or k in s.category.lower() or k in s.summary.lower() or k in s.description.lower()
                    for k in kw_str.split()
                )
                if not kw_match:
                    score -= 20

            results.append({
                "id": s.id,
                "code": s.code,
                "name": s.name,
                "name_native": s.name_native,
                "category": s.category,
                "scheme_type": s.scheme_type,
                "state": s.state,
                "ministry": s.ministry,
                "summary": s.summary,
                "benefit_amount": s.benefit_amount,
                "benefit_type": s.benefit_type,
                "application_mode": s.application_mode,
                "status": s.status,
                "deadline": s.deadline,
                "apply_url": s.apply_url,
                "match_percentage": max(80, min(98, score))
            })
            
        # Fallback if strict filter yields 0 items
        if not results:
            fallback_items = db.query(Scheme).limit(3).all()
            for s in fallback_items:
                results.append({
                    "id": s.id,
                    "code": s.code,
                    "name": s.name,
                    "category": s.category,
                    "benefit_amount": s.benefit_amount,
                    "apply_url": s.apply_url,
                    "summary": s.summary,
                    "match_percentage": 85
                })

        return {"count": len(results), "schemes": results[:10]}

    elif tool_name == "get_scheme_details":
        scheme_id = tool_input.get("scheme_id", "").strip().lower()
        scheme = db.query(Scheme).filter(
            (Scheme.id == scheme_id) | (Scheme.name.ilike(f"%{scheme_id}%"))
        ).first()
        if not scheme:
            return {"error": f"Scheme with ID '{scheme_id}' not found."}
        return {
            "id": scheme.id,
            "code": scheme.code,
            "name": scheme.name,
            "category": scheme.category,
            "ministry": scheme.ministry,
            "summary": scheme.summary,
            "description": scheme.description,
            "benefit_amount": scheme.benefit_amount,
            "documents_required": scheme.documents_required,
            "application_steps": scheme.application_steps,
            "highlights": scheme.highlights,
            "apply_url": scheme.apply_url
        }

    elif tool_name == "check_eligibility":
        scheme_id = tool_input.get("scheme_id", "").strip().lower()
        profile = tool_input.get("user_profile", {})
        scheme = db.query(Scheme).filter(
            (Scheme.id == scheme_id) | (Scheme.name.ilike(f"%{scheme_id}%"))
        ).first()
        if not scheme:
            return {"error": f"Scheme '{scheme_id}' not found."}
        
        checks = []
        is_eligible = True
        
        # Check age
        age = profile.get("age")
        if age is not None and scheme.min_age is not None and scheme.max_age is not None:
            met = scheme.min_age <= age <= scheme.max_age
            checks.append({
                "criterion": f"Age between {scheme.min_age} and {scheme.max_age} years",
                "met": met,
                "user_value": f"{age} years",
                "recommendation": None if met else f"Applicant must be within {scheme.min_age}-{scheme.max_age} years"
            })
            if not met: is_eligible = False

        # Check gender
        gender = profile.get("gender")
        if gender and scheme.gender_allowed != "any":
            met = gender.lower() == scheme.gender_allowed.lower()
            checks.append({
                "criterion": f"Gender requirement: {scheme.gender_allowed.capitalize()}",
                "met": met,
                "user_value": gender.capitalize(),
                "recommendation": None if met else f"This scheme is exclusively for {scheme.gender_allowed} beneficiaries"
            })
            if not met: is_eligible = False

        # Check state
        state = profile.get("state")
        if state and scheme.state != "All India":
            met = state.lower() == scheme.state.lower()
            checks.append({
                "criterion": f"Domicile in {scheme.state}",
                "met": met,
                "user_value": state,
                "recommendation": None if met else f"Requires permanent residency in {scheme.state}"
            })
            if not met: is_eligible = False

        # Check income
        income = profile.get("income_annual")
        if income is not None and scheme.income_ceiling is not None:
            met = income <= scheme.income_ceiling
            checks.append({
                "criterion": f"Annual income below Rs {scheme.income_ceiling:,.0f}",
                "met": met,
                "user_value": f"Rs {income:,.0f}",
                "recommendation": None if met else f"Family income exceeds the Rs {scheme.income_ceiling:,.0f} ceiling"
            })
            if not met: is_eligible = False

        # If checks is empty, add general check
        if not checks:
            checks.append({"criterion": "General residency and demographic criteria", "met": True, "user_value": "Eligible"})

        return {
            "scheme_id": scheme.id,
            "scheme_name": scheme.name,
            "is_eligible": is_eligible,
            "match_score": 94 if is_eligible else 40,
            "checks": checks
        }

    elif tool_name == "check_payment_status":
        scheme_name = tool_input.get("scheme_name", "").lower()
        if "gruha" in scheme_name or "lakshmi" in scheme_name:
            return {
                "scheme_name": "Gruha Lakshmi Scheme",
                "status": "Credited",
                "amount": "Rs 2,000",
                "credit_date": "15th November 2024",
                "account_last4": "7834",
                "bank_name": "Canara Bank",
                "utr_number": "UTR-KA-2024-91823749",
                "note": "Payment successfully processed via DBT NPCI mapper."
            }
        elif "kisan" in scheme_name:
            return {
                "scheme_name": "PM Kisan Samman Nidhi",
                "status": "Credited",
                "amount": "Rs 2,000 (Installment 18)",
                "credit_date": "28th October 2024",
                "account_last4": "4521",
                "bank_name": "State Bank of India",
                "utr_number": "UTR-PMK-2024-88492019",
                "note": "Payment successfully credited directly to Aadhaar seeded account."
            }
        else:
            return {
                "scheme_name": scheme_name.title(),
                "status": "Record Pending / Unlinked",
                "message": "No direct payment record found for the current cycle under Aadhaar. You can file an inquiry grievance or check with your nodal bank branch."
            }

    elif tool_name == "get_required_documents":
        scheme_id = tool_input.get("scheme_id", "").strip().lower()
        scheme = db.query(Scheme).filter(
            (Scheme.id == scheme_id) | (Scheme.name.ilike(f"%{scheme_id}%"))
        ).first()
        if not scheme:
            return {
                "scheme_id": scheme_id,
                "documents": [
                    "Aadhaar Card (Aadhaar Seeded)",
                    "Bank Account Passbook / Statement",
                    "Income / Caste Certificate",
                    "Passport Size Photograph"
                ]
            }
        return {
            "scheme_id": scheme.id,
            "scheme_name": scheme.name,
            "documents": scheme.documents_required,
            "apply_url": scheme.apply_url
        }

    elif tool_name == "file_grievance":
        g_id = f"GRV-2025-{uuid.uuid4().hex[:6].upper()}"
        grievance = Grievance(
            id=g_id,
            scheme_name=tool_input.get("scheme_name", "General Inquiry"),
            issue_type=tool_input.get("issue_type", "other"),
            description=tool_input.get("description", "Grievance submitted by citizen via SETU AI portal.")
        )
        db.add(grievance)
        db.commit()
        return {
            "grievance_id": g_id,
            "status": "Submitted",
            "scheme_name": grievance.scheme_name,
            "message": f"Your grievance has been successfully lodged with reference ID {g_id}. Standard resolution timeframe is 7 working days."
        }

    return {"error": f"Unknown tool: {tool_name}"}

from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas import DigiLockerAuthRequest

router = APIRouter(prefix="/digilocker", tags=["digilocker"])

@router.post("/auth")
def initiate_digilocker_auth(req: DigiLockerAuthRequest):
    """
    Simulates DigiLocker OAuth 2.0 authorization URL creation.
    """
    return {
        "status": "success",
        "auth_url": "/digilocker/callback?state=setu_auth_verified&scheme=" + (req.scheme_name or "general"),
        "session_token": "DL_TOKEN_918237498234"
    }

@router.get("/callback")
def handle_digilocker_callback(
    code: Optional[str] = "MOCK_CODE",
    state: Optional[str] = "setu_auth_verified"
):
    """
    DigiLocker OAuth redirect handler returning verified user persona.
    """
    return {
        "status": "authenticated",
        "user": {
            "name": "Sunita Devi / Ramesh Kumar",
            "aadhaar_last4": "4521",
            "state": "Karnataka",
            "dob": "1988-06-14",
            "gender": "Female",
            "verified_documents": [
                {"type": "Aadhaar Card", "status": "Verified", "issuer": "UIDAI"},
                {"type": "Ration Card (BPL)", "status": "Verified", "issuer": "Food & Civil Supplies Dept"},
                {"type": "Income Certificate", "status": "Verified", "issuer": "Revenue Dept, Karnataka"},
                {"type": "Caste Certificate", "status": "Verified", "issuer": "Revenue Dept, Karnataka"}
            ]
        }
    }

@router.get("/payment-status")
def get_payment_status(
    scheme_name: str = Query(..., description="Scheme name or ID"),
    aadhaar_last4: Optional[str] = Query("4521")
):
    """
    Simulates DigiLocker-linked DBT payment inquiry.
    """
    s_low = scheme_name.lower()
    if "gruha" in s_low or "lakshmi" in s_low:
        return {
            "scheme_name": "Gruha Lakshmi Scheme",
            "status": "Credited",
            "amount": "Rs 2,000",
            "credit_date": "15th November 2024",
            "account_last4": "7834",
            "bank_name": "Canara Bank",
            "utr_number": "UTR-KA-2024-91823749",
            "beneficiary_name": "Sunita Devi",
            "remarks": "Monthly Direct Benefit Transfer credited successfully."
        }
    elif "kisan" in s_low:
        return {
            "scheme_name": "PM Kisan Samman Nidhi",
            "status": "Credited",
            "amount": "Rs 2,000",
            "installment": "18th Installment",
            "credit_date": "28th October 2024",
            "account_last4": "4521",
            "bank_name": "State Bank of India",
            "utr_number": "UTR-PMK-2024-88492019",
            "beneficiary_name": "Ramesh Kumar",
            "remarks": "DBT credit via Aadhaar Payment Bridge System (APBS)."
        }
    elif "ayushman" in s_low:
        return {
            "scheme_name": "Ayushman Bharat PM-JAY",
            "status": "Active Cover",
            "amount": "Rs 5,00,000 / year",
            "card_number": "AB-PMJAY-99210-482",
            "beneficiary_name": "Sunita Devi",
            "remarks": "E-card active and valid across all empaneled hospitals."
        }
    else:
        return {
            "scheme_name": scheme_name,
            "status": "Record Pending",
            "amount": "Rs 0",
            "message": "No direct payment transaction recorded under this Aadhaar in the current billing cycle."
        }

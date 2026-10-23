from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class SchemeBase(BaseModel):
    id: str
    code: str
    name: str
    name_native: Optional[str] = None
    category: str
    scheme_type: str
    state: Optional[str] = None
    ministry: str
    summary: str
    benefit_amount: str
    benefit_type: str
    application_mode: str
    status: str
    deadline: Optional[str] = None
    apply_url: str
    last_updated: Optional[str] = None
    view_count: Optional[int] = 0

class SchemeDetail(SchemeBase):
    description: str
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    gender_allowed: Optional[str] = "any"
    income_ceiling: Optional[float] = None
    caste_eligibility: Optional[List[str]] = []
    bpl_required: Optional[bool] = False
    disability_required: Optional[bool] = False
    student_only: Optional[bool] = False
    farmer_only: Optional[bool] = False
    additional_eligibility: Optional[List[str]] = []
    highlights: Optional[List[str]] = []
    benefits_breakdown: Optional[List[str]] = []
    documents_required: Optional[List[str]] = []
    application_steps: Optional[List[str]] = []
    faqs: Optional[List[Dict[str, str]]] = []
    match_percentage: Optional[int] = None

class SchemeListResponse(BaseModel):
    total: int
    page: int
    limit: int
    schemes: List[SchemeDetail]

class WizardRequest(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = "any"
    state: Optional[str] = None
    is_differently_abled: Optional[bool] = False
    income_annual: Optional[float] = None
    caste_category: Optional[str] = "general"
    is_bpl: Optional[bool] = False
    needs: Optional[List[str]] = []

class WizardResponse(BaseModel):
    total_matched: int
    schemes: List[SchemeDetail]

class ChatMessage(BaseModel):
    role: str # user or assistant
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default_session"
    language: Optional[str] = "en"
    conversation_history: Optional[List[ChatMessage]] = []
    user_profile: Optional[Dict[str, Any]] = None

class GrievanceCreate(BaseModel):
    scheme_name: str
    issue_type: str
    description: str
    citizen_name: Optional[str] = None
    citizen_phone: Optional[str] = None
    aadhaar_last4: Optional[str] = None

class DigiLockerAuthRequest(BaseModel):
    consent: bool
    scheme_name: Optional[str] = None

class CSCLoginRequest(BaseModel):
    operator_id: str
    password: str

class CSCAssistRequest(BaseModel):
    citizen_name: str
    phone: str
    age: int
    gender: str
    state: str
    income_annual: float
    caste_category: str
    is_bpl: bool
    needs: List[str]

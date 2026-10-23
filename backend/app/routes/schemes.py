from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.database import get_db, cache
from app.models import Scheme
from app.schemas import SchemeDetail, SchemeListResponse

router = APIRouter(prefix="/schemes", tags=["schemes"])

@router.get("", response_model=SchemeListResponse)
def get_schemes(
    q: Optional[str] = Query(None, description="Search term across name, summary, ministry"),
    category: Optional[str] = Query(None, description="Category filter"),
    state: Optional[str] = Query(None, description="State filter"),
    scheme_type: Optional[str] = Query(None, description="Central or State"),
    benefit_type: Optional[str] = Query(None, description="Cash, Scholarship, Subsidy, Housing, Insurance, Loan"),
    application_mode: Optional[str] = Query(None, description="Online, Offline, Both"),
    status: Optional[str] = Query(None, description="Open, Closed"),
    sort: Optional[str] = Query("relevance", description="relevance, newest, benefit_amount"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Scheme)

    # Search filter
    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Scheme.name.ilike(term),
                Scheme.summary.ilike(term),
                Scheme.ministry.ilike(term),
                Scheme.category.ilike(term),
                Scheme.code.ilike(term)
            )
        )

    # Category filter
    if category and category.lower() != "all":
        query = query.filter(Scheme.category.ilike(category))

    # State filter
    if state and state.lower() not in ["all", "all india"]:
        query = query.filter(or_(Scheme.state == state, Scheme.state == "All India"))

    # Central/State scheme type
    if scheme_type and scheme_type.lower() != "all":
        query = query.filter(Scheme.scheme_type.ilike(scheme_type))

    # Benefit type
    if benefit_type and benefit_type.lower() != "all":
        query = query.filter(Scheme.benefit_type.ilike(benefit_type))

    # Application mode
    if application_mode and application_mode.lower() != "all":
        query = query.filter(Scheme.application_mode.ilike(application_mode))

    # Status
    if status and status.lower() != "all":
        query = query.filter(Scheme.status.ilike(status))

    # Sorting
    if sort == "newest":
        query = query.order_by(desc(Scheme.created_at))
    elif sort == "benefit_amount":
        query = query.order_by(desc(Scheme.view_count))
    else: # relevance
        query = query.order_by(desc(Scheme.view_count))

    total = query.count()
    schemes = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "schemes": schemes
    }

@router.get("/popular", response_model=List[SchemeDetail])
def get_popular_schemes(db: Session = Depends(get_db)):
    # Return 6 primary flagship schemes
    schemes = db.query(Scheme).order_by(desc(Scheme.view_count)).limit(6).all()
    return schemes

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    cached_cats = cache.get("categories_summary")
    if cached_cats:
        return cached_cats

    all_categories = [
        {"id": "education", "name": "Education & Scholarships", "native_name": "ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ (शिक्षा)", "count": 234, "icon": "GraduationCap", "color": "#1A3A6B"},
        {"id": "health", "name": "Health & Insurance", "native_name": "ಆರೋಗ್ಯ ಮತ್ತು ವಿಮೆ (स्वास्थ्य)", "count": 189, "icon": "HeartPulse", "color": "#138808"},
        {"id": "agriculture", "name": "Agriculture & Farmers", "native_name": "ಕೃಷಿ ಮತ್ತು ರೈತ ಕಲ್ಯಾಣ (कृषि)", "count": 312, "icon": "Sprout", "color": "#FF6B00"},
        {"id": "women", "name": "Women Empowerment", "native_name": "ಮಹಿಳಾ ಸಬಲೀಕರಣ (महिला कल्याण)", "count": 156, "icon": "Users", "color": "#8B5CF6"},
        {"id": "housing", "name": "Housing & Shelter", "native_name": "ವಸತಿ ಮತ್ತು ಆಶ್ರಯ (आवास)", "count": 145, "icon": "Home", "color": "#0284C7"},
        {"id": "employment", "name": "Employment & Skills", "native_name": "ಉದ್ಯೋಗ ಮತ್ತು ಕೌಶಲ್ಯ (रोजगार)", "count": 98, "icon": "Briefcase", "color": "#0D9488"},
        {"id": "disability", "name": "Disability Welfare", "native_name": "ದಿವ್ಯಾಂಗ ಕಲ್ಯಾಣ (दिव्यांगजन)", "count": 67, "icon": "Accessibility", "color": "#D97706"},
        {"id": "senior_citizens", "name": "Senior Citizens", "native_name": "ಹಿರಿಯ ನಾಗರಿಕರ ಕಲ್ಯಾಣ (वरिष्ठ नागरिक)", "count": 54, "icon": "UserCheck", "color": "#4F46E5"},
        {"id": "minority", "name": "Minority Welfare", "native_name": "ಅಲ್ಪಸಂಖ್ಯಾತರ ಕಲ್ಯಾಣ (अल्पसंख्यक)", "count": 76, "icon": "Shield", "color": "#059669"},
        {"id": "entrepreneurship", "name": "Entrepreneurship & Loans", "native_name": "ಉದ್ಯಮಶೀಲತೆ ಮತ್ತು ಸಾಲ (उद्यमिता)", "count": 123, "icon": "TrendingUp", "color": "#DC2626"},
        {"id": "sports", "name": "Sports & Youth Affairs", "native_name": "ಕ್ರೀಡೆ ಮತ್ತು ಯುವಜನ (खेल)", "count": 45, "icon": "Award", "color": "#EA580C"},
        {"id": "environment", "name": "Environment & Solar", "native_name": "ಪರಿಸರ ಮತ್ತು ಸೌರ ಶಕ್ತಿ (पर्यावरण)", "count": 38, "icon": "Sun", "color": "#16A34A"},
    ]
    cache.set("categories_summary", all_categories, ttl_seconds=3600)
    return all_categories

@router.get("/states")
def get_states():
    return [
        {"name": "All India", "code": "IN", "schemes_count": 850},
        {"name": "Karnataka", "code": "KA", "schemes_count": 218},
        {"name": "Maharashtra", "code": "MH", "schemes_count": 195},
        {"name": "Tamil Nadu", "code": "TN", "schemes_count": 182},
        {"name": "Uttar Pradesh", "code": "UP", "schemes_count": 240},
        {"name": "Gujarat", "code": "GJ", "schemes_count": 164},
        {"name": "Rajasthan", "code": "RJ", "schemes_count": 155},
        {"name": "Madhya Pradesh", "code": "MP", "schemes_count": 172},
        {"name": "Andhra Pradesh", "code": "AP", "schemes_count": 168},
        {"name": "Telangana", "code": "TS", "schemes_count": 149},
        {"name": "Kerala", "code": "KL", "schemes_count": 138},
        {"name": "West Bengal", "code": "WB", "schemes_count": 160},
        {"name": "Bihar", "code": "BR", "schemes_count": 142},
        {"name": "Punjab", "code": "PB", "schemes_count": 110},
        {"name": "Haryana", "code": "HR", "schemes_count": 125},
        {"name": "Odisha", "code": "OD", "schemes_count": 134},
        {"name": "Assam", "code": "AS", "schemes_count": 98},
        {"name": "Delhi", "code": "DL", "schemes_count": 115}
    ]

@router.get("/{scheme_id}", response_model=SchemeDetail)
def get_scheme_by_id(scheme_id: str, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(
        or_(Scheme.id == scheme_id.lower(), Scheme.code == scheme_id)
    ).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    # Increment view count
    scheme.view_count = (scheme.view_count or 0) + 1
    db.commit()

    return scheme

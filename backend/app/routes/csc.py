from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import CSCUser, CitizenQueryLog, Scheme
from app.schemas import CSCLoginRequest, CSCAssistRequest

router = APIRouter(prefix="/csc", tags=["csc"])

@router.post("/login")
def csc_login(req: CSCLoginRequest, db: Session = Depends(get_db)):
    """
    Mock login for Common Service Centre (CSC) Village Level Entrepreneurs (VLE).
    Credentials: operator@csc.gov.in / demo123
    """
    if req.operator_id.strip() == "operator@csc.gov.in" and req.password == "demo123":
        # Get or create operator record
        user = db.query(CSCUser).filter(CSCUser.operator_id == req.operator_id).first()
        if not user:
            user = CSCUser(
                operator_id=req.operator_id,
                name="Venkatesh Rao",
                center_code="CSC-KA-BLR-041",
                state="Karnataka",
                district="Bengaluru Rural",
                today_assisted_count=18
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        return {
            "token": "csc_vle_jwt_token_2025_valid",
            "operator": {
                "id": user.id,
                "name": user.name,
                "email": user.operator_id,
                "center_code": user.center_code,
                "district": user.district,
                "state": user.state,
                "today_assisted_count": user.today_assisted_count
            }
        }
    raise HTTPException(status_code=401, detail="Invalid CSC Operator credentials. Use operator@csc.gov.in / demo123")

@router.get("/dashboard")
def get_csc_dashboard(db: Session = Depends(get_db)):
    """
    Returns operator dashboard metrics and recent citizen assistance queries.
    """
    recent_queries = db.query(CitizenQueryLog).order_by(desc(CitizenQueryLog.created_at)).limit(10).all()
    
    # If no queries yet, generate mock sample list
    if not recent_queries:
        sample_logs = [
            CitizenQueryLog(citizen_name="Basavaraj Patil", phone="9845012345", state="Karnataka", category="Agriculture", matched_schemes=["PM-Kisan", "PM Fasal Bima"], assisted_by_csc=True),
            CitizenQueryLog(citizen_name="Manjula Devi", phone="9448098765", state="Karnataka", category="Women", matched_schemes=["Gruha Lakshmi", "Sukanya Samriddhi"], assisted_by_csc=True),
            CitizenQueryLog(citizen_name="Anand Kumar", phone="9900112233", state="Karnataka", category="Education", matched_schemes=["Vidyasiri", "NSP Post-Matric"], assisted_by_csc=True),
            CitizenQueryLog(citizen_name="Shivarajappa", phone="9741234567", state="Karnataka", category="Housing", matched_schemes=["PM Awas Gramin"], assisted_by_csc=True)
        ]
        db.add_all(sample_logs)
        db.commit()
        recent_queries = db.query(CitizenQueryLog).order_by(desc(CitizenQueryLog.created_at)).limit(10).all()

    return {
        "stats": {
            "today_assisted": 19,
            "monthly_assisted": 432,
            "schemes_sanctioned": 128,
            "grievances_resolved": 41
        },
        "recent_citizens": [
            {
                "id": q.id,
                "name": q.citizen_name,
                "phone": q.phone,
                "state": q.state,
                "category": q.category,
                "matched_schemes": q.matched_schemes,
                "created_at": q.created_at.strftime("%d %b %Y, %I:%M %p")
            }
            for q in recent_queries
        ]
    }

@router.post("/assist")
def submit_citizen_assist(req: CSCAssistRequest, db: Session = Depends(get_db)):
    """
    Saves citizen assisted query and matches top schemes for printing summary.
    """
    # Query database for schemes matching citizen
    query = db.query(Scheme)
    if req.state and req.state != "All India":
        query = query.filter((Scheme.state == req.state) | (Scheme.state == "All India"))
    
    matched = query.limit(5).all()
    scheme_names = [s.name for s in matched]

    log = CitizenQueryLog(
        citizen_name=req.citizen_name,
        phone=req.phone,
        state=req.state,
        category=", ".join(req.needs),
        matched_schemes=scheme_names,
        assisted_by_csc=True
    )
    db.add(log)
    
    # Increment operator counter
    user = db.query(CSCUser).first()
    if user:
        user.today_assisted_count = (user.today_assisted_count or 0) + 1
    
    db.commit()

    return {
        "status": "success",
        "reference_id": f"CSC-ASST-{log.id:05d}",
        "citizen_name": req.citizen_name,
        "matched_schemes": [
            {
                "id": s.id,
                "code": s.code,
                "name": s.name,
                "benefit_amount": s.benefit_amount,
                "apply_url": s.apply_url,
                "documents_required": s.documents_required
            }
            for s in matched
        ]
    }

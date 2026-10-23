from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Scheme
from app.schemas import WizardRequest, WizardResponse, SchemeDetail

router = APIRouter(prefix="/wizard", tags=["wizard"])

@router.post("/match", response_model=WizardResponse)
def match_eligibility(req: WizardRequest, db: Session = Depends(get_db)):
    all_schemes = db.query(Scheme).all()
    matched_results = []

    # Map user needs to category tags
    needs_map = {
        "education": "education",
        "health": "health",
        "housing": "housing",
        "job": "employment",
        "skill": "employment",
        "agriculture": "agriculture",
        "farmer": "agriculture",
        "business": "entrepreneurship",
        "loan": "entrepreneurship",
        "pension": "senior_citizens",
        "women": "women",
        "maternity": "women",
        "marriage": "women",
        "solar": "environment",
        "disability": "disability"
    }

    user_categories = set()
    for need in req.needs or []:
        n_low = need.lower()
        for k, v in needs_map.items():
            if k in n_low:
                user_categories.add(v)

    for scheme in all_schemes:
        score = 65 # Base probability

        # 1. State check
        if scheme.state != "All India":
            if req.state and req.state.lower() == scheme.state.lower():
                score += 15
            else:
                # If scheme belongs to a specific other state, disqualify or severely penalize
                score -= 40
                continue
        else:
            score += 10

        # 2. Gender check
        if scheme.gender_allowed != "any":
            if req.gender and req.gender.lower() == scheme.gender_allowed.lower():
                score += 15
            else:
                continue # Disqualify
        else:
            score += 5

        # 3. Age check
        if req.age is not None:
            if scheme.min_age is not None and scheme.max_age is not None:
                if scheme.min_age <= req.age <= scheme.max_age:
                    score += 10
                else:
                    score -= 30
                    continue

        # 4. Income check
        if req.income_annual is not None and scheme.income_ceiling is not None:
            if req.income_annual <= scheme.income_ceiling:
                score += 10
            else:
                score -= 25

        # 5. BPL Card
        if scheme.bpl_required:
            if req.is_bpl:
                score += 15
            else:
                score -= 20

        # 6. Differently Abled
        if scheme.disability_required:
            if req.is_differently_abled:
                score += 25
            else:
                continue

        # 7. Category Need alignment
        if user_categories:
            if scheme.category in user_categories:
                score += 20
            else:
                score -= 10

        final_match = min(98, max(50, score))
        
        # Build scheme detail object with match_percentage
        s_dict = {c.name: getattr(scheme, c.name) for c in scheme.__table__.columns}
        s_dict["match_percentage"] = final_match
        matched_results.append(s_dict)

    # Sort descending by match percentage
    matched_results.sort(key=lambda x: x["match_percentage"], reverse=True)

    return {
        "total_matched": len(matched_results),
        "schemes": matched_results
    }

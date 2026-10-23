import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, JSON
from app.database import Base

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(String(100), primary_key=True, index=True) # e.g. pm-kisan
    code = Column(String(50), unique=True, index=True)      # e.g. GOI/MoAFW/2024/0001
    name = Column(String(255), nullable=False, index=True)
    name_native = Column(String(255), nullable=True)        # Native script name e.g. Hindi/Kannada
    category = Column(String(100), nullable=False, index=True) # agriculture, health, education, etc.
    scheme_type = Column(String(50), nullable=False, default="Central") # Central or State
    state = Column(String(100), nullable=True, index=True) # e.g. Karnataka, All India
    ministry = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    
    # Financial & Benefit details
    benefit_amount = Column(String(255), nullable=False) # e.g. Rs 6,000/year
    benefit_type = Column(String(100), nullable=False)   # Cash, Scholarship, Subsidy, Housing, Insurance, Loan
    application_mode = Column(String(50), nullable=False, default="Online") # Online, Offline, Both
    status = Column(String(50), nullable=False, default="Open") # Open, Closed
    deadline = Column(String(100), nullable=True) # e.g. 31 Dec 2025
    apply_url = Column(String(500), nullable=False)
    
    # Eligibility rules stored as JSON
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)
    gender_allowed = Column(String(50), default="any") # male, female, transgender, any
    income_ceiling = Column(Float, nullable=True) # annual max income in INR
    caste_eligibility = Column(JSON, default=list) # ["general", "obc", "sc", "st"]
    bpl_required = Column(Boolean, default=False)
    disability_required = Column(Boolean, default=False)
    student_only = Column(Boolean, default=False)
    farmer_only = Column(Boolean, default=False)
    additional_eligibility = Column(JSON, default=list)
    
    # Detailed Tabs Content (JSON structures)
    highlights = Column(JSON, default=list)
    benefits_breakdown = Column(JSON, default=list)
    documents_required = Column(JSON, default=list)
    application_steps = Column(JSON, default=list)
    faqs = Column(JSON, default=list)
    
    # Metadata
    last_updated = Column(String(50), default="26 Sep 2025")
    view_count = Column(Integer, default=1240)
    created_at = Column(DateTime, default=datetime.utcnow)

class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(String(50), primary_key=True, index=True) # e.g. GRV-2025-9832
    scheme_name = Column(String(255), nullable=False)
    issue_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    citizen_name = Column(String(100), nullable=True)
    citizen_phone = Column(String(20), nullable=True)
    aadhaar_last4 = Column(String(10), nullable=True)
    status = Column(String(50), default="Submitted")
    created_at = Column(DateTime, default=datetime.utcnow)

class CSCUser(Base):
    __tablename__ = "csc_users"

    id = Column(Integer, primary_key=True, index=True)
    operator_id = Column(String(100), unique=True, index=True)
    center_code = Column(String(50), default="CSC-KA-BLR-041")
    name = Column(String(100), default="Venkatesh Rao")
    state = Column(String(100), default="Karnataka")
    district = Column(String(100), default="Bengaluru Rural")
    today_assisted_count = Column(Integer, default=18)
    created_at = Column(DateTime, default=datetime.utcnow)

class CitizenQueryLog(Base):
    __tablename__ = "citizen_queries"

    id = Column(Integer, primary_key=True, index=True)
    citizen_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    state = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)
    matched_schemes = Column(JSON, default=list)
    assisted_by_csc = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

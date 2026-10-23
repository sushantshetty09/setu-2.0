import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import init_db_data
from app.routes import schemes, wizard, chat, digilocker, csc, grievance

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("setu")

def init_app_database():
    logger.info("Initializing database tables and seed data...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        init_db_data(db)
    finally:
        db.close()

# Auto-initialize on module load to support test runners and WSGI/ASGI servers
init_app_database()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_app_database()
    logger.info("SETU Backend running and ready.")
    yield
    logger.info("SETU Backend shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    description="SETU (सेतु) - AI-Powered Government Schemes Discovery Portal API"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:8000",
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(schemes.router, prefix=settings.API_V1_STR)
app.include_router(wizard.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(digilocker.router, prefix=settings.API_V1_STR)
app.include_router(csc.router, prefix=settings.API_V1_STR)
app.include_router(grievance.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "portal": "SETU - One Voice. Every Service.",
        "version": settings.VERSION,
        "docs": "/docs",
        "status": "online"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "SETU Backend"}

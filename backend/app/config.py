import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SETU - AI Government Schemes Discovery Portal"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # AI - Primary: Google Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-1.5-flash"

    # AI - Legacy Anthropic (fallback)
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    CLAUDE_MODEL: str = "claude-3-5-sonnet-20241022"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./setu.db")
    
    # Redis Cache (optional, with in-memory fallback)
    REDIS_URL: str = os.getenv("REDIS_URL", "")
    
    # Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "setu_super_secret_production_key_2025_ind_gov_portal")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # DigiLocker
    DIGILOCKER_CLIENT_ID: str = os.getenv("DIGILOCKER_CLIENT_ID", "MOCK")
    DIGILOCKER_CLIENT_SECRET: str = os.getenv("DIGILOCKER_CLIENT_SECRET", "MOCK")
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

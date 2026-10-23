import json
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("setu.database")

# Handle SQLite vs PostgreSQL
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis / In-Memory Cache implementation
class CacheManager:
    def __init__(self):
        self._redis = None
        self._memory = {}
        if settings.REDIS_URL:
            try:
                import redis
                self._redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
                logger.info("Connected to Redis cache")
            except Exception as e:
                logger.warning(f"Could not connect to Redis, using in-memory cache: {e}")

    def get(self, key: str):
        if self._redis:
            try:
                val = self._redis.get(key)
                return json.loads(val) if val else None
            except Exception:
                pass
        return self._memory.get(key)

    def set(self, key: str, value: any, ttl_seconds: int = 3600):
        if self._redis:
            try:
                self._redis.setex(key, ttl_seconds, json.dumps(value))
                return
            except Exception:
                pass
        self._memory[key] = value

    def clear(self):
        if self._redis:
            try:
                self._redis.flushdb()
            except Exception:
                pass
        self._memory.clear()

cache = CacheManager()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

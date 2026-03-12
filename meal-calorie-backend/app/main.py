from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.exceptions import AppException
from app.db.database import engine, Base
from app.routers.auth import router as auth_router
from app.routers.calories import router as calories_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database connected")
    yield
    # Shutdown
    await engine.dispose()
    print("✅ Database disconnected")


app = FastAPI(
    title="Meal Calorie Count Generator",
    description="API for calculating meal calories using USDA FoodData Central",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# Global Exception Handler
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "code": exc.code,
            "message": exc.message
        }
    )

# Routers
app.include_router(auth_router)
app.include_router(calories_router)

@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "environment": settings.environment}
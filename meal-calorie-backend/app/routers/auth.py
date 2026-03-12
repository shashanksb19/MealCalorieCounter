from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.user import RegisterRequest, LoginRequest, AuthResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(
    payload: RegisterRequest,
    db: AsyncSession = Depends(get_db)
) -> AuthResponse:
    service = AuthService(db)
    return await service.register(payload)


@router.post("/login", response_model=AuthResponse, status_code=200)
async def login(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db)
) -> AuthResponse:
    service = AuthService(db)
    return await service.login(payload)
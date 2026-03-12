from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import RegisterRequest, LoginRequest, UserResponse, AuthResponse
from app.core.security import security
from app.core.exceptions import EmailAlreadyExistsError, InvalidCredentialsError
import uuid


class AuthService:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, payload: RegisterRequest) -> AuthResponse:
        # Check if email already exists
        existing_user = await self._get_user_by_email(payload.email)
        if existing_user:
            raise EmailAlreadyExistsError()

        # Create new user
        new_user = User(
            id=str(uuid.uuid4()),
            first_name=payload.first_name,
            last_name=payload.last_name,
            email=payload.email.lower(),
            password=security.hash_password(payload.password)
        )

        self.db.add(new_user)
        await self.db.flush()

        # Generate token
        token = security.create_access_token(new_user.id)
        user_response = UserResponse.model_validate(new_user)

        return AuthResponse(token=token, user=user_response)

    async def login(self, payload: LoginRequest) -> AuthResponse:
        # Find user by email
        user = await self._get_user_by_email(payload.email.lower())

        # Same error whether email or password is wrong (security best practice)
        if not user:
            raise InvalidCredentialsError()

        if not security.verify_password(payload.password, user.password):
            raise InvalidCredentialsError()

        # Generate token
        token = security.create_access_token(user.id)
        user_response = UserResponse.model_validate(user)

        return AuthResponse(token=token, user=user_response)

    async def get_user_by_id(self, user_id: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def _get_user_by_email(self, email: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.email == email.lower())
        )
        return result.scalar_one_or_none()

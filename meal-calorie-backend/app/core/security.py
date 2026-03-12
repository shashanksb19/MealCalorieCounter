from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError
import bcrypt
from app.core.config import settings
from app.core.exceptions import InvalidTokenError, TokenExpiredError

MAX_PASSWORD_BYTES = 72


class SecurityUtils:

    @staticmethod
    def _prepare_password(password: str) -> bytes:
        return password.encode("utf-8")[:MAX_PASSWORD_BYTES]

    @staticmethod
    def hash_password(password: str) -> str:
        password_bytes = SecurityUtils._prepare_password(password)
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode("utf-8")

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        password_bytes = SecurityUtils._prepare_password(plain_password)
        hashed_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(password_bytes, hashed_bytes)

    @staticmethod
    def create_access_token(user_id: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
        payload = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.now(timezone.utc)
        }
        return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

    @staticmethod
    def decode_access_token(token: str) -> str:
        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm]
            )
            user_id: str = payload.get("sub")
            if user_id is None:
                raise InvalidTokenError()
            return user_id
        except ExpiredSignatureError:
            raise TokenExpiredError()
        except DecodeError:
            raise InvalidTokenError()


security = SecurityUtils()
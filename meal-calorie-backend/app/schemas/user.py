from pydantic import BaseModel, EmailStr, field_validator
import re


class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Name must be at least 2 characters long.")
        if len(value) > 50:
            raise ValueError("Name cannot exceed 50 characters.")
        if not value.replace(" ", "").isalpha():
            raise ValueError("Name can only contain letters.")
        return value.title()

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if len(value) > 72:
            raise ValueError("Password cannot exceed 72 characters.")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[0-9]", value):
            raise ValueError("Password must contain at least one number.")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not value or len(value) < 1:
            raise ValueError("Password is required.")
        return value


class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    token: str
    user: UserResponse
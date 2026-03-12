from fastapi import HTTPException, status


class AppException(HTTPException):
    def __init__(self, status_code: int, code: str, message: str):
        super().__init__(status_code=status_code, detail={"code": code, "message": message})
        self.code = code
        self.message = message


# Auth Exceptions
class EmailAlreadyExistsError(AppException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            code="EMAIL_ALREADY_EXISTS",
            message="An account with this email already exists."
        )


class InvalidCredentialsError(AppException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="INVALID_CREDENTIALS",
            message="Invalid email or password."
        )


class TokenExpiredError(AppException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="TOKEN_EXPIRED",
            message="Your session has expired. Please log in again."
        )


class InvalidTokenError(AppException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="INVALID_TOKEN",
            message="Invalid authentication token."
        )


# USDA / Calorie Exceptions
class DishNotFoundError(AppException):
    def __init__(self, dish_name: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="DISH_NOT_FOUND",
            message=f"No matching dish found for '{dish_name}'. Try a more common name."
        )


class NoCalorieDataError(AppException):
    def __init__(self, dish_name: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="NO_CALORIE_DATA",
            message=f"Found '{dish_name}' but calorie data is unavailable for this item."
        )


class USDAApiError(AppException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            code="USDA_API_ERROR",
            message="Unable to reach the nutrition database. Please try again shortly."
        )


# Validation Exceptions
class InvalidServingsError(AppException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="INVALID_SERVINGS",
            message="Servings must be a positive number greater than zero."
        )
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.calories import MealRequest, CalorieResponse
from app.services.usda_service import usda_service
from app.services.auth_service import AuthService
from app.core.security import security
from app.core.exceptions import InvalidTokenError

router = APIRouter(tags=["calories"])
bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db)
):
    token = credentials.credentials
    user_id = security.decode_access_token(token)

    service = AuthService(db)
    user = await service.get_user_by_id(user_id)

    if not user:
        raise InvalidTokenError()

    return user


@router.post("/get-calories", response_model=CalorieResponse, status_code=200)
async def get_calories(
    payload: MealRequest,
    current_user=Depends(get_current_user)
) -> CalorieResponse:
    result = await usda_service.get_calories_for_dish(
        dish_name=payload.dish_name,
        servings=payload.servings
    )
    return CalorieResponse(
        dish_name=result.dish_name,
        servings=result.servings,
        calories_per_serving=result.calories_per_serving,
        total_calories=result.total_calories,
        source=result.source
    )

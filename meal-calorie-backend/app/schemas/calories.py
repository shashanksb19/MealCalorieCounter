from pydantic import BaseModel, field_validator
from typing import Optional


class Macros(BaseModel):
    protein_g: float = 0.0
    carbs_g: float = 0.0
    fat_g: float = 0.0
    fiber_g: float = 0.0
    sugar_g: float = 0.0


class MealRequest(BaseModel):
    dish_name: str
    servings: float

    @field_validator("dish_name")
    @classmethod
    def validate_dish_name(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Dish name must be at least 2 characters long.")
        if len(value) > 100:
            raise ValueError("Dish name cannot exceed 100 characters.")
        return value.lower()

    @field_validator("servings")
    @classmethod
    def validate_servings(cls, value: float) -> float:
        if value <= 0:
            raise ValueError("Servings must be greater than zero.")
        if value > 100:
            raise ValueError("Servings cannot exceed 100.")
        return value


class CalorieResult(BaseModel):
    dish_name: str
    servings: float
    calories_per_serving: float
    total_calories: float
    macros_per_serving: Optional[Macros] = None
    total_macros: Optional[Macros] = None
    source: str = "USDA FoodData Central"


class CalorieResponse(BaseModel):
    dish_name: str
    servings: float
    calories_per_serving: float
    total_calories: float
  
    macros_per_serving: Optional[Macros] = None
    total_macros: Optional[Macros] = None
    source: str

    model_config = {"from_attributes": True}
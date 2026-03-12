import httpx
from app.core.config import settings
from app.core.exceptions import DishNotFoundError, NoCalorieDataError, USDAApiError
from app.schemas.calories import CalorieResult, Macros

USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"
MATCH_THRESHOLD = 0.15


class USDAService:

    def __init__(self):
        self.api_key = settings.usda_api_key
        self.page_size = settings.usda_page_size
        self._cache: dict[str, CalorieResult] = {}

    async def get_calories_for_dish(self, dish_name: str, servings: float) -> CalorieResult:
        cache_key = dish_name.lower().strip()

        if cache_key in self._cache:
            cached = self._cache[cache_key]
            macros_per_serving, total_macros = self._extract_macros_from_cached(cached, servings)
            return CalorieResult(
                dish_name=cached.dish_name,
                servings=servings,
                calories_per_serving=cached.calories_per_serving,
                total_calories=round(cached.calories_per_serving * servings, 2),
                macros_per_serving=macros_per_serving,
                total_macros=total_macros,
                source=cached.source
            )

        raw_results = await self._search_foods(dish_name)

        if not raw_results:
            raise DishNotFoundError(dish_name)

        best_match = self._find_best_match(dish_name, raw_results)
        if not best_match:
            raise DishNotFoundError(dish_name)

        calories_per_serving = self._extract_calories(best_match, dish_name)
        macros_per_serving, total_macros = self._extract_macros(best_match, servings)

        result = CalorieResult(
            dish_name=dish_name,
            servings=servings,
            calories_per_serving=round(calories_per_serving, 2),
            total_calories=round(calories_per_serving * servings, 2),
            macros_per_serving=macros_per_serving,
            total_macros=total_macros,
            source="USDA FoodData Central"
        )

        self._cache[cache_key] = result
        return result

    async def _search_foods(self, query: str) -> list[dict]:
        params = {
            "query": query,
            "api_key": self.api_key,
            "pageSize": self.page_size,
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(USDA_SEARCH_URL, params=params)
                response.raise_for_status()
                data = response.json()
                return data.get("foods", [])
        except httpx.TimeoutException:
            raise USDAApiError()
        except httpx.HTTPStatusError:
            raise USDAApiError()
        except Exception:
            raise USDAApiError()

    def _find_best_match(self, query: str, foods: list[dict]) -> dict | None:
        best_food = None
        best_score = 0.0

        for food in foods:
            description = food.get("description", "").lower()
            score = self._score_match(query.lower(), description)
            if score > best_score:
                best_score = score
                best_food = food

        if best_score < MATCH_THRESHOLD:
            return None

        return best_food

    def _score_match(self, query: str, description: str) -> float:
        query_tokens = set(query.split())
        description_tokens = set(description.split())
        intersection = query_tokens & description_tokens
        union = query_tokens | description_tokens
        jaccard = len(intersection) / len(union) if union else 0.0

        exact_bonus = 0.3 if query in description else 0.0

        length_penalty = min(len(query), len(description)) / max(len(query), len(description))

        score = (jaccard * 0.5) + (exact_bonus * 0.3) + (length_penalty * 0.2)
        return score

    def _extract_calories(self, food: dict, dish_name: str) -> float:
        nutrients = food.get("foodNutrients", [])

        for nutrient in nutrients:
            nutrient_name = nutrient.get("nutrientName", "").lower()
            unit = nutrient.get("unitName", "").upper()
            value = nutrient.get("value", 0)
            if "energy" in nutrient_name and unit == "KCAL" and value > 0:
                return float(value)

        for nutrient in nutrients:
            nutrient_name = nutrient.get("nutrientName", "").lower()
            value = nutrient.get("value", 0)
            if "calorie" in nutrient_name and value > 0:
                return float(value)

        raise NoCalorieDataError(dish_name)

    def _extract_macros(self, food: dict, servings: float) -> tuple[Macros, Macros]:
        
        nutrients = food.get("foodNutrients", [])

        nutrient_map = {
            "protein": 0.0,
            "carbohydrate": 0.0,
            "fat": 0.0,
            "fiber": 0.0,
            "sugar": 0.0
        }

        for nutrient in nutrients:
            name = nutrient.get("nutrientName", "").lower()
            value = float(nutrient.get("value", 0) or 0)

            if name == "protein":
                nutrient_map["protein"] = value
            elif name == "carbohydrate, by difference":
                nutrient_map["carbohydrate"] = value
            elif name == "total lipid (fat)":
                nutrient_map["fat"] = value
            elif name == "fiber, total dietary":
                nutrient_map["fiber"] = value
            elif name == "total sugars":
                nutrient_map["sugar"] = value

        macros_per_serving = Macros(
            protein_g=round(nutrient_map["protein"], 2),
            carbs_g=round(nutrient_map["carbohydrate"], 2),
            fat_g=round(nutrient_map["fat"], 2),
            fiber_g=round(nutrient_map["fiber"], 2),
            sugar_g=round(nutrient_map["sugar"], 2)
        )

        total_macros = Macros(
            protein_g=round(nutrient_map["protein"] * servings, 2),
            carbs_g=round(nutrient_map["carbohydrate"] * servings, 2),
            fat_g=round(nutrient_map["fat"] * servings, 2),
            fiber_g=round(nutrient_map["fiber"] * servings, 2),
            sugar_g=round(nutrient_map["sugar"] * servings, 2)
        )

        return macros_per_serving, total_macros

    def _extract_macros_from_cached(self, cached: CalorieResult, servings: float) -> tuple[Macros, Macros]:
        if not cached.macros_per_serving:
            return None, None
        m = cached.macros_per_serving
        total = Macros(
            protein_g=round(m.protein_g * servings, 2),
            carbs_g=round(m.carbs_g * servings, 2),
            fat_g=round(m.fat_g * servings, 2),
            fiber_g=round(m.fiber_g * servings, 2),
            sugar_g=round(m.sugar_g * servings, 2)
        )
        return m, total


usda_service = USDAService()
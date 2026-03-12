from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class BaseSetting(BaseSettings):
    """Base settings for the application."""
    database_url: str

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    usda_api_key: str
    usda_page_size: int = 10

    environment: str = "development"
    frontend_url: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


@lru_cache()
def get_settings() -> BaseSetting:
    """Get the application settings."""
    return BaseSetting()

settings = get_settings()



if __name__ == "__main__":
    print(settings.model_dump())
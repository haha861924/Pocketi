from decouple import config

DATABASE_URL: str = config("DATABASE_URL", default="postgresql+asyncpg://postgres:postgres@localhost:5432/pocketit")
SECRET_KEY: str = config("SECRET_KEY", default="dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

MAL_CLIENT_ID: str = config("MAL_CLIENT_ID", default="")
TMDB_API_KEY: str = config("TMDB_API_KEY", default="")
GOOGLE_BOOKS_API_KEY: str = config("GOOGLE_BOOKS_API_KEY", default="")

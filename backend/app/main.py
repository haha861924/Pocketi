from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, collections, search

app = FastAPI(title="Pocketit API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(collections.router, prefix="/api/collections", tags=["collections"])
app.include_router(search.router, prefix="/api/search", tags=["search"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}

import pytest


@pytest.mark.asyncio
async def test_register_success(client):
    resp = await client.post("/api/auth/register", json={"email": "test@example.com", "password": "secret123"})
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    await client.post("/api/auth/register", json={"email": "dup@example.com", "password": "secret123"})
    resp = await client.post("/api/auth/register", json={"email": "dup@example.com", "password": "secret456"})
    assert resp.status_code == 409
    assert "already registered" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_login_success(client):
    await client.post("/api/auth/register", json={"email": "login@example.com", "password": "secret123"})
    resp = await client.post("/api/auth/login", json={"email": "login@example.com", "password": "secret123"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()


@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    resp = await client.post("/api/auth/login", json={"email": "nobody@example.com", "password": "wrong"})
    assert resp.status_code == 401
    assert "Invalid credentials" in resp.json()["detail"]

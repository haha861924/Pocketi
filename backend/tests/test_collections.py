import pytest


async def get_auth_header(client) -> dict:
    resp = await client.post("/api/auth/register", json={"email": "user@example.com", "password": "secret123"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_create_collection(client):
    headers = await get_auth_header(client)
    resp = await client.post("/api/collections", json={
        "type": "manga",
        "title": "Naruto",
        "author": "Kishimoto",
        "status": "reading",
        "tags": ["action", "ninja"],
    }, headers=headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Naruto"
    assert data["type"] == "manga"
    assert data["status"] == "reading"


@pytest.mark.asyncio
async def test_list_collections(client):
    headers = await get_auth_header(client)
    await client.post("/api/collections", json={"type": "manga", "title": "One Piece"}, headers=headers)
    await client.post("/api/collections", json={"type": "movie", "title": "Inception"}, headers=headers)

    # List all
    resp = await client.get("/api/collections", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2

    # Filter by type
    resp = await client.get("/api/collections?type=manga", headers=headers)
    assert len(resp.json()) == 1
    assert resp.json()[0]["title"] == "One Piece"


@pytest.mark.asyncio
async def test_update_collection(client):
    headers = await get_auth_header(client)
    create_resp = await client.post("/api/collections", json={
        "type": "manga", "title": "Test Manga", "status": "reading"
    }, headers=headers)
    item_id = create_resp.json()["id"]

    resp = await client.patch(f"/api/collections/{item_id}", json={"rating": 8.5}, headers=headers)
    assert resp.status_code == 200
    assert resp.json()["rating"] == 8.5


@pytest.mark.asyncio
async def test_delete_collection(client):
    headers = await get_auth_header(client)
    create_resp = await client.post("/api/collections", json={
        "type": "manga", "title": "Delete Me"
    }, headers=headers)
    item_id = create_resp.json()["id"]

    resp = await client.delete(f"/api/collections/{item_id}", headers=headers)
    assert resp.status_code == 204

    resp = await client.get("/api/collections", headers=headers)
    assert len(resp.json()) == 0


@pytest.mark.asyncio
async def test_unauthorized_access(client):
    resp = await client.get("/api/collections")
    assert resp.status_code in (401, 403)  # No bearer token

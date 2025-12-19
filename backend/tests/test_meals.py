import pytest

@pytest.fixture
def auth_token(client):
    email = "meals@example.com"
    password = "password123"
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password}
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": email, "password": password}
    )
    return response.json()["access_token"]

def test_create_meal(client, auth_token):
    response = client.post(
        "/api/v1/meals/",
        json={"name": "Chicken Salad", "calories": 500, "weight": 300},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Chicken Salad"
    assert data["calories"] == 500

def test_get_meals(client, auth_token):
    # Create a meal first
    client.post(
        "/api/v1/meals/",
        json={"name": "Oatmeal", "calories": 300, "weight": 150},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    
    response = client.get(
        "/api/v1/meals/",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == "Oatmeal"

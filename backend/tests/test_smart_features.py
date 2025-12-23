import pytest
from app.core.calculations import calculate_nutrition_goals

def test_calculate_nutrition_goals_maintain():
    # Male, 25, 180cm, 80kg, Moderate
    # BMR = 1805, TDEE = 2797.75 -> int(2797.75) = 2797
    goals = calculate_nutrition_goals(80, 180, 25, "Male", "Moderate", "maintain")
    assert goals["daily_calorie_goal"] == 2797
    # Logic: Protein = 2.0 * 80 = 160
    # Fats = 0.8 * 80 = 64
    # Carbs = (2797 - (160*4 + 64*9)) / 4 = (2797 - 640 - 576) / 4 = 1581 / 4 = 395.25 -> 395
    assert goals["protein_goal"] == 160
    assert goals["fats_goal"] == 64
    assert goals["carbs_goal"] == 395

def test_calculate_nutrition_goals_lose():
    # Same stats, lose weight (-500)
    # Goal = 2297
    goals = calculate_nutrition_goals(80, 180, 25, "Male", "Moderate", "lose")
    assert goals["daily_calorie_goal"] == 2297
    # Protein/Fats fixed by weight, not calories
    assert goals["protein_goal"] == 160
    assert goals["fats_goal"] == 64
    # Carbs = (2297 - 1216) / 4 = 1081 / 4 = 270.25 -> 270
    assert goals["carbs_goal"] == 270

def test_bmi_calculation():
    # 80kg, 1.8m -> 80 / 3.24 = 24.69
    goals = calculate_nutrition_goals(80, 180, 25, "Male", "Moderate", "maintain")
    assert 24.6 <= goals["bmi"] <= 24.8

# Integration Tests
@pytest.fixture
def auth_headers(client):
    # Create user - endpoint is /register not /signup
    client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User",
        "gender": "Male",
        "age": 25,
        "height": 180,
        "weight": 80,
        "activity_rate": "Moderate",
        "goal_weight": 80
    })
    # Login
    resp = client.post("/api/v1/auth/login", data={
        "username": "test@example.com",
        "password": "password123"
    })
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_log_weight_update_goals(client, auth_headers):
    # Log new weight 90kg (Gain)
    response = client.post(
        "/api/v1/users/weight",
        json={"weight": 90},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["weight"] == 90
    assert data["daily_calorie_goal"] > 0
    # Check history
    hist_resp = client.get("/api/v1/users/weight/history", headers=auth_headers)
    assert hist_resp.status_code == 200
    history = hist_resp.json()
    assert len(history) >= 1
    assert history[-1]["weight"] == 90

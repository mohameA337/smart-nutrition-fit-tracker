import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"
EMAIL = "test@example.com"
PASSWORD = "password123"

def test_backend():
    print("Starting Backend Verification...")
    
    # 1. Register
    print("\n1. Testing Registration...")
    register_payload = {
        "email": EMAIL,
        "password": PASSWORD,
        "full_name": "Test User",
        "gender": "Male",
        "age": 30,
        "height": 180,
        "weight": 80,
        "target_weight": 75,
        "activity_rate": "Moderate",
        "start_weight": 80,
        "goal_weight": 75
    }
    # Try to register, if fails might be because user exists, which is fine for re-runs
    res = requests.post(f"{BASE_URL}/auth/register", json=register_payload)
    if res.status_code == 200:
        print("Registration successful")
    elif res.status_code == 400 and "already registered" in res.text:
        print("User already registered (skipping registration)")
    else:
        print(f"Registration failed: {res.status_code} {res.text}")
        sys.exit(1)

    # 2. Login
    print("\n2. Testing Login...")
    login_payload = {
        "email": EMAIL,
        "password": PASSWORD
    }
    res = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    if res.status_code != 200:
        print(f"Login failed: {res.status_code} {res.text}")
        sys.exit(1)
    
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful, token received")

    # 3. Get Profile
    print("\n3. Testing Get Profile...")
    res = requests.get(f"{BASE_URL}/users/me", headers=headers)
    if res.status_code != 200:
        print(f"Get Profile failed: {res.status_code} {res.text}")
        sys.exit(1)
    print("Profile retrieved")
    
    # 4. Update Profile
    print("\n4. Testing Update Profile...")
    update_payload = {
        "full_name": "Updated Name"
    }
    # UserUpdate doesn't require password
    res = requests.put(f"{BASE_URL}/users/me", json=update_payload, headers=headers)
    if res.status_code != 200:
        print(f"Update Profile failed: {res.status_code} {res.text}")
        # Don't exit, continue testing other parts
    else:
        print("Profile updated")

    # 5. Create Meal
    print("\n5. Testing Create Meal...")
    meal_payload = {
        "name": "Test Meal",
        "weight": 200,
        "calories": 500
    }
    res = requests.post(f"{BASE_URL}/meals/", json=meal_payload, headers=headers)
    if res.status_code != 200:
        print(f"Create Meal failed: {res.status_code} {res.text}")
        sys.exit(1)
    meal_id = res.json()["id"]
    print("Meal created")

    # 6. Get Meals
    print("\n6. Testing Get Meals...")
    res = requests.get(f"{BASE_URL}/meals/", headers=headers)
    if res.status_code != 200:
        print(f"Get Meals failed: {res.status_code} {res.text}")
        sys.exit(1)
    meals = res.json()
    if len(meals) > 0:
        print(f"Meals retrieved ({len(meals)} meals)")
    else:
        print("No meals found")

    # 7. Delete Meal
    print("\n7. Testing Delete Meal...")
    res = requests.delete(f"{BASE_URL}/meals/{meal_id}", headers=headers)
    if res.status_code != 200:
        print(f"Delete Meal failed: {res.status_code} {res.text}")
    else:
        print("Meal deleted")

    # 8. Create Workout
    print("\n8. Testing Create Workout...")
    workout_payload = {
        "name": "Test Workout",
        "duration": 30,
        "calories_burned": 300 
    }
    
    res = requests.post(f"{BASE_URL}/workouts/", json=workout_payload, headers=headers)
    if res.status_code != 200:
         print(f"Create Workout failed: {res.status_code} {res.text}")
    else:
         workout_id = res.json()["id"]
         print("Workout created")
         
         # 9. Delete Workout
         print("\n9. Testing Delete Workout...")
         res = requests.delete(f"{BASE_URL}/workouts/{workout_id}", headers=headers)
         if res.status_code == 200:
             print("Workout deleted")

    print("\nVerification Complete!")

if __name__ == "__main__":
    test_backend()

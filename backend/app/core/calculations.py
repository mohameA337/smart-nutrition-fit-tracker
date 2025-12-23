from datetime import datetime

def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    """Calculates BMI given weight in kg and height in cm."""
    if not height_cm or not weight_kg:
        return 0.0
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)

def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
    """
    Calculates Basal Metabolic Rate using Mifflin-St Jeor Equation.
    """
    # Mifflin-St Jeor
    base = (10 * weight) + (6.25 * height) - (5 * age)
    if gender and gender.lower() == "male":
        return base + 5
    else:
        return base - 161

def calculate_nutrition_goals(
    weight: float, 
    height: float, 
    age: int, 
    gender: str, 
    activity_level: str, 
    goal: str
) -> dict:
    """
    Calculates daily calorie and macro targets.
    """
    if not all([weight, height, age, gender]):
        return {}

    # 1. Calculate BMR
    bmr = calculate_bmr(weight, height, age, gender)

    # 2. Activity Multiplier
    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    # Default to sedentary if unknown
    activity_mult = multipliers.get(activity_level.lower(), 1.2) if activity_level else 1.2
    tdee = bmr * activity_mult

    # 3. Goal Adjustment
    # Lose: -500, Gain: +500, Maintain: 0
    goal_adjust = 0
    if goal:
        if "lose" in goal.lower():
            goal_adjust = -500
        elif "gain" in goal.lower():
            goal_adjust = 500

    daily_calories = int(tdee + goal_adjust)
    
    # Safety floor
    if daily_calories < 1200:
        daily_calories = 1200

    # 4. Macros
    # Protein: ~2g per kg of body weight (good for fitness)
    # Fats: ~0.8g per kg
    # Rest: Carbs
    
    protein_grams = int(weight * 2.0)
    fat_grams = int(weight * 0.8)
    
    protein_cals = protein_grams * 4
    fat_cals = fat_grams * 9
    
    remaining_cals = daily_calories - (protein_cals + fat_cals)
    carbs_grams = int(remaining_cals / 4)
    
    if carbs_grams < 0:
         carbs_grams = 0 # Should not happen unless weight is huge and calories low

    return {
        "daily_calorie_goal": daily_calories,
        "protein_goal": protein_grams,
        "fats_goal": fat_grams,
        "carbs_goal": carbs_grams,
        "bmi": calculate_bmi(weight, height)
    }

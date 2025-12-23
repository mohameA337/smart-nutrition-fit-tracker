export const calculateDailyCalories = (user, weeklyGoal = 'maintain') => {
    // Destructure with default values to prevent crashes
    const { 
        weight = 0, 
        height = 0, 
        age = 0, 
        gender = 'Male', 
        activityRate = 'Moderate' 
    } = user || {};

    // 1. Validation: If critical data is missing, return a standard default
    if (!weight || !height || !age) {
        return 2000; 
    }

    // 2. Calculate BMR (Basal Metabolic Rate)
    // Base: (10 * weight) + (6.25 * height) - (5 * age)
    const baseBMR = (10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseFloat(age));

    let bmr = 0;
    if (gender && gender.toLowerCase() === 'male') {
        bmr = baseBMR + 5;
    } else {
        bmr = baseBMR - 161;
    }

    // 3. Determine Activity Multiplier
    let multiplier = 1.2; // Default (Sedentary)
    
    if (activityRate) {
        const activity = activityRate.toLowerCase();
        if (activity.includes('low')) {
            multiplier = 1.3;
        } else if (activity.includes('mod')) {
            multiplier = 1.5;
        } else if (activity.includes('high')) {
            multiplier = 1.7;
        }
    }

    // 4. Calculate Final TDEE
    const tdee= Math.round(bmr * multiplier);

    let finalCalories = tdee;

    switch (weeklyGoal) {
        case 'lose_0.25':
            finalCalories = tdee - 275;
            break;
        case 'lose_0.5':
            finalCalories = tdee - 550;
            break;
        case 'gain_0.25':
            finalCalories = tdee + 275;
            break;
        case 'gain_0.5':
            finalCalories = tdee + 550;
            break;
        case 'maintain':
        default:
            finalCalories = tdee;
    }

    // Safety check: Don't let calories go too low (e.g. below 1200)
    return Math.max(finalCalories, 1200);    
};
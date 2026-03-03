import { GOALS, ACTIVITY_LEVELS, FOOD_DATABASE, FOOD_CALORIES } from '../data/mealData';

export const calculateStats = (formData) => {
    const age = Number(formData.age);
    const weight = Number(formData.weight);
    const height = Number(formData.height);
    const gender = formData.gender;
    const activityId = formData.activityLevel;
    const goalId = formData.goal;

    if (!age || !weight || !height || !gender || !activityId) return { bmr: 0, tdee: 0, recommended: 2000, isCapped: false };

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') bmr += 5;
    else bmr -= 161;

    const activity = ACTIVITY_LEVELS.find(a => a.id === activityId);
    const multiplier = activity ? activity.multiplier : 1.2;
    const tdee = Math.round(bmr * multiplier);

    const goal = GOALS.find(g => g.id === goalId);
    let recommended = tdee + (goal ? goal.surplus : 0);

    let isCapped = false;
    if (recommended > 4000) {
        recommended = 4000;
        isCapped = true;
    }
    recommended = Math.max(1200, recommended); // Safety floor

    return { bmr: Math.round(bmr), tdee, recommended: Math.round(recommended), isCapped };
};

export const generateWeeklyPlan = (formData) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date();

    return days.map((dayName, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);

        return {
            day: `Day ${index + 1} - ${dayName}`,
            date: date.toLocaleDateString(),
            meals: generateDailyMeals(formData)
        };
    });
};

const generateDailyMeals = (formData) => {
    const { calorieTarget, dietaryPreferences, goal } = formData;
    const goalData = GOALS.find(g => g.id === goal);

    // 3 Meal Split: 30% - 35% - 35%
    const meals = [
        { type: 'Breakfast', ratio: 0.30, time: '08:00', icon: 'ri-sun-line', color: 'yellow' },
        { type: 'Lunch', ratio: 0.35, time: '13:00', icon: 'ri-restaurant-line', color: 'emerald' },
        { type: 'Dinner', ratio: 0.35, time: '20:00', icon: 'ri-moon-line', color: 'orange' }
    ];

    return meals.map(mealConfig => {
        const mealCalories = Math.round(calorieTarget * mealConfig.ratio);
        return createDynamicMeal(mealConfig, mealCalories, dietaryPreferences, goalData);
    });
};

const createDynamicMeal = (config, targetCalories, prefs, goalData) => {
    // 1. Define Meal Structure based on type
    let structure = [];
    if (config.type === 'Breakfast') {
        structure = ['protein', 'carb', 'fruit']; // e.g. Eggs + Toast + Banana
    } else {
        structure = ['protein', 'carb', 'veggie', 'fat']; // e.g. Chicken + Rice + Broccoli + Oil
    }

    // 2. Select Ingredients
    const ingredients = structure.map(type => selectIngredient(type, prefs));

    // 3. Calculate Portions to hit target calories
    const portions = ingredients.map((item, idx) => {
        if (!item) return null;

        let allocRatio = 0.25; // default equal split
        if (structure[idx] === 'protein') allocRatio = 0.40;
        if (structure[idx] === 'carb') allocRatio = 0.40;
        if (structure[idx] === 'veggie') allocRatio = 0.05; // veggies low cal
        if (structure[idx] === 'fat') allocRatio = 0.15;
        if (structure[idx] === 'fruit') allocRatio = 0.20;

        const itemCalTarget = targetCalories * allocRatio;
        const calPerUnit = FOOD_CALORIES[item] || 100; // default 100 if missing

        const rawQty = itemCalTarget / calPerUnit;

        // --- Formatting Logic ---
        // 1. Handle "100g" items (Convert to grams)
        if (item.includes("100g")) {
            const grams = Math.round(rawQty * 100 / 10) * 10; // Round to nearest 10g
            const cleanName = item.replace(" 100g", "").replace("(100g)", "").trim();
            return `${grams}g ${cleanName}`;
        }
        // 2. Handle Count/Volume items (slices, pieces, cups, rotis)
        let unit = "serving(s)";
        let cleanName = item;

        if (item.includes("(slice)")) { unit = "slice(s)"; cleanName = item.replace("(slice)", ""); }
        else if (item.includes("(1 piece)")) { unit = "piece(s)"; cleanName = item.replace("(1 piece)", ""); }
        else if (item.includes("(medium)")) { unit = "medium"; cleanName = item.replace("(medium)", ""); }
        else if (item.includes("Roti")) { unit = "piece(s)"; } // Special case for Roti
        else if (item.includes("(1 cup")) { unit = "cup(s)"; cleanName = item.replace(/\(1 cup.*\)/, ""); }
        else if (item.includes("(1 tsp)")) { unit = "tsp"; cleanName = item.replace("(1 tsp)", ""); }
        else if (item.includes("(1 tbsp)")) { unit = "tbsp"; cleanName = item.replace("(1 tbsp)", ""); }
        else if (item.includes(" pcs)")) { unit = "pcs"; cleanName = item.replace(/\(\d+ pcs\)/, ""); } // e.g. Almonds (10 pcs)
        else if (item.includes("(Dal)") || item.includes("(Chana)") || item.includes("Curry")) { unit = "cup(s)"; } // Heuristic for Indian gravy dishes

        // 3. Round to nearest 0.5 for count items
        let qty = Math.round(rawQty * 2) / 2;
        if (qty < 0.5) qty = 0.5; // Minimum 0.5

        return `${qty} ${unit} ${cleanName.trim()}`;

    }).filter(Boolean);


    // 3. Calculate Macros (Theoretical based on goal mostly, since we don't have macro data per food in simple map)
    const protein = Math.round((targetCalories * goalData.macros.p) / 4);
    const carbs = Math.round((targetCalories * goalData.macros.c) / 4);
    const fat = Math.round((targetCalories * goalData.macros.f) / 9);

    const mainItem = ingredients[0] || 'Balanced Meal';

    return {
        time: config.time,
        name: config.type,
        title: `${mainItem} Meal`, // e.g. "Grilled Chicken Meal"
        calories: targetCalories,
        ingredients: portions,
        description: `A personalized ${config.type.toLowerCase()} designed for your ${goalData.name.toLowerCase()} goal.`,
        macros: { protein: `${protein}g`, carbs: `${carbs}g`, fat: `${fat}g` },
        icon: config.icon,
        color: config.color
    };
};

const selectIngredient = (type, prefs) => {
    let list = [];
    switch (type) {
        case 'protein':
            list = getProteinList(prefs);
            break;
        case 'carb':
            list = getCarbList(prefs);
            break;
        case 'fat':
            list = [...FOOD_DATABASE.fats.nuts, ...FOOD_DATABASE.fats.oils, ...FOOD_DATABASE.fats.other];
            break;
        case 'veggie':
            list = FOOD_DATABASE.veggies;
            break;
        case 'fruit':
            list = ["Banana (medium)", "Apple (medium)", "Orange (medium)"]; // limited fallback or add to data
            // Let's use simple carbs or generic fruits if not in data
            // The data has 'Banana (medium)' in FOOD_CALORIES
            break;
        default:
            return null;
    }

    // Filter by available keys in calorie map to ensure we can calculate
    list = list.filter(item => FOOD_CALORIES[item] !== undefined);

    if (list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)];
};

const getProteinList = (prefs) => {
    let list = [];
    if (prefs.vegan) list = [...FOOD_DATABASE.proteins.vegan];
    else if (prefs.vegetarian) list = [...FOOD_DATABASE.proteins.vegetarian, ...FOOD_DATABASE.proteins.vegan];
    else if (prefs.eggetarian) list = [...FOOD_DATABASE.proteins.eggetarian, ...FOOD_DATABASE.proteins.vegetarian, ...FOOD_DATABASE.proteins.vegan];
    else list = [...FOOD_DATABASE.proteins.nonVeg];
    return list;
};

const getCarbList = (prefs) => {
    if (prefs.lowCarb || prefs.keto) return FOOD_DATABASE.carbs.lowCarb;
    return [...FOOD_DATABASE.carbs.complex, ...FOOD_DATABASE.carbs.simple];
};

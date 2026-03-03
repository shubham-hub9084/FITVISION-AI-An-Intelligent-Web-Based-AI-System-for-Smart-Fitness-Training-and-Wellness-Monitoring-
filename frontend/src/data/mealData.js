export const GOALS = [
    {
        id: 'muscle-gain',
        name: 'Muscle Gain',
        icon: 'ri-sword-line',
        description: 'Build lean muscle mass with high protein and calorie surplus',
        color: 'blue',
        surplus: 400,
        macros: { p: 0.30, c: 0.50, f: 0.20 }
    },
    {
        id: 'healthy-weight',
        name: 'Healthy Weight',
        icon: 'ri-scales-3-line',
        description: 'Maintain optimal weight with balanced nutrition',
        color: 'emerald',
        surplus: 0,
        macros: { p: 0.25, c: 0.50, f: 0.25 }
    },
    {
        id: 'lose-weight',
        name: 'Lose Weight',
        icon: 'ri-fire-line',
        description: 'Burn fat with a sustainable calorie deficit',
        color: 'orange',
        surplus: -400,
        macros: { p: 0.35, c: 0.35, f: 0.30 }
    }
];

export const ACTIVITY_LEVELS = [
    { id: 'light', name: 'Lightly Active', description: 'Light exercise 1-3 days/week', multiplier: 1.375 },
    { id: 'moderate', name: 'Moderate', description: 'Moderate exercise 3-5 days/week', multiplier: 1.55 },
    { id: 'active', name: 'Very Active', description: 'Hard exercise 6-7 days/week', multiplier: 1.725 }
];

export const DIET_TYPES = [
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'eggetarian', name: 'Eggetarian' },
    { id: 'non-veg', name: 'Non-Vegetarian' },
    { id: 'high-protein', name: 'High Protein' },
    { id: 'low-carb', name: 'Low Carb' },
    { id: 'keto', name: 'Keto' }
];

/**
 * FOOD_CALORIES
 * Values are either:
 *  - calories per serving (labelled in comment) OR
 *  - calories per 100g (when noted)
 *
 * Use consistent units in UI: show 'per serving' or 'per 100g' as provided.
 */
export const FOOD_CALORIES = {
    // Proteins (common units)
    "Lentils (Dal)": 230,          // per cooked cup (~200g)
    "Chickpeas (Chana)": 270,      // per cooked cup (~200g)
    "Black Beans (Rajma)": 227,    // per cooked cup (~200g)
    "Soya Chunks": 345,            // per 100g (dry)
    "Moong Dal": 212,              // per cooked cup
    "Tofu": 76,                    // per 100g
    "Paneer": 265,                 // per 100g
    "Greek Yogurt": 59,            // per 100g
    "Curd (Dahi)": 60,             // per 100g
    "Milk": 60,                    // per 100ml (approx)
    "Cheese": 402,                 // per 100g
    "Whey Protein (scoop)": 120,   // per scoop ~30g
    "Boiled Egg": 78,              // per egg
    "Egg Bhurji (1 serving)": 200,  // cooked with oil
    "Grilled Chicken (100g)": 165, // per 100g
    "Chicken Curry (1 serving)": 250,
    "Fish Curry (1 serving)": 220,

    // Carbs
    "Whole Wheat Roti": 80,        // per roti (medium)
    "Brown Rice": 111,             // per 100g cooked
    "White Rice": 130,             // per 100g cooked
    "Oats": 389,                   // per 100g dry
    "Multigrain Bread (slice)": 70,
    "Sweet Potato": 86,            // per 100g
    "Dalia (1 cup cooked)": 150,
    "Idli (1 piece)": 39,
    "Poha (1 plate)": 250,
    "Pasta (1 cup cooked)": 200,

    // Fats & energy-dense
    "Almonds (10 pcs)": 70,        // approx 10 almonds
    "Walnuts (10 pcs)": 100,
    "Peanuts (30g)": 170,
    "Ghee (1 tsp)": 45,
    "Olive Oil (1 tsp)": 40,
    "Butter (1 tsp)": 34,
    "Avocado (1/2)": 120,

    // Veggies (low calorie)
    "Spinach (Palak) 100g": 23,
    "Bhindi (Okra) 100g": 33,
    "Gobi (Cauliflower) 100g": 25,
    "Cabbage 100g": 25,
    "Bottle Gourd (Lauki) 100g": 14,
    "Green Beans 100g": 31,
    "Carrots 100g": 41,
    "Cucumber 100g": 16,
    "Tomato 100g": 18,
    "Onion 100g": 40,
    "Mixed Veg Sabzi (1 cup cooked)": 120,

    // Snacks / extras
    "Banana (medium)": 105,
    "Peanut Butter (1 tbsp)": 94
};

/**
 * FOOD_DATABASE: kept as categories for selection/UI use.
 * Base names should match keys in FOOD_CALORIES where calories are available.
 */
export const FOOD_DATABASE = {
    proteins: {
        vegan: ['Lentils (Dal)', 'Chickpeas (Chana)', 'Black Beans (Rajma)', 'Soya Chunks', 'Moong Dal', 'Tofu', 'Peas (Matar)'],
        vegetarian: ['Paneer', 'Greek Yogurt', 'Curd (Dahi)', 'Milk', 'Cheese', 'Whey Protein (scoop)'],
        eggetarian: ['Boiled Egg', 'Egg Bhurji (1 serving)', 'Omelette', 'Egg Curry'],
        nonVeg: ['Grilled Chicken (100g)', 'Chicken Curry (1 serving)', 'Fish Curry (1 serving)', 'Egg Curry']
    },
    carbs: {
        complex: ['Whole Wheat Roti', 'Brown Rice', 'Oats', 'Multigrain Bread (slice)', 'Sweet Potato', 'Dalia (1 cup cooked)', 'Bajra Roti', 'Jowar Roti'],
        simple: ['White Rice', 'Idli (1 piece)', 'Poha (1 plate)', 'Upma', 'Banana (medium)', 'Potato', 'Pasta (1 cup cooked)'],
        lowCarb: ['Cauliflower Rice', 'Sautéed Veggies', 'Cucumber Salad', 'Bottle Gourd (Lauki)']
    },
    fats: {
        nuts: ['Almonds (10 pcs)', 'Walnuts (10 pcs)', 'Peanuts (30g)', 'Flax Seeds'],
        oils: ['Ghee (1 tsp)', 'Olive Oil (1 tsp)', 'Butter (1 tsp)'],
        other: ['Avocado (1/2)', 'Cheese']
    },
    veggies: ['Spinach (Palak) 100g', 'Bhindi (Okra) 100g', 'Gobi (Cauliflower) 100g', 'Cabbage 100g', 'Bottle Gourd (Lauki) 100g', 'Green Beans 100g', 'Carrots 100g', 'Cucumber 100g', 'Tomato 100g', 'Onion 100g']
};

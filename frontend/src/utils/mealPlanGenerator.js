import { GOALS, ACTIVITY_LEVELS, FOOD_ITEMS, DEFAULT_PRICE_PREFERENCE } from '../data/mealData.js';
import { RECIPE_TEMPLATES } from '../data/mealRecipes.js';

const CALORIE_ALIGNMENT_TOLERANCE = 45;

const MEAL_CONFIGS = {
    3: [
        { type: 'Breakfast', ratio: 0.30, time: '08:00', icon: 'ri-sun-line', color: 'yellow' },
        { type: 'Lunch', ratio: 0.35, time: '13:00', icon: 'ri-restaurant-line', color: 'emerald' },
        { type: 'Dinner', ratio: 0.35, time: '20:00', icon: 'ri-moon-line', color: 'orange' }
    ],
    4: [
        { type: 'Breakfast', ratio: 0.25, time: '08:00', icon: 'ri-sun-line', color: 'yellow' },
        { type: 'Lunch', ratio: 0.35, time: '13:00', icon: 'ri-restaurant-line', color: 'emerald' },
        { type: 'Snack', ratio: 0.12, time: '17:00', icon: 'ri-cup-line', color: 'purple' },
        { type: 'Dinner', ratio: 0.28, time: '20:00', icon: 'ri-moon-line', color: 'orange' }
    ],
    5: [
        { type: 'Breakfast', label: 'Breakfast', ratio: 0.22, time: '08:00', icon: 'ri-sun-line', color: 'yellow' },
        { type: 'Snack', label: 'Morning Snack', ratio: 0.10, time: '11:00', icon: 'ri-cup-line', color: 'purple' },
        { type: 'Lunch', ratio: 0.30, time: '13:30', icon: 'ri-restaurant-line', color: 'emerald' },
        { type: 'Snack', label: 'Evening Snack', ratio: 0.10, time: '17:30', icon: 'ri-cup-line', color: 'indigo' },
        { type: 'Dinner', ratio: 0.28, time: '20:30', icon: 'ri-moon-line', color: 'orange' }
    ]
};

export const calculateStats = (formData) => {
    const age = Number(formData.age);
    const weight = Number(formData.weight);
    const height = Number(formData.height);
    const gender = formData.gender;
    const activityId = formData.activityLevel;
    const goalId = formData.goal;

    if (!age || !weight || !height || !gender || !activityId) {
        return { bmr: 0, tdee: 0, recommended: 2000, isCapped: false };
    }

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += gender === 'male' ? 5 : -161;

    const activity = ACTIVITY_LEVELS.find((item) => item.id === activityId);
    const tdee = Math.round(bmr * (activity ? activity.multiplier : 1.2));

    const goal = GOALS.find((item) => item.id === goalId);
    let recommended = tdee + (goal ? goal.surplus : 0);

    let isCapped = false;
    if (recommended > 4000) {
        recommended = 4000;
        isCapped = true;
    }

    recommended = Math.max(1200, recommended);

    return { bmr: Math.round(bmr), tdee, recommended: Math.round(recommended), isCapped };
};

export const generateWeeklyPlan = (formData) => {
    const mealConfigs = getMealConfigs(formData.numberOfMeals);
    const today = new Date();

    return Array.from({ length: 7 }, (_, dayIndex) => {
        const date = new Date(today);
        date.setDate(today.getDate() + dayIndex);

        const meals = generateDailyMeals(formData, dayIndex, mealConfigs);
        const totals = summarizeMeals(meals);

        return {
            day: `Day ${dayIndex + 1} - ${date.toLocaleDateString(undefined, { weekday: 'long' })}`,
            date: date.toLocaleDateString(),
            meals,
            totals
        };
    });
};

const getMealConfigs = (numberOfMeals) => {
    return MEAL_CONFIGS[numberOfMeals] || MEAL_CONFIGS[4];
};

const generateDailyMeals = (formData, dayIndex, mealConfigs) => {
    const goalData = GOALS.find((goal) => goal.id === formData.goal) || GOALS[1];
    const prefs = normalizePreferences(formData.dietaryPreferences);

    return mealConfigs.map((config, mealIndex) => {
        const targetCalories = Math.round(Number(formData.calorieTarget || 2000) * config.ratio);
        const recipe = selectRecipe(config.type, prefs, goalData, targetCalories, dayIndex, mealIndex);

        if (!recipe) {
            // Fallback meal if no recipe could be found
            return {
                time: config.time,
                name: config.label || config.type,
                title: 'Meal not available',
                calories: targetCalories,
                targetCalories,
                calorieDelta: 0,
                ingredients: [],
                description: 'No recipe available for this meal slot.',
                macros: { protein: '0g', carbs: '0g', fat: '0g' },
                estimatedCost: 0,
                priceTier: 'mid',
                icon: config.icon,
                color: config.color
            };
        }

        const { entries, totals } = buildMealEntries(recipe, targetCalories);
        const calorieDelta = Math.round(totals.calories - targetCalories);

        return {
            time: config.time,
            name: config.label || config.type,
            title: recipe.title,
            calories: Math.round(totals.calories),
            targetCalories,
            calorieDelta,
            ingredients: entries.map(formatIngredient),
            description: buildMealDescription(recipe, targetCalories, calorieDelta, recipe.priceTier),
            macros: {
                protein: `${Math.round(totals.protein)}g`,
                carbs: `${Math.round(totals.carbs)}g`,
                fat: `${Math.round(totals.fat)}g`
            },
            estimatedCost: Math.round(totals.estimatedCost),
            priceTier: recipe.priceTier,
            icon: config.icon,
            color: config.color
        };
    });
};

const selectRecipe = (mealType, prefs, goalData, targetCalories, dayIndex, mealIndex) => {
    const allRecipes = RECIPE_TEMPLATES[mealType] || [];
    const candidates = allRecipes.filter((recipe) => recipeMatchesPreferences(recipe, prefs));

    // Fallback: if no matching candidates, use all recipes for this meal type
    const pool = getPreferredPricePool(candidates.length > 0 ? candidates : allRecipes);
    const validPool = pool.length > 0 ? pool : allRecipes;

    if (validPool.length === 0) {
        console.error(`No recipes found for mealType: ${mealType}`);
        return null;
    }

    const ranked = validPool
        .map((recipe) => ({ recipe, score: scoreRecipe(recipe, prefs, goalData, targetCalories) }))
        .sort((left, right) => right.score - left.score)
        .map((item) => item.recipe);

    const shortlist = ranked.slice(0, Math.min(3, ranked.length));
    const idx = shortlist.length > 0 ? (dayIndex + mealIndex) % shortlist.length : 0;
    return shortlist[idx] || ranked[0] || allRecipes[0];
};

const getPreferredPricePool = (recipes) => {
    if (!recipes || recipes.length === 0) return [];
    const midTier = recipes.filter((recipe) => recipe.priceTier === DEFAULT_PRICE_PREFERENCE);
    if (midTier.length) {
        return midTier;
    }

    const budgetTier = recipes.filter((recipe) => recipe.priceTier === 'budget');
    return budgetTier.length ? budgetTier : recipes;
};

const recipeMatchesPreferences = (recipe, prefs) => {
    const profile = resolveDietProfile(prefs);

    if (!recipe.dietProfiles.includes(profile)) {
        return false;
    }

    if (prefs.keto && !recipe.ketoFriendly) {
        return false;
    }

    if (!prefs.keto && prefs.lowCarb && !recipe.lowCarbFriendly) {
        return false;
    }

    const blockedAllergens = new Set(normalizeAllergies(prefs.allergies || []));
    if (prefs.omitNuts) {
        blockedAllergens.add('nuts');
    }

    return recipe.ingredients.every((ingredient) => {
        const food = FOOD_ITEMS[ingredient.foodId];
        if (!food) {
            console.warn(`Missing food item: ${ingredient.foodId} in recipe ${recipe.id}`);
            return false;
        }
        return !food.allergens.some((allergen) => blockedAllergens.has(allergen));
    });
};

const scoreRecipe = (recipe, prefs, goalData, targetCalories) => {
    const baseTotals = calculateTotals(
        recipe.ingredients.map((ingredient) => ({
            ...ingredient,
            quantity: ingredient.quantity,
            food: FOOD_ITEMS[ingredient.foodId]
        }))
    );

    let score = 0;

    score += recipe.priceTier === DEFAULT_PRICE_PREFERENCE ? 150 : 0;
    score -= Math.abs(targetCalories - baseTotals.calories);
    score += baseTotals.protein * (prefs.highProtein || goalData.id === 'muscle-gain' ? 12 : 4);

    if (prefs.highProtein || goalData.id === 'muscle-gain') {
        score += recipe.highProteinFriendly ? 45 : 0;
    }

    if (goalData.id === 'lose-weight') {
        score += (baseTotals.protein * 6) - (baseTotals.calories * 0.03);
    }

    if (prefs.lowCarb) {
        score -= baseTotals.carbs * 2.5;
        score += recipe.lowCarbFriendly ? 35 : 0;
    }

    if (prefs.keto) {
        score -= baseTotals.carbs * 5;
        score += baseTotals.fat * 2;
        score += recipe.ketoFriendly ? 55 : 0;
    }

    return score;
};

const buildMealEntries = (recipe, targetCalories) => {
    if (!recipe || !recipe.ingredients) {
        console.error('Invalid recipe passed to buildMealEntries:', recipe);
        return { entries: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0, estimatedCost: 0 } };
    }
    const baseEntries = recipe.ingredients.map((ingredient) => {
        const food = FOOD_ITEMS[ingredient.foodId];
        if (!food) {
            console.warn(`Missing food item: ${ingredient.foodId} during buildMealEntries for recipe ${recipe.id}`);
        }
        return {
            ...ingredient,
            food: food || { name: 'Unknown', calories: 0, macros: { protein: 0, carbs: 0, fat: 0 }, estimatedCost: 0, serving: { amount: 1, unit: 'unit' } }
        };
    });
    const baseTotals = calculateTotals(baseEntries);
    const scaleFactor = clamp(targetCalories / Math.max(baseTotals.calories, 1), 0.75, 2.6);

    const scaledEntries = baseEntries.map((entry) => {
        const rawQuantity = entry.quantity * scaleFactor;
        const minQuantity = entry.minQuantity ?? entry.food.min ?? entry.food.step ?? 1;
        const maxQuantity = entry.maxQuantity ?? entry.food.max ?? rawQuantity;

        return {
            ...entry,
            quantity: clamp(roundToStep(rawQuantity, entry.food.step || 1), minQuantity, maxQuantity)
        };
    });

    return tuneMealEntries(scaledEntries, targetCalories);
};

const tuneMealEntries = (entries, targetCalories) => {
    const workingEntries = entries.map((entry) => ({ ...entry }));
    let totals = calculateTotals(workingEntries);
    let safetyCounter = 0;

    while (Math.abs(targetCalories - totals.calories) > CALORIE_ALIGNMENT_TOLERANCE && safetyCounter < 24) {
        const direction = targetCalories > totals.calories ? 1 : -1;
        const bestEntry = findBestAdjustment(workingEntries, totals.calories, targetCalories, direction);

        if (!bestEntry) {
            break;
        }

        bestEntry.quantity = roundNumber(bestEntry.quantity + (direction * (bestEntry.food.step || 1)), 2);
        totals = calculateTotals(workingEntries);
        safetyCounter += 1;
    }

    return { entries: workingEntries, totals };
};

const findBestAdjustment = (entries, currentCalories, targetCalories, direction) => {
    return entries
        .filter((entry) => entry.adjustable !== false)
        .map((entry) => {
            const step = entry.food.step || 1;
            const nextQuantity = entry.quantity + (direction * step);
            const minQuantity = entry.minQuantity ?? entry.food.min ?? step;
            const maxQuantity = entry.maxQuantity ?? entry.food.max ?? Number.POSITIVE_INFINITY;

            if (nextQuantity < minQuantity || nextQuantity > maxQuantity) {
                return null;
            }

            const nextCalories = currentCalories + (direction * entry.food.calories * step);

            return {
                entry,
                remainingGap: Math.abs(targetCalories - nextCalories),
                priority: entry.priority ?? 99,
                stepCalories: entry.food.calories * step
            };
        })
        .filter(Boolean)
        .sort((left, right) => left.remainingGap - right.remainingGap || left.priority - right.priority || left.stepCalories - right.stepCalories)[0]?.entry || null;
};

const calculateTotals = (entries) => {
    return entries.reduce((totals, entry) => ({
        calories: totals.calories + (entry.food.calories * entry.quantity),
        protein: totals.protein + (entry.food.macros.protein * entry.quantity),
        carbs: totals.carbs + (entry.food.macros.carbs * entry.quantity),
        fat: totals.fat + (entry.food.macros.fat * entry.quantity),
        estimatedCost: totals.estimatedCost + (entry.food.estimatedCost * entry.quantity)
    }), {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        estimatedCost: 0
    });
};

const summarizeMeals = (meals) => {
    const totals = meals.reduce((summary, meal) => ({
        calories: summary.calories + meal.calories,
        protein: summary.protein + parseMacro(meal.macros.protein),
        carbs: summary.carbs + parseMacro(meal.macros.carbs),
        fat: summary.fat + parseMacro(meal.macros.fat),
        estimatedCost: summary.estimatedCost + meal.estimatedCost
    }), {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        estimatedCost: 0
    });

    return {
        calories: Math.round(totals.calories),
        protein: `${Math.round(totals.protein)}g`,
        carbs: `${Math.round(totals.carbs)}g`,
        fat: `${Math.round(totals.fat)}g`,
        estimatedCost: Math.round(totals.estimatedCost)
    };
};

const buildMealDescription = (recipe, targetCalories, calorieDelta, priceTier) => {
    return `${recipe.description} Built from ${priceTier} price ingredients and lands within ${Math.abs(calorieDelta)} kcal of the ${targetCalories} kcal target.`;
};

const formatIngredient = (entry) => {
    const totalAmount = roundNumber(entry.quantity * entry.food.serving.amount, 1);
    const unit = entry.food.serving.unit;

    if (unit === 'g' || unit === 'ml') {
        return `${formatNumber(totalAmount)} ${unit} ${entry.food.name}`;
    }

    return `${formatNumber(totalAmount)} ${pluralize(unit, totalAmount)} ${entry.food.name}`;
};

const normalizePreferences = (prefs = {}) => ({
    vegetarian: Boolean(prefs.vegetarian),
    nonVeg: Boolean(prefs.nonVeg)
});

const resolveDietProfile = (prefs) => {
    if (prefs.vegetarian) {
        return 'vegetarian';
    }

    return 'nonVeg';
};

const normalizeAllergies = (allergies) => {
    return allergies.map((allergy) => String(allergy).trim().toLowerCase());
};

const parseMacro = (value) => Number.parseFloat(String(value).replace('g', '')) || 0;

const roundToStep = (value, step) => {
    return roundNumber(Math.round(value / step) * step, 2);
};

const roundNumber = (value, precision = 0) => {
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatNumber = (value) => {
    return Number.isInteger(value) ? String(value) : String(roundNumber(value, 1));
};

const pluralize = (unit, amount) => {
    if (amount === 1) {
        return unit;
    }

    const pluralMap = {
        piece: 'pieces',
        slice: 'slices',
        cup: 'cups',
        plate: 'plates',
        tbsp: 'tbsp',
        tsp: 'tsp'
    };

    return pluralMap[unit] || unit;
};

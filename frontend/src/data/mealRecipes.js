export const RECIPE_TEMPLATES = {
    Breakfast: [
        {
            id: 'oats-curd-bowl',
            title: 'Oats and Curd Power Bowl',
            description: 'Oats with curd, banana, and peanut butter for steady energy.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'oats', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'curd', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'banana', quantity: 1, adjustable: false, priority: 4 },
                { foodId: 'peanutButter', quantity: 0.5, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'vegan-tofu-oats-bowl',
            title: 'Tofu Oats Breakfast Bowl',
            description: 'Oats, tofu, banana, and peanuts for a practical vegan breakfast.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'oats', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'tofu', quantity: 1.5, adjustable: true, priority: 2 },
                { foodId: 'banana', quantity: 1, adjustable: false, priority: 4 },
                { foodId: 'peanuts', quantity: 1, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'poha-curd-breakfast',
            title: 'Poha and Curd Plate',
            description: 'A familiar breakfast with poha, curd, and fruit.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: false,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'poha', quantity: 1, adjustable: true, priority: 1 },
                { foodId: 'curd', quantity: 1.5, adjustable: true, priority: 2 },
                { foodId: 'orange', quantity: 1, adjustable: false, priority: 3 }
            ]
        },
        {
            id: 'egg-toast-breakfast',
            title: 'Egg and Toast Breakfast',
            description: 'Eggs, toast, banana, and peanut butter for a simple protein-focused start.',
            priceTier: 'mid',
            dietProfiles: ['nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'egg', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'bread', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'banana', quantity: 1, adjustable: false, priority: 4 },
                { foodId: 'peanutButter', quantity: 0.5, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'paneer-toast-plate',
            title: 'Paneer Toast Plate',
            description: 'Paneer, bread, curd, and fruit for balanced calories at a mid-range cost.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'paneer', quantity: 1.5, adjustable: true, priority: 1 },
                { foodId: 'bread', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'curd', quantity: 1, adjustable: true, priority: 3 },
                { foodId: 'orange', quantity: 1, adjustable: false, priority: 4 }
            ]
        },
        {
            id: 'keto-paneer-bowl',
            title: 'Paneer Keto Breakfast Bowl',
            description: 'Paneer, curd, and peanuts for a dense low-carb breakfast.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: true,
            ingredients: [
                { foodId: 'paneer', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'curd', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'peanuts', quantity: 1, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'keto-egg-breakfast',
            title: 'Egg and Curd Keto Plate',
            description: 'Eggs, curd, and peanuts for a compact low-carb breakfast.',
            priceTier: 'mid',
            dietProfiles: ['nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: true,
            ingredients: [
                { foodId: 'egg', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'curd', quantity: 1.5, adjustable: true, priority: 2 },
                { foodId: 'peanuts', quantity: 1, adjustable: true, priority: 3 },
                { foodId: 'ghee', quantity: 1, adjustable: true, priority: 4 }
            ]
        },
        {
            id: 'vegan-lowcarb-breakfast',
            title: 'Tofu and Veg Breakfast Bowl',
            description: 'Tofu with veggies and peanuts for a vegan low-carb option.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'tofu', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'stirFriedVeg', quantity: 1.5, adjustable: true, priority: 2 },
                { foodId: 'peanuts', quantity: 1, adjustable: true, priority: 3 }
            ]
        }
    ],
    Lunch: [
        {
            id: 'dal-rice-thali',
            title: 'Dal Rice Thali',
            description: 'Lentils, brown rice, vegetables, and curd for a reliable balanced lunch.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: false,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'lentils', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'brownRice', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'mixedVeg', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'curd', quantity: 1, adjustable: true, priority: 4 }
            ]
        },
        {
            id: 'paneer-roti-plate',
            title: 'Paneer Roti Plate',
            description: 'Paneer with rotis and salad for a practical high-protein lunch.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'paneer', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'roti', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'salad', quantity: 1.5, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'tofu-rice-bowl',
            title: 'Tofu Rice Bowl',
            description: 'Tofu, brown rice, veggies, and peanuts for a mid-price plant-based lunch.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'tofu', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'brownRice', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'stirFriedVeg', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'peanuts', quantity: 0.5, adjustable: true, priority: 4 }
            ]
        },
        {
            id: 'chicken-rice-plate',
            title: 'Chicken Rice Plate',
            description: 'Grilled chicken, rice, and veggies tuned for protein and satiety.',
            priceTier: 'mid',
            dietProfiles: ['nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'chicken', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'whiteRice', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'mixedVeg', quantity: 1.5, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'rajma-rice-plate',
            title: 'Rajma Rice Plate',
            description: 'Rajma, rice, salad, and curd for a filling weekday lunch.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: false,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'rajma', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'whiteRice', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'salad', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'curd', quantity: 1, adjustable: true, priority: 4 }
            ]
        },
        {
            id: 'chickpea-roti-plate',
            title: 'Chickpea Roti Plate',
            description: 'Chickpea curry with rotis and salad for affordable balanced energy.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: false,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'chickpeas', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'roti', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'salad', quantity: 1.5, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'paneer-lowcarb-bowl',
            title: 'Paneer Low-Carb Bowl',
            description: 'Paneer, vegetables, and ghee for a satisfying low-carb lunch.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: true,
            ingredients: [
                { foodId: 'paneer', quantity: 2.5, adjustable: true, priority: 1 },
                { foodId: 'stirFriedVeg', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'salad', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'ghee', quantity: 1, adjustable: true, priority: 4 }
            ]
        },
        {
            id: 'chicken-lowcarb-bowl',
            title: 'Chicken Low-Carb Bowl',
            description: 'Chicken with greens and ghee for high protein without heavy carbs.',
            priceTier: 'mid',
            dietProfiles: ['nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: true,
            ingredients: [
                { foodId: 'chicken', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'stirFriedVeg', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'spinach', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'ghee', quantity: 1, adjustable: true, priority: 4 }
            ]
        },
        {
            id: 'tofu-lowcarb-bowl',
            title: 'Tofu Cauliflower Bowl',
            description: 'Tofu, cauliflower rice, and veggies for a plant-based low-carb lunch.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'tofu', quantity: 2.5, adjustable: true, priority: 1 },
                { foodId: 'cauliflowerRice', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'stirFriedVeg', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'peanuts', quantity: 1, adjustable: true, priority: 4 }
            ]
        },
        {
            id: 'egg-lowcarb-plate',
            title: 'Egg and Greens Plate',
            description: 'Eggs, spinach, salad, and peanuts for a compact low-carb meal.',
            priceTier: 'mid',
            dietProfiles: ['nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: true,
            ingredients: [
                { foodId: 'egg', quantity: 3, adjustable: true, priority: 1 },
                { foodId: 'spinach', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'salad', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'peanuts', quantity: 1, adjustable: true, priority: 4 }
            ]
        }
    ],
    Snack: [
        {
            id: 'curd-fruit-chana',
            title: 'Curd, Fruit, and Chana Snack',
            description: 'Curd with fruit and roasted chana for a balanced, easy snack.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: false,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'curd', quantity: 1.5, adjustable: true, priority: 1 },
                { foodId: 'apple', quantity: 1, adjustable: false, priority: 3 },
                { foodId: 'roastedChana', quantity: 1, adjustable: true, priority: 2 }
            ]
        },
        {
            id: 'pb-toast-milk',
            title: 'Peanut Butter Toast and Milk',
            description: 'Bread, peanut butter, and milk for an accessible calorie-controlled snack.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'bread', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'peanutButter', quantity: 1, adjustable: true, priority: 2 },
                { foodId: 'milk', quantity: 1, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'egg-fruit-snack',
            title: 'Egg and Fruit Snack Box',
            description: 'Eggs, fruit, and roasted chana for protein without a heavy meal.',
            priceTier: 'mid',
            dietProfiles: ['nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'egg', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'orange', quantity: 1, adjustable: false, priority: 3 },
                { foodId: 'roastedChana', quantity: 1, adjustable: true, priority: 2 }
            ]
        },
        {
            id: 'banana-milk-snack',
            title: 'Banana and Milk Snack',
            description: 'Banana, milk, and a little peanut butter for training-day energy.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: false,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'milk', quantity: 1, adjustable: true, priority: 1 },
                { foodId: 'banana', quantity: 1, adjustable: false, priority: 3 },
                { foodId: 'peanutButter', quantity: 0.5, adjustable: true, priority: 2 }
            ]
        },
        {
            id: 'vegan-chana-fruit',
            title: 'Vegan Chana Fruit Snack',
            description: 'Roasted chana, banana, and peanuts for a simple plant-based snack.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'roastedChana', quantity: 1.5, adjustable: true, priority: 1 },
                { foodId: 'banana', quantity: 1, adjustable: false, priority: 3 },
                { foodId: 'peanuts', quantity: 0.5, adjustable: true, priority: 2 }
            ]
        },
        {
            id: 'keto-curd-paneer-snack',
            title: 'Curd Paneer Snack Bowl',
            description: 'Curd, paneer, and peanuts for a dense low-carb snack.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: true,
            ingredients: [
                { foodId: 'curd', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'paneer', quantity: 1, adjustable: true, priority: 2 },
                { foodId: 'peanuts', quantity: 1, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'keto-egg-snack',
            title: 'Egg Keto Snack',
            description: 'Eggs, curd, and peanuts for a low-carb protein snack.',
            priceTier: 'mid',
            dietProfiles: ['nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: true,
            ingredients: [
                { foodId: 'egg', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'curd', quantity: 1, adjustable: true, priority: 2 },
                { foodId: 'peanuts', quantity: 1, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'tofu-snack-box',
            title: 'Tofu Snack Box',
            description: 'Tofu, fruit, and roasted chana for a lighter protein-forward snack.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'tofu', quantity: 1.5, adjustable: true, priority: 1 },
                { foodId: 'orange', quantity: 1, adjustable: false, priority: 3 },
                { foodId: 'roastedChana', quantity: 0.5, adjustable: true, priority: 2 }
            ]
        }
    ],
    Dinner: [
        {
            id: 'chicken-roti-dinner',
            title: 'Chicken Roti Dinner',
            description: 'Chicken, rotis, and spinach for a strong recovery dinner.',
            priceTier: 'mid',
            dietProfiles: ['nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'chicken', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'roti', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'spinach', quantity: 1.5, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'paneer-veg-roti',
            title: 'Paneer Veg Roti Dinner',
            description: 'Paneer, rotis, and vegetables for a balanced vegetarian dinner.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'paneer', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'roti', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'stirFriedVeg', quantity: 1.5, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'tofu-veg-bowl',
            title: 'Tofu Veg Dinner Bowl',
            description: 'Tofu, brown rice, vegetables, and salad for a lighter dinner.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'tofu', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'brownRice', quantity: 1.5, adjustable: true, priority: 2 },
                { foodId: 'stirFriedVeg', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'salad', quantity: 1, adjustable: true, priority: 4 }
            ]
        },
        {
            id: 'dal-roti-dinner',
            title: 'Dal Roti Dinner',
            description: 'Lentils, rotis, and salad for a practical, balanced dinner.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: false,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'lentils', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'roti', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'salad', quantity: 1.5, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'egg-roti-plate',
            title: 'Egg Roti Dinner Plate',
            description: 'Eggs, rotis, and spinach for a compact protein-rich dinner.',
            priceTier: 'mid',
            dietProfiles: ['nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: false,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'egg', quantity: 3, adjustable: true, priority: 1 },
                { foodId: 'roti', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'spinach', quantity: 1.5, adjustable: true, priority: 3 }
            ]
        },
        {
            id: 'paneer-salad-dinner',
            title: 'Paneer Salad Dinner',
            description: 'Paneer, vegetables, and ghee for a satiating low-carb dinner.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: true,
            ingredients: [
                { foodId: 'paneer', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'salad', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'stirFriedVeg', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'ghee', quantity: 1, adjustable: true, priority: 4 }
            ]
        },
        {
            id: 'chicken-salad-dinner',
            title: 'Chicken Salad Dinner',
            description: 'Chicken with greens and a little ghee for lean low-carb calories.',
            priceTier: 'mid',
            dietProfiles: ['nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: true,
            ingredients: [
                { foodId: 'chicken', quantity: 2, adjustable: true, priority: 1 },
                { foodId: 'salad', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'spinach', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'ghee', quantity: 1, adjustable: true, priority: 4 }
            ]
        },
        {
            id: 'tofu-cauliflower-dinner',
            title: 'Tofu Cauliflower Dinner Bowl',
            description: 'Tofu with cauliflower rice and veggies for a lighter low-carb dinner.',
            priceTier: 'mid',
            dietProfiles: ['vegetarian', 'nonVeg'],
            highProteinFriendly: true,
            lowCarbFriendly: true,
            ketoFriendly: false,
            ingredients: [
                { foodId: 'tofu', quantity: 2.5, adjustable: true, priority: 1 },
                { foodId: 'cauliflowerRice', quantity: 2, adjustable: true, priority: 2 },
                { foodId: 'stirFriedVeg', quantity: 1.5, adjustable: true, priority: 3 },
                { foodId: 'peanuts', quantity: 0.5, adjustable: true, priority: 4 }
            ]
        }
    ]
};

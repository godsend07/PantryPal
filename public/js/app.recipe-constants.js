/* Recipe constants and knowledge tables */

const POPULAR_INGREDIENTS = [
    "chicken", "beef", "fish", "salmon", "shrimp", "pork",
    "tomato", "onion", "garlic", "pepper", "carrot", "broccoli",
    "rice", "pasta", "bread", "potato", "beans", "lentils",
    "milk", "cheese", "butter", "oil", "salt", "sugar",
    "egg", "flour", "lemon", "lime", "basil", "oregano",
    "thyme", "cumin", "paprika", "ginger", "soy sauce"
];

const INGREDIENT_SUBSTITUTIONS = {
    "butter": ["margarine", "coconut oil", "olive oil"],
    "milk": ["oat milk", "almond milk", "coconut milk"],
    "egg": ["flax egg (1 tbsp flax + 3 tbsp water)", "applesauce", "mashed banana"],
    "cream": ["coconut cream", "cashew cream", "yogurt"],
    "flour": ["almond flour", "oat flour", "coconut flour"],
    "sugar": ["honey", "maple syrup", "stevia"],
    "soy sauce": ["tamari", "coconut aminos", "worcestershire sauce"],
    "breadcrumbs": ["crushed crackers", "oats", "almond meal"],
    "rice": ["quinoa", "couscous", "cauliflower rice"],
    "pasta": ["rice noodles", "zucchini noodles", "spaghetti squash"],
    "cheese": ["nutritional yeast", "cashew cheese", "tofu"],
    "yogurt": ["coconut yogurt", "sour cream", "buttermilk"],
    "chicken": ["tofu", "tempeh", "chickpeas"],
    "beef": ["mushrooms", "lentils", "textured soy protein"],
    "pork": ["chicken", "turkey", "jackfruit"],
    "fish": ["tofu", "tempeh", "hearts of palm"],
    "shrimp": ["king oyster mushroom", "hearts of palm", "tofu"],
    "salmon": ["trout", "arctic char", "smoked tofu"],
    "tomato": ["red pepper", "pumpkin puree", "tamarind paste"],
    "onion": ["shallots", "leeks", "scallions"],
    "garlic": ["garlic powder", "shallots", "asafoetida"],
    "lemon": ["lime", "vinegar", "citric acid"],
    "lime": ["lemon", "vinegar", "tamarind"],
    "potato": ["sweet potato", "turnip", "parsnip"],
    "carrot": ["parsnip", "sweet potato", "butternut squash"],
    "broccoli": ["cauliflower", "brussels sprouts", "asparagus"],
    "pepper": ["chili flakes", "cayenne", "paprika"],
    "basil": ["oregano", "parsley", "cilantro"],
    "oregano": ["basil", "thyme", "marjoram"],
    "thyme": ["oregano", "rosemary", "sage"],
    "cumin": ["coriander", "caraway seeds", "chili powder"],
    "paprika": ["cayenne", "chili powder", "smoked paprika"],
    "ginger": ["allspice", "cinnamon", "galangal"],
    "oil": ["butter", "cooking spray", "applesauce (in baking)"],
    "honey": ["maple syrup", "agave nectar", "golden syrup"],
    "vinegar": ["lemon juice", "lime juice", "wine"],
    "corn": ["peas", "edamame", "zucchini"],
    "spinach": ["kale", "swiss chard", "arugula"],
    "mushroom": ["zucchini", "eggplant", "sun-dried tomato"],
    "celery": ["fennel", "bok choy", "jicama"],
    "cinnamon": ["nutmeg", "allspice", "cardamom"],
    "coconut milk": ["almond milk", "cashew milk", "regular milk"],
    "peanut butter": ["almond butter", "sunflower seed butter", "tahini"],
    "bacon": ["turkey bacon", "tempeh bacon", "smoked paprika + oil"],
    "bread": ["tortilla", "lettuce wrap", "rice cake"],
    "mayonnaise": ["greek yogurt", "avocado", "hummus"],
    "ketchup": ["tomato paste + vinegar + sugar", "BBQ sauce", "salsa"],
    "sour cream": ["greek yogurt", "coconut cream", "cashew cream"],
    "heavy cream": ["coconut cream", "evaporated milk", "silken tofu blended"],
};

const SEASONAL_INGREDIENTS = {
    spring: ["asparagus", "peas", "radish", "artichoke", "mint", "spinach", "leek", "strawberry"],
    summer: ["tomato", "corn", "zucchini", "watermelon", "peach", "basil", "cucumber", "bell pepper"],
    autumn: ["pumpkin", "squash", "apple", "cranberry", "cinnamon", "sweet potato", "mushroom", "pear"],
    winter: ["potato", "turnip", "kale", "leek", "cabbage", "parsnip", "citrus", "beet"],
};

const INGREDIENT_COST_ESTIMATE = {
    "chicken": 2.50, "beef": 4.00, "salmon": 5.00, "shrimp": 4.50, "pork": 3.00,
    "fish": 3.50, "egg": 0.30, "rice": 0.50, "pasta": 0.80, "bread": 0.60,
    "potato": 0.40, "tomato": 0.50, "onion": 0.30, "garlic": 0.15, "carrot": 0.25,
    "broccoli": 0.80, "pepper": 0.70, "mushroom": 0.90, "spinach": 0.60,
    "cheese": 1.50, "milk": 0.40, "butter": 0.50, "cream": 0.80, "yogurt": 0.60,
    "oil": 0.20, "flour": 0.15, "sugar": 0.10, "lemon": 0.30, "lime": 0.30,
    "beans": 0.40, "lentils": 0.35, "corn": 0.50, "peas": 0.40,
};

const ONBOARDING_STEPS = [
    { target: "#ingredients", title: "Search by Ingredients", text: "Type the ingredients you already have and find recipes that use them. Reduce waste by cooking what you own." },
    { target: "#pantryCard", title: "Your Pantry", text: "Track what's in your kitchen and when it expires. PantryPal prioritizes recipes using soon-expiring items." },
    { target: "#leftoverCard", title: "Leftover Rescue", text: "Log leftovers and activate Rescue Mode to find recipes that use them up before they go to waste." },
    { target: "#wasteTrackerCard", title: "Waste Tracker", text: "Log any wasted food to track your environmental impact. See your waste reduction progress over time." },
    { target: "#shoppingDrawerBtn", title: "Shopping List", text: "Build shopping lists from missing recipe ingredients. Copy or download your list for the store." },
];

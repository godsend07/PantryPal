function normalizeIngredients(raw) {
    if (!raw) return [];
    return raw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i);
}

function estimateMinutesFromInstructions(text) {
    if (!text) return null;
    const t = String(text).toLowerCase();

    const mins = [...t.matchAll(/(\d+)\s*(min|mins|minute|minutes)\b/g)].map((m) => parseInt(m[1], 10));
    const hours = [...t.matchAll(/(\d+)\s*(hour|hours|hr|hrs)\b/g)].map((m) => parseInt(m[1], 10) * 60);
    const all = mins.concat(hours).filter((n) => Number.isFinite(n));
    if (all.length === 0) return null;
    return Math.max(...all);
}

function normalizeIngredientText(text) {
    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function ingredientTokens(text) {
    return normalizeIngredientText(text).split(" ").filter(Boolean);
}

function ingredientsMatch(userIngredient, recipeIngredient) {
    const userText = normalizeIngredientText(userIngredient);
    const recipeText = normalizeIngredientText(recipeIngredient);

    if (!userText || !recipeText) return false;
    if (userText === recipeText) return true;
    if (recipeText.includes(userText) || userText.includes(recipeText)) {
        return true;
    }

    const userWords = ingredientTokens(userText);
    const recipeWords = ingredientTokens(recipeText);

    if (userWords.length === 1 && recipeWords.includes(userWords[0])) {
        return true;
    }

    const overlap = userWords.filter((word) => recipeWords.includes(word));
    return overlap.length > 0;
}

function findUsedAndMissingIngredients(userIngredients, recipeIngredients) {
    const used = [];
    const missing = [];

    for (const recipeIngredient of recipeIngredients) {
        const matchedUser = userIngredients.find((userIngredient) =>
            ingredientsMatch(userIngredient, recipeIngredient)
        );

        if (matchedUser) used.push(recipeIngredient);
        else missing.push(recipeIngredient);
    }

    return { used, missing };
}

function calculateWastePriority(recipeIngredients, pantryItems) {
    let expiryScore = 0;

    recipeIngredients.forEach((ingredient) => {
        const match = pantryItems.find((p) =>
            ingredient.toLowerCase().includes(String(p.ingredientName || "").toLowerCase())
        );

        if (match) {
            if (match.status === "soon_expiring") expiryScore += 20;
            if (match.status === "expired") expiryScore += 5;
        }
    });

    return expiryScore;
}

function rankRecipes(recipes, userIngredients, pantryItems) {
    void userIngredients;

    recipes.sort((a, b) => {
        const wasteA = calculateWastePriority(a.ingredients, pantryItems);
        const wasteB = calculateWastePriority(b.ingredients, pantryItems);
        const scoreA = (a.matchRatio * 0.7) + wasteA;
        const scoreB = (b.matchRatio * 0.7) + wasteB;
        a.score = scoreA;
        b.score = scoreB;
        return scoreB - scoreA;
    });

    return recipes;
}

function registerRecipeRoutes(app, deps) {
    const {
        getCache,
        setCache,
        SearchAnalytics,
        PantryItem,
        Leftover,
        getOptionalAuthUser,
        tokenFromRequest,
        boolFromQuery,
    } = deps;

    app.get("/api/health", (req, res) => {
        res.json({ status: "ok", app: "PantryPal" });
    });

    app.get("/api/metadata", async (req, res) => {
        try {
            const fetchJson = async (url) => {
                const r = await fetch(url);
                if (!r.ok) throw new Error(`Fetch failed: ${r.status} ${r.statusText}`);
                return r.json();
            };

            const [areas, categories] = await Promise.all([
                fetchJson("https://www.themealdb.com/api/json/v1/1/list.php?a=list"),
                fetchJson("https://www.themealdb.com/api/json/v1/1/list.php?c=list"),
            ]);

            res.json({
                areas: (areas.meals || []).map((x) => x.strArea).filter(Boolean).sort(),
                categories: (categories.meals || []).map((x) => x.strCategory).filter(Boolean).sort(),
            });
        } catch (err) {
            res.status(500).json({ error: err.message || "Metadata error" });
        }
    });

    app.get("/api/recipe/:id", async (req, res) => {
        try {
            const recipeId = String(req.params.id || "").trim();
            if (!recipeId) {
                return res.status(400).json({ error: "Recipe id is required" });
            }

            const detailUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(recipeId)}`;
            const response = await fetch(detailUrl);
            if (!response.ok) {
                throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
            }

            const detailData = await response.json();
            const meal = detailData?.meals?.[0];
            if (!meal) {
                return res.status(404).json({ error: "Recipe not found" });
            }

            const recipeIngredients = [];
            for (let i = 1; i <= 20; i++) {
                const key = `strIngredient${i}`;
                const val = (meal[key] || "").trim().toLowerCase();
                if (val) recipeIngredients.push(val);
            }

            const estMinutes = estimateMinutesFromInstructions(meal.strInstructions);

            return res.json({
                recipe: {
                    idMeal: meal.idMeal,
                    strMeal: meal.strMeal,
                    strMealThumb: meal.strMealThumb,
                    used: [],
                    missing: recipeIngredients,
                    usedCount: 0,
                    missingCount: recipeIngredients.length,
                    matchRatio: 0,
                    score: 0,
                    strCategory: meal.strCategory,
                    strArea: meal.strArea,
                    strInstructions: meal.strInstructions,
                    strYoutube: meal.strYoutube,
                    strSource: meal.strSource,
                    estMinutes,
                },
            });
        } catch (err) {
            return res.status(500).json({ error: err.message || "Recipe lookup error" });
        }
    });

    app.get("/api/recipe", async (req, res) => {
        try {
            const rawName = String(req.query.name || "").trim();
            if (!rawName) {
                return res.status(400).json({ error: "Recipe name is required" });
            }

            const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(rawName)}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const meals = data?.meals || [];
            if (!meals.length) {
                return res.status(404).json({ error: "Recipe not found" });
            }

            const normalizedQuery = rawName.toLowerCase();
            const meal = meals.find((x) => String(x.strMeal || "").toLowerCase() === normalizedQuery) || meals[0];

            const recipeIngredients = [];
            for (let i = 1; i <= 20; i++) {
                const key = `strIngredient${i}`;
                const val = (meal[key] || "").trim().toLowerCase();
                if (val) recipeIngredients.push(val);
            }

            const estMinutes = estimateMinutesFromInstructions(meal.strInstructions);

            return res.json({
                recipe: {
                    idMeal: meal.idMeal,
                    strMeal: meal.strMeal,
                    strMealThumb: meal.strMealThumb,
                    used: [],
                    missing: recipeIngredients,
                    usedCount: 0,
                    missingCount: recipeIngredients.length,
                    matchRatio: 0,
                    score: 0,
                    strCategory: meal.strCategory,
                    strArea: meal.strArea,
                    strInstructions: meal.strInstructions,
                    strYoutube: meal.strYoutube,
                    strSource: meal.strSource,
                    estMinutes,
                },
            });
        } catch (err) {
            return res.status(500).json({ error: err.message || "Recipe lookup error" });
        }
    });

    app.get("/api/recipes", async (req, res) => {
        const rescueMode = boolFromQuery(req.query.rescueMode);
        const prioritizeExpiry = boolFromQuery(req.query.prioritizeExpiry);
        const personalizedMode = rescueMode || prioritizeExpiry;
        const hasAuthToken = Boolean(tokenFromRequest(req));
        const shouldUseCache = !personalizedMode && !hasAuthToken;
        const cacheKey = shouldUseCache ? JSON.stringify(req.query) : null;

        if (cacheKey) {
            const cachedResult = getCache(cacheKey);
            if (cachedResult) {
                console.log("Serving cached result");
                return res.json(cachedResult);
            }
        }

        try {
            const raw = req.query.ingredients || "";
            const userIngredients = normalizeIngredients(raw);

            const optionalUser = await getOptionalAuthUser(req);
            let pantryItems = [];
            let soonExpiringNames = [];
            let activeLeftoverNames = [];

            if (optionalUser) {
                pantryItems = await PantryItem.find({ userId: optionalUser._id }).select({ ingredientName: 1, status: 1 }).lean();
            }

            if (optionalUser && (prioritizeExpiry || rescueMode)) {
                const now = new Date();
                const soonThreshold = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

                if (prioritizeExpiry) {
                    const pantrySoon = await PantryItem.find({
                        userId: optionalUser._id,
                        status: { $in: ["fresh", "soon_expiring"] },
                        expiryDate: { $gte: now, $lte: soonThreshold },
                    }).select({ ingredientName: 1 });
                    soonExpiringNames = pantrySoon.map((x) => x.ingredientName);
                }

                if (rescueMode) {
                    const leftovers = await Leftover.find({
                        userId: optionalUser._id,
                        status: "active",
                        mustUseBy: { $gte: now },
                    }).select({ leftoverName: 1 });
                    activeLeftoverNames = leftovers.map((x) => x.leftoverName);
                }
            }

            const area = (req.query.area || "").trim();
            const category = (req.query.category || "").trim();
            const maxMinutes = req.query.maxMinutes ? parseInt(req.query.maxMinutes, 10) : null;

            if (userIngredients.length === 0) {
                return res.status(400).json({ error: "Please provide ingredients, e.g. ?ingredients=tomato,egg" });
            }

            const fetchJson = async (url) => {
                const r = await fetch(url);
                if (!r.ok) throw new Error(`Fetch failed: ${r.status} ${r.statusText}`);
                return r.json();
            };

            const merged = new Map();

            for (const ing of userIngredients) {
                const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ing)}`;
                const data = await fetchJson(url);
                const meals = data.meals || [];

                for (const meal of meals) {
                    const existing = merged.get(meal.idMeal);
                    if (existing) existing.matchCount += 1;
                    else {
                        merged.set(meal.idMeal, {
                            idMeal: meal.idMeal,
                            strMeal: meal.strMeal,
                            strMealThumb: meal.strMealThumb,
                            matchCount: 1,
                        });
                    }
                }
            }

            const candidates = Array.from(merged.values()).sort((a, b) => b.matchCount - a.matchCount).slice(0, 60);
            const detailed = [];

            for (const c of candidates) {
                const detailUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(c.idMeal)}`;
                const detailData = await fetchJson(detailUrl);
                const meal = detailData.meals ? detailData.meals[0] : null;
                if (!meal) continue;

                const recipeIngredients = [];
                for (let i = 1; i <= 20; i++) {
                    const key = `strIngredient${i}`;
                    const val = (meal[key] || "").trim().toLowerCase();
                    if (val) recipeIngredients.push(val);
                }

                const { used, missing } = findUsedAndMissingIngredients(userIngredients, recipeIngredients);
                const expiringUsed = recipeIngredients.filter((recipeIng) => soonExpiringNames.some((item) => ingredientsMatch(item, recipeIng)));
                const leftoversUsed = recipeIngredients.filter((recipeIng) => activeLeftoverNames.some((item) => ingredientsMatch(item, recipeIng)));
                const matchRatio = recipeIngredients.length > 0 ? used.length / recipeIngredients.length : 0;
                const urgencyScore = prioritizeExpiry ? expiringUsed.length * 4 : 0;
                const rescueScore = rescueMode ? leftoversUsed.length * 5 : 0;
                const score = (used.length * 3) - missing.length + (matchRatio * 5) + urgencyScore + rescueScore;
                const estMinutes = estimateMinutesFromInstructions(meal.strInstructions);

                detailed.push({
                    idMeal: c.idMeal,
                    strMeal: meal.strMeal,
                    strMealThumb: meal.strMealThumb,
                    ingredients: recipeIngredients,
                    used,
                    missing,
                    usedCount: used.length,
                    missingCount: missing.length,
                    matchRatio: Number(matchRatio.toFixed(2)),
                    score,
                    expiringUsedCount: expiringUsed.length,
                    leftoverUsedCount: leftoversUsed.length,
                    strCategory: meal.strCategory,
                    strArea: meal.strArea,
                    strInstructions: meal.strInstructions,
                    strYoutube: meal.strYoutube,
                    strSource: meal.strSource,
                    estMinutes,
                });
            }

            let filtered = detailed;
            if (area) filtered = filtered.filter((x) => (x.strArea || "").toLowerCase() === area.toLowerCase());
            if (category) filtered = filtered.filter((x) => (x.strCategory || "").toLowerCase() === category.toLowerCase());
            if (Number.isFinite(maxMinutes)) {
                filtered = filtered.filter((x) => x.estMinutes !== null && x.estMinutes <= maxMinutes);
            }

            rankRecipes(filtered, userIngredients, pantryItems);

            const responseData = {
                app: "PantryPal",
                input: userIngredients,
                filters: {
                    area: area || null,
                    category: category || null,
                    maxMinutes: Number.isFinite(maxMinutes) ? maxMinutes : null,
                },
                modes: { rescueMode, prioritizeExpiry },
                results: filtered.slice(0, 20),
            };

            if (optionalUser) {
                try {
                    const results = responseData.results || [];
                    const resultCount = results.length;
                    const zeroMissingCount = results.filter((r) => (r.missingCount || 0) === 0).length;
                    const totalMissingCount = results.reduce((acc, r) => acc + (r.missingCount || 0), 0);
                    const avgMissingCount = resultCount > 0 ? totalMissingCount / resultCount : 0;
                    const avgMatchRatio = resultCount > 0
                        ? results.reduce((acc, r) => acc + (r.matchRatio || 0), 0) / resultCount
                        : 0;

                    await SearchAnalytics.create({
                        userId: optionalUser._id,
                        searchedAt: new Date(),
                        ingredientCount: userIngredients.length,
                        resultCount,
                        zeroMissingCount,
                        totalMissingCount,
                        avgMissingCount: Number(avgMissingCount.toFixed(2)),
                        avgMatchRatio: Number(avgMatchRatio.toFixed(2)),
                        rescueMode,
                        prioritizeExpiry,
                        area,
                        category,
                        maxMinutes: Number.isFinite(maxMinutes) ? maxMinutes : null,
                    });
                } catch (analyticsErr) {
                    console.error("Search analytics logging failed:", analyticsErr.message);
                }
            }

            if (cacheKey) setCache(cacheKey, responseData);
            res.json(responseData);
        } catch (err) {
            res.status(500).json({ error: err.message || "Server error" });
        }
    });
}

module.exports = { registerRecipeRoutes };
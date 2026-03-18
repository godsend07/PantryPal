function registerUserRoutes(app, deps) {
    const {
        loginRateLimiter,
        signupRateLimiter,
        User,
        Session,
        Favorite,
        ShoppingItem,
        PantryItem,
        Leftover,
        WasteLog,
        SearchAnalytics,
        MealPlan,
        CookLog,
        FeedbackSurvey,
        normalizeEmail,
        hashPassword,
        verifyPassword,
        publicUser,
        serializeShoppingItem,
        serializePantryItem,
        serializeLeftover,
        serializeWasteLog,
        requireAuth,
        createSession,
        validateSignupInput,
        validateLoginInput,
        validatePantryCreateInput,
        validatePantryPatchInput,
        validateLeftoverCreateInput,
        validateLeftoverPatchInput,
        validateWasteLogCreateInput,
        computePantryStatus,
        parseDate,
        getObjectIdParam,
        updateOwnedDoc,
        deleteOwnedDoc,
    } = deps;

    app.post("/api/auth/signup", signupRateLimiter, async (req, res) => {
        const name = String(req.body?.name || "").trim();
        const email = normalizeEmail(req.body?.email);
        const password = String(req.body?.password || "");

        const signupError = validateSignupInput(name, email, password);
        if (signupError) return res.status(400).json({ error: signupError });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email is already registered" });
        }

        const salt = require("crypto").randomBytes(16).toString("hex");
        const passwordHash = hashPassword(password, salt);
        const user = await User.create({ name, email, salt, passwordHash });
        const token = await createSession(user);

        return res.status(201).json({
            message: "Signup successful",
            token,
            user: publicUser(user),
        });
    });

    app.post("/api/auth/login", loginRateLimiter, async (req, res) => {
        const email = normalizeEmail(req.body?.email);
        const password = String(req.body?.password || "");

        const loginError = validateLoginInput(email, password);
        if (loginError) return res.status(400).json({ error: loginError });

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const ok = verifyPassword(password, user.salt, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = await createSession(user);

        return res.json({
            message: "Login successful",
            token,
            user: publicUser(user),
        });
    });

    app.get("/api/auth/me", async (req, res) => {
        const token = deps.tokenFromRequest(req);
        if (!token) return res.status(401).json({ error: "Missing auth token" });

        const auth = await deps.findSessionUser(token);
        if (!auth) return res.status(401).json({ error: "Invalid or expired token" });

        const { user } = auth;
        if (!user) return res.status(401).json({ error: "User not found" });

        return res.json({ user: publicUser(user) });
    });

    app.post("/api/auth/logout", async (req, res) => {
        const token = deps.tokenFromRequest(req);
        if (token) {
            await Session.deleteOne({ token });
        }
        return res.json({ message: "Logged out" });
    });

    app.get("/api/user/favorites", requireAuth, async (req, res) => {
        const docs = await Favorite.find({ userId: req.auth.user._id }).sort({ createdAt: -1 });
        return res.json({ favorites: docs.map((d) => d.recipe) });
    });

    app.post("/api/user/favorites", requireAuth, async (req, res) => {
        const recipe = req.body?.recipe;
        const recipeId = String(recipe?.idMeal || "").trim();

        if (!recipe || !recipeId) {
            return res.status(400).json({ error: "Valid recipe object with idMeal is required" });
        }

        await Favorite.findOneAndUpdate(
            { userId: req.auth.user._id, recipeId },
            { userId: req.auth.user._id, recipeId, recipe },
            { upsert: true, returnDocument: "after" }
        );

        return res.status(201).json({ message: "Favorite saved" });
    });

    app.delete("/api/user/favorites/:recipeId", requireAuth, async (req, res) => {
        const recipeId = String(req.params.recipeId || "").trim();
        if (!recipeId) return res.status(400).json({ error: "recipeId is required" });

        await Favorite.deleteOne({ userId: req.auth.user._id, recipeId });
        return res.json({ message: "Favorite removed" });
    });

    app.get("/api/user/shopping-list", requireAuth, async (req, res) => {
        const docs = await ShoppingItem.find({ userId: req.auth.user._id }).sort({ recipeName: 1, createdAt: 1 });
        return res.json({ items: docs.map(serializeShoppingItem) });
    });

    app.post("/api/user/shopping-list/bulk", requireAuth, async (req, res) => {
        const items = Array.isArray(req.body?.items) ? req.body.items : [];
        const recipeId = String(req.body?.recipeId || "").trim();
        const recipeName = String(req.body?.recipeName || "").trim();

        const names = items.map((x) => String(x || "").trim().toLowerCase()).filter(Boolean);

        if (names.length === 0) {
            return res.status(400).json({ error: "items array is required" });
        }

        const existing = await ShoppingItem.find({
            userId: req.auth.user._id,
            recipeId,
            name: { $in: names },
        }).select({ name: 1 });

        const existingSet = new Set(existing.map((d) => d.name));
        const newNames = names.filter((n) => !existingSet.has(n));

        if (newNames.length > 0) {
            await ShoppingItem.insertMany(
                newNames.map((name) => ({
                    userId: req.auth.user._id,
                    recipeId,
                    recipeName,
                    name,
                    bought: false,
                }))
            );
        }

        return res.json({ addedCount: newNames.length });
    });

    app.delete("/api/user/shopping-list/recipe/:recipeId", requireAuth, async (req, res) => {
        const recipeId = String(req.params.recipeId || "").trim();
        await ShoppingItem.deleteMany({ userId: req.auth.user._id, recipeId });
        return res.json({ message: "Recipe group cleared" });
    });

    app.patch("/api/user/shopping-list/:itemId", requireAuth, async (req, res) => {
        const itemId = getObjectIdParam(req, res);
        if (!itemId) return;
        const bought = req.body?.bought;

        if (typeof bought !== "boolean") {
            return res.status(400).json({ error: "bought boolean is required" });
        }

        const updated = await updateOwnedDoc(ShoppingItem, req.auth.user._id, itemId, { bought }, { runValidators: false });
        if (!updated) return res.status(404).json({ error: "Item not found" });

        return res.json({ item: serializeShoppingItem(updated) });
    });

    app.delete("/api/user/shopping-list/:itemId", requireAuth, async (req, res) => {
        const itemId = getObjectIdParam(req, res);
        if (!itemId) return;

        await deleteOwnedDoc(ShoppingItem, req.auth.user._id, itemId);
        return res.json({ message: "Item removed" });
    });

    app.delete("/api/user/shopping-list", requireAuth, async (req, res) => {
        await ShoppingItem.deleteMany({ userId: req.auth.user._id });
        return res.json({ message: "Shopping list cleared" });
    });

    app.get("/api/user/pantry", requireAuth, async (req, res) => {
        const docs = await PantryItem.find({ userId: req.auth.user._id }).sort({ expiryDate: 1, ingredientName: 1 });
        return res.json({ items: docs.map(serializePantryItem) });
    });

    app.post("/api/user/pantry", requireAuth, async (req, res) => {
        const validation = validatePantryCreateInput(req.body);
        if (validation.error) return res.status(400).json({ error: validation.error });

        const { ingredientName, quantity, unit, category, storageLocation, purchaseDate, expiryDate } = validation.value;
        const status = computePantryStatus(expiryDate);

        const doc = await PantryItem.findOneAndUpdate(
            { userId: req.auth.user._id, ingredientName },
            {
                userId: req.auth.user._id,
                ingredientName,
                quantity: Number.isFinite(quantity) ? quantity : 1,
                unit,
                category,
                storageLocation,
                purchaseDate,
                expiryDate,
                status,
            },
            { upsert: true, returnDocument: "after", runValidators: true }
        );

        return res.status(201).json({ item: serializePantryItem(doc) });
    });

    app.patch("/api/user/pantry/:itemId", requireAuth, async (req, res) => {
        const itemId = getObjectIdParam(req, res);
        if (!itemId) return;

        const validation = validatePantryPatchInput(req.body);
        if (validation.error) return res.status(400).json({ error: validation.error });
        const updates = validation.value;

        const updated = await updateOwnedDoc(PantryItem, req.auth.user._id, itemId, updates);
        if (!updated) return res.status(404).json({ error: "Pantry item not found" });
        return res.json({ message: "Pantry item updated" });
    });

    app.delete("/api/user/pantry/:itemId", requireAuth, async (req, res) => {
        const itemId = getObjectIdParam(req, res);
        if (!itemId) return;

        await deleteOwnedDoc(PantryItem, req.auth.user._id, itemId);
        return res.json({ message: "Pantry item removed" });
    });

    app.get("/api/user/pantry/soon-expiring", requireAuth, async (req, res) => {
        const days = Number.parseInt(String(req.query.days || "3"), 10);
        const thresholdDays = Number.isFinite(days) && days > 0 ? days : 3;
        const now = new Date();
        const threshold = new Date(now.getTime() + thresholdDays * 24 * 60 * 60 * 1000);

        const docs = await PantryItem.find({
            userId: req.auth.user._id,
            status: { $ne: "used" },
            expiryDate: { $gte: now, $lte: threshold },
        }).sort({ expiryDate: 1 });

        return res.json({ days: thresholdDays, count: docs.length, items: docs.map(serializePantryItem) });
    });

    app.get("/api/user/leftovers", requireAuth, async (req, res) => {
        const docs = await Leftover.find({ userId: req.auth.user._id }).sort({ mustUseBy: 1, createdAt: -1 });
        return res.json({ items: docs.map(serializeLeftover) });
    });

    app.post("/api/user/leftovers", requireAuth, async (req, res) => {
        const validation = validateLeftoverCreateInput(req.body);
        if (validation.error) return res.status(400).json({ error: validation.error });

        const { leftoverName, amount, unit, cookedDate, mustUseBy, notes } = validation.value;

        const doc = await Leftover.create({
            userId: req.auth.user._id,
            leftoverName,
            amount,
            unit,
            cookedDate,
            mustUseBy,
            notes,
            status: "active",
        });

        return res.status(201).json({ id: String(doc._id), message: "Leftover added" });
    });

    app.patch("/api/user/leftovers/:itemId", requireAuth, async (req, res) => {
        const itemId = getObjectIdParam(req, res);
        if (!itemId) return;

        const validation = validateLeftoverPatchInput(req.body);
        if (validation.error) return res.status(400).json({ error: validation.error });
        const updates = validation.value;

        const updated = await updateOwnedDoc(Leftover, req.auth.user._id, itemId, updates);
        if (!updated) return res.status(404).json({ error: "Leftover item not found" });
        return res.json({ message: "Leftover updated" });
    });

    app.delete("/api/user/leftovers/:itemId", requireAuth, async (req, res) => {
        const itemId = getObjectIdParam(req, res);
        if (!itemId) return;

        await deleteOwnedDoc(Leftover, req.auth.user._id, itemId);
        return res.json({ message: "Leftover removed" });
    });

    app.post("/api/user/waste-logs", requireAuth, async (req, res) => {
        const validation = validateWasteLogCreateInput(req.body);
        if (validation.error) return res.status(400).json({ error: validation.error });

        const { ingredientName, quantity, unit, reason, estimatedCost, estimatedWeightGrams, date } = validation.value;

        const doc = await WasteLog.create({
            userId: req.auth.user._id,
            ingredientName,
            quantity,
            unit,
            reason,
            estimatedCost,
            estimatedWeightGrams,
            date,
        });

        return res.status(201).json({ id: String(doc._id), message: "Waste log added" });
    });

    app.get("/api/user/waste-logs", requireAuth, async (req, res) => {
        const from = parseDate(req.query.from);
        const to = parseDate(req.query.to);
        const query = { userId: req.auth.user._id };

        if (from || to) {
            query.date = {};
            if (from) query.date.$gte = from;
            if (to) query.date.$lte = to;
        }

        const docs = await WasteLog.find(query).sort({ date: -1, createdAt: -1 }).limit(200);
        return res.json({ items: docs.map(serializeWasteLog) });
    });

    app.get("/api/user/metrics/impact", requireAuth, async (req, res) => {
        const now = new Date();
        const currentStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const baselineStart = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

        const [baselineLogs, currentLogs, soonExpiring, leftovers] = await Promise.all([
            WasteLog.find({ userId: req.auth.user._id, date: { $gte: baselineStart, $lt: currentStart } }),
            WasteLog.find({ userId: req.auth.user._id, date: { $gte: currentStart, $lte: now } }),
            PantryItem.find({
                userId: req.auth.user._id,
                status: { $in: ["fresh", "soon_expiring"] },
                expiryDate: { $gte: now, $lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) },
            }),
            Leftover.find({ userId: req.auth.user._id, status: "active" }),
        ]);

        const sumWeight = (items) => items.reduce((acc, item) => acc + (item.estimatedWeightGrams || 0), 0);
        const sumCost = (items) => items.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);

        const baselineWeight = sumWeight(baselineLogs);
        const currentWeight = sumWeight(currentLogs);
        const baselineCost = sumCost(baselineLogs);
        const currentCost = sumCost(currentLogs);

        const weightReductionPercent = baselineWeight > 0
            ? Number((((baselineWeight - currentWeight) / baselineWeight) * 100).toFixed(2))
            : 0;
        const costReductionPercent = baselineCost > 0
            ? Number((((baselineCost - currentCost) / baselineCost) * 100).toFixed(2))
            : 0;

        const co2eAvoidedKg = Number((((Math.max(0, baselineWeight - currentWeight)) / 1000) * 2.5).toFixed(2));

        return res.json({
            baseline: {
                weightGrams: baselineWeight,
                cost: Number(baselineCost.toFixed(2)),
                entries: baselineLogs.length,
            },
            current: {
                weightGrams: currentWeight,
                cost: Number(currentCost.toFixed(2)),
                entries: currentLogs.length,
            },
            progress: { weightReductionPercent, costReductionPercent, co2eAvoidedKg },
            live: {
                soonExpiringCount: soonExpiring.length,
                activeLeftoversCount: leftovers.length,
            },
        });
    });

    app.get("/api/user/metrics/kpi-summary", requireAuth, async (req, res) => {
        const daysRaw = Number.parseInt(String(req.query.days || "30"), 10);
        const days = Number.isFinite(daysRaw) ? daysRaw : NaN;

        if (!Number.isFinite(days) || days <= 0 || days > 365) {
            return res.status(400).json({ error: "days must be an integer between 1 and 365" });
        }

        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        const docs = await SearchAnalytics.find({
            userId: req.auth.user._id,
            searchedAt: { $gte: startDate, $lte: now },
        }).sort({ searchedAt: 1 }).lean();

        const totals = docs.reduce(
            (acc, doc) => {
                acc.totalSearches += 1;
                acc.totalRecipesReturned += doc.resultCount || 0;
                acc.totalZeroMissingRecipes += doc.zeroMissingCount || 0;
                acc.totalMissingAcrossResults += doc.totalMissingCount || 0;
                if (doc.rescueMode) acc.rescueModeSearches += 1;
                if (doc.prioritizeExpiry) acc.prioritizeExpirySearches += 1;
                return acc;
            },
            {
                totalSearches: 0,
                totalRecipesReturned: 0,
                totalZeroMissingRecipes: 0,
                totalMissingAcrossResults: 0,
                rescueModeSearches: 0,
                prioritizeExpirySearches: 0,
            }
        );

        const recipeDenominator = totals.totalRecipesReturned || 1;
        const searchDenominator = totals.totalSearches || 1;

        const kpis = {
            zeroMissingRecipePercentage: Number(((totals.totalZeroMissingRecipes / recipeDenominator) * 100).toFixed(2)),
            averageMissingIngredientsPerRecipe: Number((totals.totalMissingAcrossResults / recipeDenominator).toFixed(2)),
            averageMissingIngredientsPerSearch: Number((totals.totalMissingAcrossResults / searchDenominator).toFixed(2)),
            averageRecipesReturnedPerSearch: Number((totals.totalRecipesReturned / searchDenominator).toFixed(2)),
            rescueModeUsageRate: Number(((totals.rescueModeSearches / searchDenominator) * 100).toFixed(2)),
            prioritizeExpiryUsageRate: Number(((totals.prioritizeExpirySearches / searchDenominator) * 100).toFixed(2)),
        };

        const series = docs.map((doc) => ({
            searchedAt: doc.searchedAt,
            ingredientCount: doc.ingredientCount || 0,
            resultCount: doc.resultCount || 0,
            zeroMissingCount: doc.zeroMissingCount || 0,
            avgMissingCount: doc.avgMissingCount || 0,
            avgMatchRatio: doc.avgMatchRatio || 0,
            rescueMode: Boolean(doc.rescueMode),
            prioritizeExpiry: Boolean(doc.prioritizeExpiry),
        }));

        return res.json({
            window: { days, startDate, endDate: now, generatedAt: new Date() },
            totals,
            kpis,
            series,
        });
    });

    // ── Meal Plan ────────────────────────────────────────────────

    const MEAL_PLAN_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const MEAL_PLAN_SLOTS = ["breakfast", "lunch", "dinner", "snack"];

    app.get("/api/user/meal-plan", requireAuth, async (req, res) => {
        const weekStart = parseDate(req.query.weekStart);
        if (!weekStart) return res.status(400).json({ error: "weekStart date is required" });

        const docs = await MealPlan.find({ userId: req.auth.user._id, weekStart })
            .sort({ day: 1, slot: 1 });
        return res.json({
            items: docs.map((d) => ({
                id: String(d._id),
                weekStart: d.weekStart,
                day: d.day,
                slot: d.slot,
                recipeId: d.recipeId,
                recipe: d.recipe,
            })),
        });
    });

    app.post("/api/user/meal-plan", requireAuth, async (req, res) => {
        const weekStart = parseDate(req.body?.weekStart);
        const day = String(req.body?.day || "").trim().toLowerCase();
        const slot = String(req.body?.slot || "dinner").trim().toLowerCase();
        const recipe = req.body?.recipe;
        const recipeId = String(recipe?.idMeal || "").trim();

        if (!weekStart) return res.status(400).json({ error: "weekStart date is required" });
        if (!MEAL_PLAN_DAYS.includes(day)) return res.status(400).json({ error: `day must be one of: ${MEAL_PLAN_DAYS.join(", ")}` });
        if (!MEAL_PLAN_SLOTS.includes(slot)) return res.status(400).json({ error: `slot must be one of: ${MEAL_PLAN_SLOTS.join(", ")}` });
        if (!recipe || !recipeId) return res.status(400).json({ error: "Valid recipe object with idMeal is required" });

        const doc = await MealPlan.findOneAndUpdate(
            { userId: req.auth.user._id, weekStart, day, slot },
            { userId: req.auth.user._id, weekStart, day, slot, recipeId, recipe },
            { upsert: true, returnDocument: "after", runValidators: true }
        );

        return res.status(201).json({
            id: String(doc._id),
            message: "Meal plan updated",
        });
    });

    app.delete("/api/user/meal-plan/:itemId", requireAuth, async (req, res) => {
        const itemId = getObjectIdParam(req, res);
        if (!itemId) return;

        await deleteOwnedDoc(MealPlan, req.auth.user._id, itemId);
        return res.json({ message: "Meal plan entry removed" });
    });

    app.get("/api/user/meal-plan/shopping-list", requireAuth, async (req, res) => {
        const weekStart = parseDate(req.query.weekStart);
        if (!weekStart) return res.status(400).json({ error: "weekStart date is required" });

        const docs = await MealPlan.find({ userId: req.auth.user._id, weekStart });
        const allMissing = [];
        for (const d of docs) {
            const recipe = d.recipe || {};
            const missing = Array.isArray(recipe.missing) ? recipe.missing : [];
            for (const name of missing) {
                const n = String(name || "").trim().toLowerCase();
                if (n && !allMissing.includes(n)) allMissing.push(n);
            }
        }

        return res.json({ items: allMissing, count: allMissing.length });
    });

    // ── Cook Log ─────────────────────────────────────────────────

    app.get("/api/user/cook-log", requireAuth, async (req, res) => {
        const docs = await CookLog.find({ userId: req.auth.user._id })
            .sort({ cookedAt: -1 })
            .limit(50);
        return res.json({
            items: docs.map((d) => ({
                id: String(d._id),
                recipeId: d.recipeId,
                recipe: d.recipe,
                cookedAt: d.cookedAt,
                deductedFromPantry: d.deductedFromPantry,
            })),
        });
    });

    app.post("/api/user/cook-log", requireAuth, async (req, res) => {
        const recipe = req.body?.recipe;
        const recipeId = String(recipe?.idMeal || req.body?.recipeId || "").trim();
        const deductIngredients = Boolean(req.body?.deductIngredients);

        if (!recipeId) return res.status(400).json({ error: "recipeId is required" });

        const doc = await CookLog.create({
            userId: req.auth.user._id,
            recipeId,
            recipe: recipe || { idMeal: recipeId },
            deductedFromPantry: deductIngredients,
        });

        if (deductIngredients && recipe) {
            const used = Array.isArray(recipe.used) ? recipe.used : [];
            for (const ingredientName of used) {
                const name = String(ingredientName || "").trim().toLowerCase();
                if (!name) continue;
                const item = await PantryItem.findOne({ userId: req.auth.user._id, ingredientName: name });
                if (item) {
                    const newQty = Math.max(0, item.quantity - 1);
                    const updates = { quantity: newQty };
                    if (newQty === 0) updates.status = "used";
                    await PantryItem.updateOne({ _id: item._id }, updates);
                }
            }
        }

        return res.status(201).json({ id: String(doc._id), message: "Cook logged" });
    });

    // ── Feature Flags ────────────────────────────────────────────

    app.patch("/api/user/feature-flags", requireAuth, async (req, res) => {
        const flags = req.body?.flags;
        if (!flags || typeof flags !== "object" || Array.isArray(flags)) {
            return res.status(400).json({ error: "flags object is required" });
        }

        const user = req.auth.user;
        if (!user.featureFlags) user.featureFlags = new Map();
        for (const [key, value] of Object.entries(flags)) {
            user.featureFlags.set(key, value);
        }
        await user.save();

        return res.json({ message: "Feature flags updated", featureFlags: Object.fromEntries(user.featureFlags) });
    });

    // ── Feedback Survey ──────────────────────────────────────────

    app.post("/api/user/feedback", requireAuth, async (req, res) => {
        const responses = req.body?.responses;
        if (!responses || typeof responses !== "object" || Array.isArray(responses)) {
            return res.status(400).json({ error: "responses object is required" });
        }
        if (Object.keys(responses).length === 0) {
            return res.status(400).json({ error: "responses cannot be empty" });
        }

        const doc = await FeedbackSurvey.create({
            userId: req.auth.user._id,
            responses,
        });

        return res.status(201).json({ id: String(doc._id), message: "Feedback submitted" });
    });
}

module.exports = { registerUserRoutes };
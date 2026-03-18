require("dotenv").config();

const express = require("express");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { registerUserRoutes } = require("./server-user-routes");
const { registerRecipeRoutes } = require("./server-recipe-routes");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pantrypal";

// CORS
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.status(204).end();
    next();
});

// Security headers
app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
});

app.use(express.json({ limit: "50kb" }));

const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000;

function getCache(key) {
    const entry = cache.get(key);
    if (!entry) return null;

    const expired = Date.now() - entry.timestamp > CACHE_DURATION;
    if (expired) {
        cache.delete(key);
        return null;
    }

    return entry.data;
}

function setCache(key, data) {
    cache.set(key, {
        data,
        timestamp: Date.now(),
    });
}

// Simple in-memory rate limiter — no extra dependencies needed.
// Returns an Express middleware that allows `maxRequests` per `windowMs` per IP.
function createRateLimiter(maxRequests, windowMs) {
    const hits = new Map(); // ip -> [timestamp, ...]

    // Prune entries older than the window every minute to prevent memory leak
    setInterval(() => {
        const cutoff = Date.now() - windowMs;
        for (const [ip, timestamps] of hits.entries()) {
            const recent = timestamps.filter((t) => t > cutoff);
            if (recent.length === 0) hits.delete(ip);
            else hits.set(ip, recent);
        }
    }, 60_000).unref();

    return (req, res, next) => {
        const ip = req.ip || req.socket?.remoteAddress || "unknown";
        const now = Date.now();
        const cutoff = now - windowMs;
        const timestamps = (hits.get(ip) || []).filter((t) => t > cutoff);
        timestamps.push(now);
        hits.set(ip, timestamps);

        if (timestamps.length > maxRequests) {
            const retryAfterSec = Math.ceil(windowMs / 1000);
            res.setHeader("Retry-After", String(retryAfterSec));
            return res.status(429).json({ error: "Too many requests, please try again later." });
        }
        next();
    };
}

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        salt: { type: String, required: true },
        passwordHash: { type: String, required: true },
        featureFlags: { type: Map, of: mongoose.Schema.Types.Mixed, default: () => new Map() },
    },
    { timestamps: true }
);

const sessionSchema = new mongoose.Schema(
    {
        token: { type: String, required: true, unique: true, index: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
    },
    { timestamps: true }
);

const favoriteSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        recipeId: { type: String, required: true },
        recipe: { type: Object, required: true },
    },
    { timestamps: true }
);

favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

const shoppingItemSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        recipeId: { type: String, default: "" },
        recipeName: { type: String, default: "" },
        name: { type: String, required: true, trim: true },
        bought: { type: Boolean, default: false },
    },
    { timestamps: true }
);

shoppingItemSchema.index({ userId: 1, recipeId: 1, name: 1 }, { unique: true });

const pantryItemSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        ingredientName: { type: String, required: true, trim: true, lowercase: true },
        quantity: { type: Number, default: 1, min: 0 },
        unit: { type: String, default: "unit", trim: true },
        category: {
            type: String,
            enum: ["produce", "dairy", "meat", "dry_goods", "frozen", "other"],
            default: "other",
        },
        storageLocation: {
            type: String,
            enum: ["fridge", "freezer", "pantry", "other"],
            default: "pantry",
        },
        purchaseDate: { type: Date, default: Date.now },
        expiryDate: { type: Date, required: true, index: true },
        status: {
            type: String,
            enum: ["fresh", "soon_expiring", "expired", "used"],
            default: "fresh",
            index: true,
        },
    },
    { timestamps: true }
);

const leftoverSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        leftoverName: { type: String, required: true, trim: true, lowercase: true },
        amount: { type: Number, default: 1, min: 0 },
        unit: { type: String, default: "portion", trim: true },
        cookedDate: { type: Date, default: Date.now },
        mustUseBy: { type: Date, required: true, index: true },
        notes: { type: String, default: "", trim: true },
        usedInRecipeId: { type: String, default: "" },
        status: {
            type: String,
            enum: ["active", "used", "discarded"],
            default: "active",
            index: true,
        },
    },
    { timestamps: true }
);

const wasteLogSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        date: { type: Date, default: Date.now, index: true },
        ingredientName: { type: String, required: true, trim: true, lowercase: true },
        quantity: { type: Number, default: 1, min: 0 },
        unit: { type: String, default: "unit", trim: true },
        reason: {
            type: String,
            enum: ["expired", "overcooked", "forgot", "disliked", "too_much_bought", "other"],
            default: "other",
        },
        estimatedCost: { type: Number, default: 0, min: 0 },
        estimatedWeightGrams: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

const searchAnalyticsSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        searchedAt: { type: Date, default: Date.now, index: true },
        ingredientCount: { type: Number, default: 0, min: 0 },
        resultCount: { type: Number, default: 0, min: 0 },
        zeroMissingCount: { type: Number, default: 0, min: 0 },
        totalMissingCount: { type: Number, default: 0, min: 0 },
        avgMissingCount: { type: Number, default: 0, min: 0 },
        avgMatchRatio: { type: Number, default: 0, min: 0 },
        rescueMode: { type: Boolean, default: false },
        prioritizeExpiry: { type: Boolean, default: false },
        area: { type: String, default: "" },
        category: { type: String, default: "" },
        maxMinutes: { type: Number, default: null },
    },
    { timestamps: true }
);

pantryItemSchema.index({ userId: 1, ingredientName: 1 }, { unique: true });
leftoverSchema.index({ userId: 1, leftoverName: 1, status: 1 });
searchAnalyticsSchema.index({ userId: 1, searchedAt: -1 });

const mealPlanSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        weekStart: { type: Date, required: true },
        day: { type: String, enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], required: true },
        slot: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], default: "dinner" },
        recipeId: { type: String, required: true },
        recipe: { type: Object, required: true },
    },
    { timestamps: true }
);
mealPlanSchema.index({ userId: 1, weekStart: 1, day: 1, slot: 1 }, { unique: true });

const cookLogSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        recipeId: { type: String, required: true },
        recipe: { type: Object, required: true },
        cookedAt: { type: Date, default: Date.now, index: true },
        deductedFromPantry: { type: Boolean, default: false },
    },
    { timestamps: true }
);
cookLogSchema.index({ userId: 1, cookedAt: -1 });

const feedbackSurveySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        responses: { type: Object, required: true },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);
const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);
const ShoppingItem = mongoose.models.ShoppingItem || mongoose.model("ShoppingItem", shoppingItemSchema);
const PantryItem = mongoose.models.PantryItem || mongoose.model("PantryItem", pantryItemSchema);
const Leftover = mongoose.models.Leftover || mongoose.model("Leftover", leftoverSchema);
const WasteLog = mongoose.models.WasteLog || mongoose.model("WasteLog", wasteLogSchema);
const SearchAnalytics = mongoose.models.SearchAnalytics || mongoose.model("SearchAnalytics", searchAnalyticsSchema);
const MealPlan = mongoose.models.MealPlan || mongoose.model("MealPlan", mealPlanSchema);
const CookLog = mongoose.models.CookLog || mongoose.model("CookLog", cookLogSchema);
const FeedbackSurvey = mongoose.models.FeedbackSurvey || mongoose.model("FeedbackSurvey", feedbackSurveySchema);

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function hashPassword(password, salt) {
    return crypto.scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(password, salt, expectedHash) {
    const actualHash = hashPassword(password, salt);
    const expected = Buffer.from(expectedHash, "hex");
    const actual = Buffer.from(actualHash, "hex");
    if (expected.length !== actual.length) return false;
    return crypto.timingSafeEqual(expected, actual);
}

function publicUser(user) {
    const flags = user.featureFlags instanceof Map
        ? Object.fromEntries(user.featureFlags)
        : (user.featureFlags || {});
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        featureFlags: flags,
    };
}

function serializeShoppingItem(item) {
    return {
        id: String(item._id),
        name: item.name,
        bought: Boolean(item.bought),
        recipeId: item.recipeId || "",
        recipeName: item.recipeName || "",
    };
}

function serializePantryItem(item) {
    return {
        id: String(item._id),
        ingredientName: item.ingredientName,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        storageLocation: item.storageLocation,
        purchaseDate: item.purchaseDate,
        expiryDate: item.expiryDate,
        status: item.status,
    };
}

function serializeLeftover(item) {
    return {
        id: String(item._id),
        leftoverName: item.leftoverName,
        amount: item.amount,
        unit: item.unit,
        cookedDate: item.cookedDate,
        mustUseBy: item.mustUseBy,
        notes: item.notes,
        usedInRecipeId: item.usedInRecipeId,
        status: item.status,
    };
}

function serializeWasteLog(item) {
    return {
        id: String(item._id),
        date: item.date,
        ingredientName: item.ingredientName,
        quantity: item.quantity,
        unit: item.unit,
        reason: item.reason,
        estimatedCost: item.estimatedCost,
        estimatedWeightGrams: item.estimatedWeightGrams,
    };
}

function tokenFromRequest(req) {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) return null;
    return authHeader.slice(7).trim();
}

function buildUtcNoonDate(year, month, day) {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);

    if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;

    const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
    if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
        return null;
    }

    return date;
}

function parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

    const raw = String(value).trim();
    if (!raw) return null;

    const isoDateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoDateOnly) {
        return buildUtcNoonDate(isoDateOnly[1], isoDateOnly[2], isoDateOnly[3]);
    }

    const slashDate = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashDate) {
        let first = Number(slashDate[1]);
        let second = Number(slashDate[2]);
        const year = Number(slashDate[3]);

        if (!Number.isInteger(first) || !Number.isInteger(second) || !Number.isInteger(year)) {
            return null;
        }

        let day = first;
        let month = second;
        if (first <= 12 && second > 12) {
            month = first;
            day = second;
        }

        return buildUtcNoonDate(year, month, day);
    }

    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
}

function computePantryStatus(expiryDate, soonDays = 3) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const expiry = new Date(expiryDate);
    const expiryDay = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    const ms = expiryDay.getTime() - today.getTime();
    const days = Math.round(ms / (24 * 60 * 60 * 1000));
    if (days < 0) return "expired";
    if (days <= soonDays) return "soon_expiring";
    return "fresh";
}

function boolFromQuery(value) {
    const v = String(value || "").toLowerCase();
    return v === "1" || v === "true" || v === "yes";
}

const PANTRY_CATEGORIES = ["produce", "dairy", "meat", "dry_goods", "frozen", "other"];
const PANTRY_STORAGE_LOCATIONS = ["fridge", "freezer", "pantry", "other"];
const PANTRY_STATUSES = ["fresh", "soon_expiring", "expired", "used"];
const LEFTOVER_STATUSES = ["active", "used", "discarded"];
const WASTE_REASONS = ["expired", "overcooked", "forgot", "disliked", "too_much_bought", "other"];

function isNonNegativeFiniteNumber(value) {
    return Number.isFinite(value) && value >= 0;
}

function validateSignupInput(name, email, password) {
    if (!name || !email || !password) return "name, email, and password are required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please provide a valid email address";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
}

function validateLoginInput(email, password) {
    if (!email || !password) return "email and password are required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please provide a valid email address";
    return null;
}

function validatePantryCreateInput(payload) {
    const ingredientName = String(payload?.ingredientName || "").trim().toLowerCase();
    const quantity = Number(payload?.quantity ?? 1);
    const unit = String(payload?.unit || "unit").trim();
    const category = String(payload?.category || "other").trim();
    const storageLocation = String(payload?.storageLocation || "pantry").trim();
    const purchaseDate = parseDate(payload?.purchaseDate) || new Date();
    const expiryDate = parseDate(payload?.expiryDate);

    if (!ingredientName || !expiryDate) return { error: "ingredientName and valid expiryDate are required" };
    if (!isNonNegativeFiniteNumber(quantity)) return { error: "quantity must be a non-negative number" };
    if (!unit) return { error: "unit is required" };
    if (!PANTRY_CATEGORIES.includes(category)) {
        return { error: `category must be one of: ${PANTRY_CATEGORIES.join(", ")}` };
    }
    if (!PANTRY_STORAGE_LOCATIONS.includes(storageLocation)) {
        return { error: `storageLocation must be one of: ${PANTRY_STORAGE_LOCATIONS.join(", ")}` };
    }

    return { value: { ingredientName, quantity, unit, category, storageLocation, purchaseDate, expiryDate } };
}

function validatePantryPatchInput(payload) {
    const updates = {};

    if (payload?.quantity !== undefined) {
        const quantity = Number(payload.quantity);
        if (!isNonNegativeFiniteNumber(quantity)) return { error: "quantity must be a non-negative number" };
        updates.quantity = quantity;
    }
    if (payload?.unit !== undefined) {
        const unit = String(payload.unit || "unit").trim();
        if (!unit) return { error: "unit cannot be empty" };
        updates.unit = unit;
    }
    if (payload?.category !== undefined) {
        const category = String(payload.category || "other").trim();
        if (!PANTRY_CATEGORIES.includes(category)) {
            return { error: `category must be one of: ${PANTRY_CATEGORIES.join(", ")}` };
        }
        updates.category = category;
    }
    if (payload?.storageLocation !== undefined) {
        const storageLocation = String(payload.storageLocation || "pantry").trim();
        if (!PANTRY_STORAGE_LOCATIONS.includes(storageLocation)) {
            return { error: `storageLocation must be one of: ${PANTRY_STORAGE_LOCATIONS.join(", ")}` };
        }
        updates.storageLocation = storageLocation;
    }
    if (payload?.status !== undefined) {
        const status = String(payload.status || "fresh").trim();
        if (!PANTRY_STATUSES.includes(status)) {
            return { error: `status must be one of: ${PANTRY_STATUSES.join(", ")}` };
        }
        updates.status = status;
    }
    if (payload?.expiryDate !== undefined) {
        const expiryDate = parseDate(payload.expiryDate);
        if (!expiryDate) return { error: "Invalid expiryDate" };
        updates.expiryDate = expiryDate;
        if (payload?.status === undefined) updates.status = computePantryStatus(expiryDate);
    }
    if (Object.keys(updates).length === 0) {
        return { error: "At least one valid field is required for update" };
    }

    return { value: updates };
}

function validateLeftoverCreateInput(payload) {
    const leftoverName = String(payload?.leftoverName || "").trim().toLowerCase();
    const amount = Number(payload?.amount ?? 1);
    const unit = String(payload?.unit || "portion").trim();
    const cookedDate = parseDate(payload?.cookedDate) || new Date();
    const mustUseBy = parseDate(payload?.mustUseBy);
    const notes = String(payload?.notes || "").trim();

    if (!leftoverName || !mustUseBy) return { error: "leftoverName and valid mustUseBy are required" };
    if (!isNonNegativeFiniteNumber(amount)) return { error: "amount must be a non-negative number" };
    if (!unit) return { error: "unit is required" };

    return { value: { leftoverName, amount, unit, cookedDate, mustUseBy, notes } };
}

function validateLeftoverPatchInput(payload) {
    const updates = {};

    if (payload?.amount !== undefined) {
        const amount = Number(payload.amount);
        if (!isNonNegativeFiniteNumber(amount)) return { error: "amount must be a non-negative number" };
        updates.amount = amount;
    }
    if (payload?.unit !== undefined) {
        const unit = String(payload.unit || "portion").trim();
        if (!unit) return { error: "unit cannot be empty" };
        updates.unit = unit;
    }
    if (payload?.notes !== undefined) updates.notes = String(payload.notes || "").trim();
    if (payload?.status !== undefined) {
        const status = String(payload.status || "active").trim();
        if (!LEFTOVER_STATUSES.includes(status)) {
            return { error: `status must be one of: ${LEFTOVER_STATUSES.join(", ")}` };
        }
        updates.status = status;
    }
    if (payload?.usedInRecipeId !== undefined) updates.usedInRecipeId = String(payload.usedInRecipeId || "").trim();
    if (payload?.mustUseBy !== undefined) {
        const mustUseBy = parseDate(payload.mustUseBy);
        if (!mustUseBy) return { error: "Invalid mustUseBy" };
        updates.mustUseBy = mustUseBy;
    }
    if (Object.keys(updates).length === 0) {
        return { error: "At least one valid field is required for update" };
    }

    return { value: updates };
}

function validateWasteLogCreateInput(payload) {
    const ingredientName = String(payload?.ingredientName || "").trim().toLowerCase();
    const quantity = Number(payload?.quantity ?? 1);
    const unit = String(payload?.unit || "unit").trim();
    const reason = String(payload?.reason || "other").trim();
    const estimatedCost = Number(payload?.estimatedCost ?? 0);
    const estimatedWeightGrams = Number(payload?.estimatedWeightGrams ?? 0);
    const date = parseDate(payload?.date) || new Date();

    if (!ingredientName) return { error: "ingredientName is required" };
    if (!isNonNegativeFiniteNumber(quantity)) return { error: "quantity must be a non-negative number" };
    if (!unit) return { error: "unit is required" };
    if (!WASTE_REASONS.includes(reason)) return { error: `reason must be one of: ${WASTE_REASONS.join(", ")}` };
    if (!isNonNegativeFiniteNumber(estimatedCost)) return { error: "estimatedCost must be a non-negative number" };
    if (!isNonNegativeFiniteNumber(estimatedWeightGrams)) {
        return { error: "estimatedWeightGrams must be a non-negative number" };
    }

    return { value: { ingredientName, quantity, unit, reason, estimatedCost, estimatedWeightGrams, date } };
}

async function requireAuth(req, res, next) {
    const token = tokenFromRequest(req);
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const auth = await findSessionUser(token);
    if (!auth) return res.status(401).json({ error: "Invalid or expired token" });

    const { session, user } = auth;
    if (!user) return res.status(401).json({ error: "User not found" });

    req.auth = { user, session, token };
    next();
}

async function findSessionUser(token) {
    const session = await Session.findOne({ token });
    if (!session) return null;

    const user = await User.findById(session.userId);
    if (!user) return { session, user: null };

    return { session, user };
}

async function getOptionalAuthUser(req) {
    const token = tokenFromRequest(req);
    if (!token) return null;

    const auth = await findSessionUser(token);
    return auth?.user || null;
}

async function createSession(user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Session.create({ token, userId: user._id, email: user.email, expiresAt });
    return token;
}

function getObjectIdParam(req, res, key = "itemId") {
    const value = String(req.params[key] || "").trim();
    if (!mongoose.isValidObjectId(value)) {
        res.status(400).json({ error: `Invalid ${key}` });
        return null;
    }
    return value;
}

async function updateOwnedDoc(Model, userId, itemId, updates, options = {}) {
    return Model.findOneAndUpdate(
        { _id: itemId, userId },
        updates,
        { returnDocument: "after", runValidators: true, ...options }
    );
}

function deleteOwnedDoc(Model, userId, itemId) {
    return Model.deleteOne({ _id: itemId, userId });
}

async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

registerUserRoutes(app, {
    loginRateLimiter: createRateLimiter(10, 15 * 60 * 1000),   // 10 attempts / 15 min
    signupRateLimiter: createRateLimiter(15, 15 * 60 * 1000),  // 15 attempts / 15 min
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
    tokenFromRequest,
    findSessionUser,
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
});

app.use(express.static(path.join(__dirname, "public")));

registerRecipeRoutes(app, {
    getCache,
    setCache,
    SearchAnalytics,
    PantryItem,
    Leftover,
    getOptionalAuthUser,
    tokenFromRequest,
    boolFromQuery,
});

app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API route not found" });
    }

    return next();
});

app.use((err, req, res, _next) => {
    console.error("Unhandled error:", err);

    const statusCode = Number.isInteger(err?.statusCode)
        ? err.statusCode
        : Number.isInteger(err?.status)
            ? err.status
            : 500;

    const message = statusCode >= 500 ? "Internal server error" : (err?.message || "Request failed");
    return res.status(statusCode).json({ error: message });
});

async function startServer() {
    await connectToDatabase();
    return app.listen(PORT, () => {
        console.log(`PantryPal running at http://localhost:${PORT}`);
    });
}

if (require.main === module) {
    startServer().catch((err) => {
        console.error("Failed to connect to MongoDB", err.message);
        process.exit(1);
    });
}

module.exports = {
    app,
    startServer,
    connectToDatabase,
};
async function loadMetadata() {
    try {
        const data = await fetchJson("/api/metadata");

        if (areaSelect) {
            areaSelect.innerHTML =
                "<option value=\"\">Any</option>" +
                (data.areas || []).map((a) => `<option value="${a}">${a}</option>`).join("");
        }

        if (categorySelect) {
            categorySelect.innerHTML =
                "<option value=\"\">Any</option>" +
                (data.categories || []).map((c) => `<option value="${c}">${c}</option>`).join("");
        }
    } catch (err) {
        setDebug({ error: "Failed to load metadata", details: err.message });
        showToast("Could not load filter options");
    }
}

function isFavorited(recipeId) {
    return favoritesCache.some((r) => String(r.idMeal) === String(recipeId));
}

function updateHeartIcons() {
    document.querySelectorAll("[data-heart]").forEach((el) => {
        const id = el.getAttribute("data-heart");
        const fav = isFavorited(id);
        el.classList.toggle("favorited", fav);
        el.textContent = fav ? "Saved" : "Save";
    });
}

function fetchAuthedJson(url, options = {}) {
    return fetchJson(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...authHeaders(),
        },
    });
}

function sendAuthedJson(url, method, body) {
    return fetchAuthedJson(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

function deleteAuthed(url) {
    return fetchAuthedJson(url, { method: "DELETE" });
}

async function refreshAuthedCollection({ enabled = isLoggedIn(), url, select, assign, onError, render }) {
    if (!enabled) {
        assign([]);
        render();
        return;
    }

    try {
        const data = await fetchAuthedJson(url);
        assign(select(data));
    } catch (err) {
        assign([]);
        if (onError) onError(err);
    }

    render();
}

function renderListState(element, items, emptyMessage, renderItem) {
    if (!element) return;
    if (!items.length) {
        element.innerHTML = `<p class="muted-copy">${emptyMessage}</p>`;
        return;
    }

    element.innerHTML = items.map(renderItem).join("");
}

function setText(element, value) {
    if (element) element.textContent = value;
}

function resetImpactSummaryState(message = "") {
    if (!impactSummary) return;
    impactSummary.innerHTML = message;
    if (impactStrip) impactStrip.classList.add("hidden");
    if (impactDashboard) impactDashboard.classList.add("hidden");
    setText(impactWasteEntries, "0");
    setText(impactTopReason, "N/A");
    setText(impactSoonExpiring, "0");
    setText(impactActiveLeftovers, "0");
    setText(sideExpiringCount, "0");
    setText(sideLeftoverCount, "0");
    setText(sideWasteReduction, "0%");
}

function getTopWasteReason(items) {
    if (!items || !items.length) return "N/A";

    const counts = {};

    for (const item of items) {
        const reason = item.reason || "other";
        counts[reason] = (counts[reason] || 0) + 1;
    }

    let topReason = "N/A";
    let topCount = 0;

    for (const [reason, count] of Object.entries(counts)) {
        if (count > topCount) {
            topReason = reason;
            topCount = count;
        }
    }

    return topReason.replaceAll("_", " ");
}

function formatDateText(value) {
    if (!value) return "N/A";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString();
}

function formatDaysLeft(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = Math.round((target.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000));

    if (diff < 0) return "Expired";
    if (diff === 0) return "Expires today";
    return `${diff} day(s) left`;
}

async function refreshFavorites() {
    await refreshAuthedCollection({
        url: "/api/user/favorites",
        select: (data) => data.favorites || [],
        assign: (items) => {
            favoritesCache = items;
        },
        onError: (err) => setDebug({ error: "Failed to load favorites", details: err.message }),
        render: () => {
            renderFavorites();
            updateHeartIcons();
        },
    });
}

async function toggleFavorite(recipe) {
    if (!isLoggedIn()) {
        openAuthModal("login");
        return;
    }

    const favored = isFavorited(recipe.idMeal);

    try {
        if (favored) {
            await deleteAuthed(`/api/user/favorites/${encodeURIComponent(recipe.idMeal)}`);
            showToast("Removed from favorites");
        } else {
            await sendAuthedJson("/api/user/favorites", "POST", { recipe });
            showToast("Saved recipe to favorites");
        }
    } catch (err) {
        showToast(err.message);
    }

    await refreshFavorites();
}

function renderFavorites() {
    if (!favoritesList) return;

    favoritesList.innerHTML = "";

    if (!favoritesCache.length) {
        favoritesList.innerHTML = '<p class="muted-copy">No saved recipes yet.</p>';
        return;
    }

    favoritesList.classList.add("favorites-grid");

    for (const recipe of favoritesCache) {
        const item = document.createElement("div");
        const totalIngredients = (recipe.usedCount || 0) + (recipe.missingCount || 0);
        const matchPercent = totalIngredients > 0
            ? Math.round(((recipe.usedCount || 0) / totalIngredients) * 100)
            : 0;

        item.className = "favorite-item favorite-mini-card";
        item.innerHTML = `
            <img src="${escapeHtml(recipe.strMealThumb)}" alt="${escapeHtml(recipe.strMeal)}" class="favorite-thumb favorite-thumb-large" />
            <div class="favorite-content favorite-content-compact">
                <b title="${escapeHtml(recipe.strMeal)}">${escapeHtml(recipe.strMeal)}</b>
                <p>${matchPercent}% match · Missing ${recipe.missingCount || 0}</p>
            </div>
            <div class="favorite-actions">
                <button class="ghost" data-view-favorite="${escapeHtml(recipe.idMeal)}">View</button>
                <button class="ghost" data-remove-favorite="${escapeHtml(recipe.idMeal)}">Remove</button>
            </div>
        `;
        favoritesList.appendChild(item);
    }
}

async function refreshShoppingList() {
    await refreshAuthedCollection({
        url: "/api/user/shopping-list",
        select: (data) => data.items || [],
        assign: (items) => {
            shoppingListCache = items;
        },
        onError: (err) => setDebug({ error: "Failed to load shopping list", details: err.message }),
        render: () => {
            renderShoppingList();
            updateShoppingBadge();
        },
    });
}

function renderShoppingList() {
    if (!shoppingListEl) return;

    shoppingListEl.innerHTML = "";

    if (!shoppingListCache.length) {
        shoppingListEl.innerHTML = '<p class="muted-copy">Your shopping list is empty.</p>';
        return;
    }

    const groups = new Map();
    for (const item of shoppingListCache) {
        const key = item.recipeId || "";
        if (!groups.has(key)) {
            groups.set(key, { recipeName: item.recipeName || "General", items: [] });
        }
        groups.get(key).items.push(item);
    }

    for (const [recipeId, group] of groups) {
        const section = document.createElement("div");
        section.className = "shopping-group";

        const header = document.createElement("div");
        header.className = "shopping-group-header";
        header.innerHTML = `
            <span class="shopping-group-label">For: ${escapeHtml(group.recipeName)}</span>
            <button class="secondary shopping-group-clear" data-clear-group="${escapeHtml(recipeId)}" title="Remove all items for this recipe">Clear</button>
        `;
        section.appendChild(header);

        const itemsEl = document.createElement("div");
        itemsEl.className = "shopping-group-items";

        for (const item of group.items) {
            const row = document.createElement("div");
            row.className = "list-item" + (item.bought ? " bought" : "");
            row.innerHTML = `
                <div class="left" data-toggle="${escapeHtml(item.id)}">
                    <span class="item-text">${escapeHtml(item.name)}</span>
                </div>
                <button class="secondary" data-remove="${escapeHtml(item.id)}">×</button>
            `;
            itemsEl.appendChild(row);
        }

        section.appendChild(itemsEl);
        shoppingListEl.appendChild(section);
    }
    updateShoppingBadge();
}

async function addItemsToShoppingList(itemsToAdd, recipe = null) {
    if (!isLoggedIn()) {
        openAuthModal("login");
        return;
    }

    const names = itemsToAdd
        .map((name) => String(name || "").trim().toLowerCase())
        .filter(Boolean);

    if (!names.length) {
        showToast("No valid items to add");
        return;
    }

    const recipeId = recipe ? String(recipe.idMeal || "") : "";
    const recipeName = recipe ? String(recipe.strMeal || "") : "";

    try {
        const data = await sendAuthedJson("/api/user/shopping-list/bulk", "POST", {
            items: names,
            recipeId,
            recipeName,
        });

        await refreshShoppingList();
        showToast(data.addedCount > 0 ? `Added ${data.addedCount} item(s)` : "No new items to add");
    } catch (err) {
        showToast(err.message);
    }
}

async function removeRecipeGroup(recipeId) {
    try {
        await deleteAuthed(`/api/user/shopping-list/recipe/${encodeURIComponent(recipeId)}`);
        await refreshShoppingList();
        showToast("Removed recipe items");
    } catch (err) {
        showToast(err.message);
    }
}

async function toggleBought(itemId) {
    const item = shoppingListCache.find((x) => String(x.id) === String(itemId));
    if (!item) return;

    try {
        await sendAuthedJson(`/api/user/shopping-list/${encodeURIComponent(itemId)}`, "PATCH", {
            bought: !item.bought,
        });
        await refreshShoppingList();
    } catch (err) {
        showToast(err.message);
    }
}

async function removeItem(itemId) {
    try {
        await deleteAuthed(`/api/user/shopping-list/${encodeURIComponent(itemId)}`);
        await refreshShoppingList();
        showToast("Removed item");
    } catch (err) {
        showToast(err.message);
    }
}

async function clearShoppingList() {
    try {
        await deleteAuthed("/api/user/shopping-list");
        await refreshShoppingList();
        showToast("Shopping list cleared");
    } catch (err) {
        showToast(err.message);
    }
}

async function refreshPantry() {
    await refreshAuthedCollection({
        url: "/api/user/pantry",
        select: (data) => data.items || [],
        assign: (items) => {
            pantryCache = items;
        },
        onError: (err) => setDebug({ error: "Failed to load pantry", details: err.message }),
        render: renderPantry,
    });
    await refreshSoonExpiringAlert();
}

function renderPantry() {
    renderListState(pantryList, pantryCache, "No pantry items yet.", (item) => {
        const statusText = {
            soon_expiring: "Soon Expiring",
            expired: "Expired",
            used: "Used",
        }[item.status] || "Fresh";

        return `
            <div class="list-item stacked ${escapeHtml(item.status)}">
                <div class="left">
                    <span class="item-text">${escapeHtml(item.ingredientName)} (${escapeHtml(item.quantity)} ${escapeHtml(item.unit || "unit")})</span>
                    <small>${escapeHtml(statusText)} · Expires ${escapeHtml(formatDateText(item.expiryDate))} · ${escapeHtml(formatDaysLeft(item.expiryDate))}</small>
                </div>
                <button class="secondary" data-remove-pantry="${escapeHtml(item.id)}">×</button>
            </div>
        `;
    });
}

async function refreshSoonExpiringAlert() {
    if (!soonExpiringAlert) return;
    if (!isLoggedIn()) {
        soonExpiringAlert.textContent = "";
        return;
    }

    try {
        const data = await fetchAuthedJson("/api/user/pantry/soon-expiring?days=3");
        if (!data.count) {
            soonExpiringAlert.textContent = "No items expiring in the next 3 days.";
            return;
        }
        soonExpiringAlert.textContent = `${data.count} ingredient(s) expiring soon. Turn on Expiry First to prioritize them.`;
    } catch {
        soonExpiringAlert.textContent = "";
    }
}

async function createPantryItem(payload) {
    await sendAuthedJson("/api/user/pantry", "POST", payload);
    await refreshPantry();
}

async function removePantryItem(itemId) {
    await deleteAuthed(`/api/user/pantry/${encodeURIComponent(itemId)}`);
    await refreshPantry();
}

async function refreshLeftovers() {
    await refreshAuthedCollection({
        url: "/api/user/leftovers",
        select: (data) => data.items || [],
        assign: (items) => {
            leftoversCache = items;
        },
        onError: (err) => setDebug({ error: "Failed to load leftovers", details: err.message }),
        render: renderLeftovers,
    });
}

function renderLeftovers() {
    renderListState(leftoverList, leftoversCache, "No active leftovers yet.", (item) => `
            <div class="list-item stacked">
                <div class="left">
                    <span class="item-text">${escapeHtml(item.leftoverName)} (${escapeHtml(item.amount)} ${escapeHtml(item.unit || "portion")})</span>
                    <small>Use by ${escapeHtml(formatDateText(item.mustUseBy))} · ${escapeHtml(item.status)}</small>
                </div>
                <button class="secondary" data-remove-leftover="${escapeHtml(item.id)}">×</button>
            </div>
        `);
}

async function createLeftover(payload) {
    await sendAuthedJson("/api/user/leftovers", "POST", payload);
    await refreshLeftovers();
}

async function removeLeftover(itemId) {
    await deleteAuthed(`/api/user/leftovers/${encodeURIComponent(itemId)}`);
    await refreshLeftovers();
}

async function refreshWasteLogs() {
    await refreshAuthedCollection({
        url: "/api/user/waste-logs",
        select: (data) => data.items || [],
        assign: (items) => {
            wasteLogsCache = items;
        },
        onError: (err) => setDebug({ error: "Failed to load waste logs", details: err.message }),
        render: renderWasteLogs,
    });
}

function renderWasteLogs() {
    renderListState(wasteList, wasteLogsCache.slice(0, 10), "No waste logs yet.", (item) => `
            <div class="list-item stacked">
                <div class="left">
                    <span class="item-text">${escapeHtml(item.ingredientName)} · ${escapeHtml(item.estimatedWeightGrams || 0)}g</span>
                    <small>${escapeHtml(item.reason)} · ${escapeHtml(formatDateText(item.date))} · Cost ${escapeHtml(Number(item.estimatedCost || 0).toFixed(2))}</small>
                </div>
            </div>
        `);
}

async function createWasteLog(payload) {
    await sendAuthedJson("/api/user/waste-logs", "POST", payload);
    await Promise.all([refreshWasteLogs(), refreshImpactSummary()]);
}

async function refreshImpactSummary() {
    if (!impactSummary) return;
    if (!isLoggedIn()) {
        resetImpactSummaryState("");
        return;
    }

    try {
        const data = await fetchAuthedJson("/api/user/metrics/impact");
        const [wasteData, expiringData, leftoverData] = await Promise.all([
            fetchAuthedJson("/api/user/waste-logs"),
            fetchAuthedJson("/api/user/pantry/soon-expiring?days=3"),
            fetchAuthedJson("/api/user/leftovers"),
        ]);

        const wasteItems = wasteData.items || [];
        const expiringItems = expiringData.items || [];
        const activeLeftovers = (leftoverData.items || []).filter(
            (item) => item.status === "active"
        );

        impactSummary.innerHTML = `
            <div class="impact-grid">
                <div class="impact-card">
                    <strong>${data.progress?.weightReductionPercent ?? 0}%</strong>
                    <span>Waste Reduction</span>
                </div>
                <div class="impact-card">
                    <strong>${data.progress?.costReductionPercent ?? 0}%</strong>
                    <span>Cost Reduction</span>
                </div>
                <div class="impact-card">
                    <strong>${data.progress?.co2eAvoidedKg ?? 0} kg</strong>
                    <span>CO2e Avoided</span>
                </div>
            </div>
            <p class="hint">Live: ${data.live?.soonExpiringCount ?? 0} expiring items, ${data.live?.activeLeftoversCount ?? 0} active leftovers</p>
        `;

        if (impactStrip) impactStrip.classList.remove("hidden");
        setText(impactWasteReduction, `${data.progress?.weightReductionPercent ?? 0}%`);
        setText(impactCostReduction, `${data.progress?.costReductionPercent ?? 0}%`);
        setText(impactCo2, `${data.progress?.co2eAvoidedKg ?? 0} kg`);
        if (impactLive) {
            impactLive.textContent = `${data.live?.soonExpiringCount ?? 0} expiring, ${data.live?.activeLeftoversCount ?? 0} leftovers`;
        }
        if (impactDashboard) impactDashboard.classList.remove("hidden");
        setText(impactWasteEntries, String(wasteItems.length));
        setText(impactTopReason, getTopWasteReason(wasteItems));
        setText(impactSoonExpiring, String(expiringItems.length));
        setText(impactActiveLeftovers, String(activeLeftovers.length));
        setText(sideExpiringCount, String(data.live?.soonExpiringCount ?? 0));
        setText(sideLeftoverCount, String(data.live?.activeLeftoversCount ?? 0));
        setText(sideWasteReduction, `${data.progress?.weightReductionPercent ?? 0}%`);
    } catch {
        resetImpactSummaryState('<p class="muted-copy">Impact metrics unavailable right now.</p>');
    }
}

// ── Meal Plan CRUD ───────────────────────────────────────────

let mealPlanCache = [];
let mealPlanWeekOffset = 0;

function getMealPlanWeekStart(offset) {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1 + offset * 7); // Monday
    return d.toISOString().slice(0, 10);
}

async function refreshMealPlan() {
    const weekStart = getMealPlanWeekStart(mealPlanWeekOffset);
    try {
        const data = await fetchAuthedJson(`/api/user/meal-plan?weekStart=${weekStart}`);
        mealPlanCache = data.items || [];
    } catch {
        mealPlanCache = [];
    }
    renderMealPlanGrid();
}

function renderMealPlanGrid() {
    const grid = document.getElementById("mealPlanGrid");
    const label = document.getElementById("mealPlanWeekLabel");
    if (!grid) return;

    const weekStart = getMealPlanWeekStart(mealPlanWeekOffset);
    if (label) label.textContent = `Week of ${weekStart}`;

    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    grid.innerHTML = days.map((day, i) => {
        const entries = mealPlanCache.filter((e) => e.day === day);
        const recipesHtml = entries.map((e) => `
            <div class="meal-plan-recipe">
                <div>
                    <span class="mp-slot">${escapeHtml(e.slot)}</span>
                    ${escapeHtml(e.recipe?.strMeal || e.recipeId)}
                </div>
                <button class="mp-remove" data-mp-remove="${escapeHtml(e.id)}" title="Remove">&times;</button>
            </div>
        `).join("");

        return `
            <div class="meal-plan-day">
                <h4>${dayLabels[i]}</h4>
                ${recipesHtml}
            </div>
        `;
    }).join("");
}

async function addToMealPlan(recipe, day, slot) {
    const weekStart = getMealPlanWeekStart(mealPlanWeekOffset);
    try {
        await sendAuthedJson("/api/user/meal-plan", "POST", {
            weekStart, day, slot, recipe,
        });
        showToast(`Added to ${day} ${slot}`);
        await refreshMealPlan();
    } catch (err) {
        showToast(err.message || "Failed to add to meal plan");
    }
}

async function removeMealPlanEntry(itemId) {
    try {
        await deleteAuthed(`/api/user/meal-plan/${encodeURIComponent(itemId)}`);
        await refreshMealPlan();
    } catch (err) {
        showToast(err.message);
    }
}

async function generateMealPlanShoppingList() {
    const weekStart = getMealPlanWeekStart(mealPlanWeekOffset);
    try {
        const data = await fetchAuthedJson(`/api/user/meal-plan/shopping-list?weekStart=${weekStart}`);
        if (data.items && data.items.length > 0) {
            await addItemsToShoppingList(data.items);
            showToast(`Added ${data.count} items from meal plan`);
        } else {
            showToast("No missing ingredients to add");
        }
    } catch (err) {
        showToast(err.message || "Failed to generate shopping list");
    }
}

// ── Cook Log CRUD ────────────────────────────────────────────

let cookLogCache = [];

async function refreshCookLog() {
    try {
        const data = await fetchAuthedJson("/api/user/cook-log");
        cookLogCache = data.items || [];
    } catch {
        cookLogCache = [];
    }
    renderCookLog();
}

function renderCookLog() {
    const el = document.getElementById("cookLogList");
    renderListState(el, cookLogCache.slice(0, 10), "No cook history yet.", (item) => {
        const name = item.recipe?.strMeal || item.recipeId;
        const date = formatDateText(item.cookedAt);
        return `
            <div class="cook-log-entry">
                <div>
                    <span>${escapeHtml(name)}</span>
                    <span class="cook-date">${escapeHtml(date)}</span>
                </div>
                <button class="cook-view-btn" data-cook-view="${escapeHtml(item.recipeId)}">View</button>
            </div>
        `;
    });
}

async function logCook(recipe, deductIngredients) {
    try {
        await sendAuthedJson("/api/user/cook-log", "POST", {
            recipeId: recipe.idMeal,
            recipe,
            deductIngredients,
        });
        showToast(deductIngredients ? "Logged cook & deducted pantry" : "Cook logged!");
        await refreshCookLog();
        if (deductIngredients) await refreshPantry();
    } catch (err) {
        showToast(err.message || "Failed to log cook");
    }
}

// ── Feedback Survey ──────────────────────────────────────────

async function submitFeedback(responses) {
    try {
        await sendAuthedJson("/api/user/feedback", "POST", { responses });
        showToast("Thanks for your feedback!");
        return true;
    } catch (err) {
        showToast(err.message || "Failed to submit feedback");
        return false;
    }
}

// ── Pantry-to-Shopping Sync ──────────────────────────────────

async function removePantryItemWithSync(itemId) {
    const item = pantryCache.find((x) => String(x.id) === String(itemId));
    await removePantryItem(itemId);
    if (item) {
        showActionToast(
            `Add "${item.ingredientName}" to shopping list?`,
            [
                { label: "Yes", action: () => addItemsToShoppingList([item.ingredientName]) },
                { label: "No", className: "ghost-action" },
            ]
        );
    }
}
/* PantryPal frontend */

function escapeHtml(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(String(str ?? "")));
    return div.innerHTML;
}

const btn = document.getElementById("btn");
const healthBtn = document.getElementById("healthBtn");
const input = document.getElementById("ingredients");
const recipeNameInput = document.getElementById("recipeName");
const cards = document.getElementById("cards");
const debug = document.getElementById("debug");
const publicHome = document.getElementById("publicHome");
const appShell = document.getElementById("appShell");
const recipeResultsSection = document.getElementById("recipeResultsSection");

const toggleSortBtn = document.getElementById("toggleSortBtn");
const toggleFilterBtn = document.getElementById("toggleFilterBtn");
const sortPanel = document.getElementById("sortPanel");
const filterPanel = document.getElementById("filterPanel");
const filterBadge = document.getElementById("filterBadge");

const favoritesBtn = document.getElementById("favoritesBtn");
const favoritesPanel = document.getElementById("favoritesPanel");
const favoritesList = document.getElementById("favoritesList");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const clearFiltersResultsBtn = document.getElementById("clearFiltersResultsBtn");
const quickOptions = document.getElementById("quickOptions");
const logoutBtn = document.getElementById("logoutBtn");

const areaSelect = document.getElementById("areaSelect");
const categorySelect = document.getElementById("categorySelect");
const mealTypeSelect = document.getElementById("mealTypeSelect");
const dietarySelect = document.getElementById("dietarySelect");
const seasonalSelect = document.getElementById("seasonalSelect");
const sortSelect = document.getElementById("sortSelect");
const maxMinutesInput = document.getElementById("maxMinutes");

const toast = document.getElementById("toast");
const bannerStrip = document.querySelector(".banner-strip");
const bannerCards = Array.from(document.querySelectorAll(".banner-strip .banner-card"));

const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalImg = document.getElementById("modalImg");
const modalMeta = document.getElementById("modalMeta");
const modalCounts = document.getElementById("modalCounts");
const modalExplainability = document.getElementById("modalExplainability");
const modalUsed = document.getElementById("modalUsed");
const modalMissing = document.getElementById("modalMissing");
const modalInstructions = document.getElementById("modalInstructions");
const modalLinks = document.getElementById("modalLinks");
const modalAddMissing = document.getElementById("modalAddMissing");
const modalHeartBtn = document.getElementById("modalHeartBtn");
const printRecipeBtn = document.getElementById("printRecipeBtn");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const authModal = document.getElementById("authModal");
const closeAuthModal = document.getElementById("closeAuthModal");
const authTabLogin = document.getElementById("authTabLogin");
const authTabSignup = document.getElementById("authTabSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authFeedback = document.getElementById("authFeedback");

const shoppingListEl = document.getElementById("shoppingList");
const clearListBtn = document.getElementById("clearList");
const copyListBtn = document.getElementById("copyList");
const downloadListBtn = document.getElementById("downloadList");
const quickAccessDrawerBtn = document.getElementById("quickAccessDrawerBtn");
const closeQuickAccessDrawer = document.getElementById("closeQuickAccessDrawer");
const quickAccessDrawer = document.getElementById("quickAccessDrawer");
const quickAccessSidebarHost = document.getElementById("quickAccessSidebarHost");
const sidebarPanel = document.querySelector(".sidebar");
const shoppingDrawerBtn = document.getElementById("shoppingDrawerBtn");
const closeShoppingDrawer = document.getElementById("closeShoppingDrawer");
const shoppingDrawer = document.getElementById("shoppingDrawer");
const shoppingBadge = document.getElementById("shoppingBadge");
const demoModeBtn = document.getElementById("demoModeBtn");
const prioritizeExpiryToggle = document.getElementById("prioritizeExpiryToggle");
const rescueModeToggle = document.getElementById("rescueModeToggle");

const pantryForm = document.getElementById("pantryForm");
const pantryIngredientInput = document.getElementById("pantryIngredient");
const pantryQuantityInput = document.getElementById("pantryQuantity");
const pantryUnitInput = document.getElementById("pantryUnit");
const pantryExpiryInput = document.getElementById("pantryExpiry");
const pantryList = document.getElementById("pantryList");
const soonExpiringAlert = document.getElementById("soonExpiringAlert");

const leftoverForm = document.getElementById("leftoverForm");
const leftoverNameInput = document.getElementById("leftoverName");
const leftoverAmountInput = document.getElementById("leftoverAmount");
const leftoverUnitInput = document.getElementById("leftoverUnit");
const leftoverMustUseByInput = document.getElementById("leftoverMustUseBy");
const leftoverList = document.getElementById("leftoverList");

const wasteForm = document.getElementById("wasteForm");
const wasteIngredientInput = document.getElementById("wasteIngredient");
const wasteQuantityInput = document.getElementById("wasteQuantity");
const wasteUnitInput = document.getElementById("wasteUnit");
const wasteWeightInput = document.getElementById("wasteWeight");
const wasteCostInput = document.getElementById("wasteCost");
const wasteReasonSelect = document.getElementById("wasteReason");
const wasteList = document.getElementById("wasteList");
const impactSummary = document.getElementById("impactSummary");
const impactStrip = document.getElementById("impactStrip");
const impactWasteReduction = document.getElementById("impactWasteReduction");
const impactCostReduction = document.getElementById("impactCostReduction");
const impactCo2 = document.getElementById("impactCo2");
const impactLive = document.getElementById("impactLive");
const impactDashboard = document.getElementById("impactDashboard");
const impactWasteEntries = document.getElementById("impactWasteEntries");
const impactTopReason = document.getElementById("impactTopReason");
const impactSoonExpiring = document.getElementById("impactSoonExpiring");
const impactActiveLeftovers = document.getElementById("impactActiveLeftovers");
const featuredWastePicks = document.getElementById("featuredWastePicks");
const featuredWasteGrid = document.getElementById("featuredWasteGrid");
const latestWasteSection = document.getElementById("latestWasteSection");
const latestWasteGrid = document.getElementById("latestWasteGrid");
const popularWeekSection = document.getElementById("popularWeekSection");
const popularWeekGrid = document.getElementById("popularWeekGrid");
const sectionRailLinks = Array.from(document.querySelectorAll(".section-rail-link"));
const sideExpiringCount = document.getElementById("sideExpiringCount");
const sideLeftoverCount = document.getElementById("sideLeftoverCount");
const sideWasteReduction = document.getElementById("sideWasteReduction");
const runRescueSearchBtn = document.getElementById("runRescueSearchBtn");

function guardSidebarNumericDateInputs(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    const inSidebarForms = target.closest("#pantryForm, #leftoverForm, #wasteForm");
    if (!inSidebarForms) return;

    if (target.type !== "date" && target.type !== "number") return;

    // Prevent accidental value changes from keypad directional keys.
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(event.key)) {
        event.preventDefault();
    }
}

document.addEventListener("keydown", guardSidebarNumericDateInputs);

function openShoppingDrawer() {
    if (!shoppingDrawer) return;
    shoppingDrawer.classList.remove("hidden");
    shoppingDrawer.setAttribute("aria-hidden", "false");
}

function closeShoppingDrawerFn() {
    if (!shoppingDrawer) return;
    shoppingDrawer.classList.add("hidden");
    shoppingDrawer.setAttribute("aria-hidden", "true");
}

function updateShoppingBadge() {
    if (!shoppingBadge) return;
    const total = shoppingListCache.length;
    shoppingBadge.textContent = total;
    shoppingBadge.classList.toggle("hidden", total === 0);
}

function openQuickAccessDrawer() {
    if (!quickAccessDrawer) return;
    quickAccessDrawer.classList.remove("hidden");
    quickAccessDrawer.setAttribute("aria-hidden", "false");
}

function closeQuickAccessDrawerFn() {
    if (!quickAccessDrawer) return;
    quickAccessDrawer.classList.add("hidden");
    quickAccessDrawer.setAttribute("aria-hidden", "true");
}

function mountSidebarInQuickAccessDrawer() {
    if (!quickAccessSidebarHost || !sidebarPanel) return;
    if (quickAccessSidebarHost.contains(sidebarPanel)) return;
    quickAccessSidebarHost.appendChild(sidebarPanel);
}

const SESSION_KEY = "pantrypal_session_v1";
const LEGACY_FAVORITES_KEY = "pantrypal_favorites_v1";
const LEGACY_SHOPPING_KEY = "pantrypal_shopping_list_v1";
const MIGRATION_FLAG_PREFIX = "pantrypal_migrated_v1_";
const RECENTLY_VIEWED_KEY = "pantrypal_recently_viewed_v1";
const THEME_KEY = "pantrypal_theme_v1";
const ONBOARDING_KEY = "pantrypal_onboarding_done_v1";
const FEATURE_FLAGS_KEY = "pantrypal_feature_flags_v1";
const SEARCH_COUNT_KEY = "pantrypal_search_count_v1";
const SURVEY_DONE_KEY = "pantrypal_survey_completed_v1";

let latestResultsById = {};
let modalCurrentRecipeId = null;
let latestResults = [];
let metadataLoaded = false;
let favoritesCache = [];
let shoppingListCache = [];
let recentlyViewedCache = [];
let bannerRotationTimer = null;
let bannerCursor = 0;
let currentRecipeInModal = null;
let currentServings = 4;
let pantryCache = [];
let leftoversCache = [];
let wasteLogsCache = [];

const featuredBannerRecipes = [
    {
        kicker: "Featured Recipe",
        title: "One-Pan Chicken Jambalaya",
        recipeName: "Jambalaya",
        subtitle: "Bold spice, minimal prep, perfect for quick dinners.",
        info: ["35 min", "Medium", "Cajun"],
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1500&q=80",
    },
    {
        kicker: "Easy Recipes",
        title: "Air Fryer Favorites",
        recipeName: "Kumpir",
        subtitle: "Crisp textures and quick cleanup for busy weeknights.",
        info: ["20 min", "Easy", "Family"],
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
    },
    {
        kicker: "Trending",
        title: "Breakfast And Brunch",
        recipeName: "Breakfast Potatoes",
        subtitle: "Comfort classics and bright starts to power your day.",
        info: ["25 min", "Beginner", "Weekend"],
        image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80",
    },
    {
        kicker: "Seasonal Pick",
        title: "Roasted Vegetable Pasta",
        recipeName: "Pasta Pomodoro",
        subtitle: "A colorful bowl with caramelized depth and herby finish.",
        info: ["30 min", "Vegetarian", "Spring"],
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1500&q=80",
    },
    {
        kicker: "Popular",
        title: "Slow-Cooked Beef Stew",
        recipeName: "Beef and Mustard Pie",
        subtitle: "Tender beef, rich broth, and cozy flavors in every bite.",
        info: ["90 min", "Comfort", "Winter"],
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1500&q=80",
    },
    {
        kicker: "Dessert",
        title: "Chocolate Berry Tart",
        recipeName: "Chocolate Gateau",
        subtitle: "Silky chocolate and fresh berries for a polished finish.",
        info: ["40 min", "Party", "Sweet"],
        image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1500&q=80",
    },
];

function setDebug(obj) {
    if (!debug) return;
    debug.textContent = JSON.stringify(obj, null, 2);
}

function setRecipeSectionVisible(visible) {
    if (!recipeResultsSection) return;
    recipeResultsSection.classList.toggle("hidden", !visible);
}

function hasActiveSearchCriteria() {
    return Boolean(
        input?.value?.trim() ||
        areaSelect?.value ||
        categorySelect?.value ||
        mealTypeSelect?.value ||
        dietarySelect?.value ||
        seasonalSelect?.value ||
        recipeNameInput?.value?.trim() ||
        maxMinutesInput?.value ||
        rescueModeToggle?.checked ||
        prioritizeExpiryToggle?.checked
    );
}

function clearRecipeResultsAndHide() {
    latestResults = [];
    latestResultsById = {};
    if (cards) cards.innerHTML = "";
    if (featuredWastePicks) featuredWastePicks.classList.add("hidden");
    if (featuredWasteGrid) featuredWasteGrid.innerHTML = "";
    if (latestWasteSection) latestWasteSection.classList.add("hidden");
    if (latestWasteGrid) latestWasteGrid.innerHTML = "";
    if (popularWeekSection) popularWeekSection.classList.add("hidden");
    if (popularWeekGrid) popularWeekGrid.innerHTML = "";
    setRecipeSectionVisible(false);
}

function updateActiveRailLink(activeId) {
    if (!sectionRailLinks.length) return;

    for (const link of sectionRailLinks) {
        link.classList.toggle("is-active", link.dataset.railTarget === activeId);
    }
}

function setupSectionRail() {
    if (!sectionRailLinks.length) return;

    for (const link of sectionRailLinks) {
        link.addEventListener("click", () => {
            updateActiveRailLink(link.dataset.railTarget);
            closeQuickAccessDrawerFn();
        });
    }

    const targets = sectionRailLinks
        .map((link) => document.getElementById(link.dataset.railTarget))
        .filter(Boolean);

    if (!targets.length || !("IntersectionObserver" in window)) {
        updateActiveRailLink(sectionRailLinks[0].dataset.railTarget);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visibleEntries.length) {
                updateActiveRailLink(visibleEntries[0].target.id);
            }
        },
        {
            rootMargin: "-12% 0px -60% 0px",
            threshold: [0.2, 0.45, 0.7],
        }
    );

    for (const target of targets) observer.observe(target);
    updateActiveRailLink(targets[0].id);
}

let toastTimer = null;
function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("hidden");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add("hidden"), 2200);
}

function showActionToast(message, actions) {
    if (!toast) return;
    const btnsHtml = actions.map((a) =>
        `<button class="toast-action-btn ${a.className || ""}" data-toast-action="${escapeHtml(a.label)}">${escapeHtml(a.label)}</button>`
    ).join("");
    toast.innerHTML = `${escapeHtml(message)}<span class="toast-actions">${btnsHtml}</span>`;
    toast.classList.remove("hidden");

    const handler = (e) => {
        const btn = e.target.closest("[data-toast-action]");
        if (!btn) return;
        const act = actions.find((a) => a.label === btn.dataset.toastAction);
        if (act?.action) act.action();
        toast.classList.add("hidden");
        toast.removeEventListener("click", handler);
    };
    toast.addEventListener("click", handler);

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.add("hidden");
        toast.removeEventListener("click", handler);
    }, 5000);
}

function bannerWindow(start, size) {
    const result = [];
    const total = featuredBannerRecipes.length;
    if (!total || size <= 0) return result;

    for (let i = 0; i < size; i += 1) {
        result.push(featuredBannerRecipes[(start + i) % total]);
    }

    return result;
}

function renderBannerCard(card, banner, useLargeHeading) {
    if (!card || !banner) return;

    card.style.backgroundImage = `url('${banner.image}')`;
    card.dataset.recipeName = banner.recipeName || banner.title;
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Open recipe: ${banner.title}`);

    const headingTag = useLargeHeading ? "h2" : "h3";
    const infoBadges = (banner.info || [])
        .map((item) => `<span>${item}</span>`)
        .join("");

    card.innerHTML = `
        <div class="banner-content">
            <p class="hero-kicker">${banner.kicker}</p>
            <${headingTag}>${banner.title}</${headingTag}>
            <p>${banner.subtitle}</p>
            <div class="banner-info">${infoBadges}</div>
            <button class="banner-cta" type="button">View Recipe</button>
        </div>
    `;

    card.classList.remove("is-refreshing");
    requestAnimationFrame(() => card.classList.add("is-refreshing"));
}

async function openFeaturedRecipeByName(recipeName) {
    const name = String(recipeName || "").trim();
    if (!name) {
        showToast("Recipe details unavailable");
        return;
    }

    try {
        const data = await fetchJson(`/api/recipe?name=${encodeURIComponent(name)}`);
        const recipe = data?.recipe;
        if (!recipe) throw new Error("Recipe details unavailable");

        latestResultsById[recipe.idMeal] = recipe;
        openModal(recipe);
    } catch (err) {
        showToast(err.message || "Could not open recipe");
    }
}

function renderRotatingBanners() {
    if (!bannerCards.length || !featuredBannerRecipes.length) return;

    const current = bannerWindow(bannerCursor, bannerCards.length);
    bannerCards.forEach((card, idx) => {
        renderBannerCard(card, current[idx], idx === 0);
    });
}

function startPublicBannerRotation() {
    if (!bannerCards.length) return;

    renderRotatingBanners();

    if (featuredBannerRecipes.length <= bannerCards.length) return;

    if (bannerRotationTimer) clearInterval(bannerRotationTimer);
    bannerRotationTimer = setInterval(() => {
        bannerCursor = (bannerCursor + 1) % featuredBannerRecipes.length;
        renderRotatingBanners();
    }, 6000);
}

function normalize(s) {
    return String(s || "").toLowerCase().trim();
}

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
        return null;
    }
}

function setSession(data) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

function isLoggedIn() {
    const session = getSession();
    return Boolean(session && session.token);
}

function authHeaders() {
    const session = getSession();
    if (!session?.token) return {};
    return { Authorization: `Bearer ${session.token}` };
}

function migrationFlagKey() {
    const session = getSession();
    const userId = session?.user?.id;
    if (!userId) return null;
    return `${MIGRATION_FLAG_PREFIX}${userId}`;
}

function readLegacyArray(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

async function migrateLegacyLocalDataIfNeeded() {
    if (!isLoggedIn()) return;

    const flagKey = migrationFlagKey();
    if (!flagKey) return;
    if (localStorage.getItem(flagKey) === "1") return;

    const legacyFavorites = readLegacyArray(LEGACY_FAVORITES_KEY).filter(
        (r) => r && r.idMeal
    );
    const legacyShopping = readLegacyArray(LEGACY_SHOPPING_KEY).filter(
        (x) => x && x.name
    );

    if (legacyFavorites.length === 0 && legacyShopping.length === 0) {
        localStorage.setItem(flagKey, "1");
        return;
    }

    try {
        for (const recipe of legacyFavorites) {
            await fetchJson("/api/user/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(),
                },
                body: JSON.stringify({ recipe }),
            });
        }

        const names = legacyShopping
            .map((x) => String(x.name || "").trim().toLowerCase())
            .filter(Boolean);

        if (names.length > 0) {
            await fetchJson("/api/user/shopping-list/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(),
                },
                body: JSON.stringify({ items: names }),
            });

            const boughtNames = new Set(
                legacyShopping
                    .filter((x) => Boolean(x.bought))
                    .map((x) => String(x.name || "").trim().toLowerCase())
            );

            if (boughtNames.size > 0) {
                const currentList = await fetchJson("/api/user/shopping-list", {
                    headers: {
                        ...authHeaders(),
                    },
                });

                for (const item of currentList.items || []) {
                    if (!boughtNames.has(String(item.name || "").toLowerCase())) continue;

                    await fetchJson(`/api/user/shopping-list/${encodeURIComponent(item.id)}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            ...authHeaders(),
                        },
                        body: JSON.stringify({ bought: true }),
                    });
                }
            }
        }

        localStorage.setItem(flagKey, "1");
        localStorage.removeItem(LEGACY_FAVORITES_KEY);
        localStorage.removeItem(LEGACY_SHOPPING_KEY);
        showToast("Imported previous local data");
    } catch (err) {
        setDebug({ error: "Legacy migration failed", details: err.message });
    }
}

async function fetchJson(url, options = {}) {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const msg = data?.error || data?.message || `Request failed (${res.status})`;
        throw new Error(msg);
    }

    return data;
}

function shoppingListToText() {
    const groups = new Map();
    for (const item of shoppingListCache) {
        const key = item.recipeName || "General";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
    }
    const lines = [];
    for (const [label, items] of groups) {
        lines.push(`=== ${label} ===`);
        for (const x of items) lines.push(`${x.bought ? "[x]" : "[ ]"} ${x.name}`);
        lines.push("");
    }
    return lines.join("\n").trim();
}

async function copyShoppingList() {
    const text = shoppingListToText();
    if (!text) {
        showToast("Shopping list is empty");
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showToast("Copied shopping list");
    } catch {
        showToast("Copy failed, use download");
    }
}

function downloadShoppingListTxt() {
    const text = shoppingListToText();
    if (!text) {
        showToast("Shopping list is empty");
        return;
    }

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pantrypal-shopping-list.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function renderFeaturedWastePicks(results) {
    if (!featuredWastePicks || !featuredWasteGrid) return;

    if (!results || results.length === 0) {
        featuredWastePicks.classList.add("hidden");
        featuredWasteGrid.innerHTML = "";
        return;
    }

    const top = [...results]
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 3);

    featuredWasteGrid.innerHTML = top
        .map((r) => {
            const matchPercent = Math.round((r.matchRatio || 0) * 100);
            return `
                <article class="featured-pick-card" data-open="${escapeHtml(r.idMeal)}">
                    <img src="${escapeHtml(r.strMealThumb)}" alt="${escapeHtml(r.strMeal)}" />
                    <div class="featured-pick-body">
                        <h4>${escapeHtml(r.strMeal)}</h4>
                        <p>${matchPercent}% match · Missing ${r.missingCount || 0}</p>
                    </div>
                </article>
            `;
        })
        .join("");

    featuredWastePicks.classList.remove("hidden");
}

function renderEditorialCollections(results) {
    if (!latestWasteSection || !latestWasteGrid || !popularWeekSection || !popularWeekGrid) return;

    if (!results || !results.length) {
        latestWasteSection.classList.add("hidden");
        popularWeekSection.classList.add("hidden");
        latestWasteGrid.innerHTML = "";
        popularWeekGrid.innerHTML = "";
        return;
    }

    const latest = [...results]
        .sort((a, b) => {
            const aPriority = (a.expiringUsedCount || 0) + (a.leftoverUsedCount || 0);
            const bPriority = (b.expiringUsedCount || 0) + (b.leftoverUsedCount || 0);
            if (bPriority !== aPriority) return bPriority - aPriority;
            return (b.score || 0) - (a.score || 0);
        })
        .slice(0, 4);

    const popular = [...results]
        .sort((a, b) => {
            if ((b.matchRatio || 0) !== (a.matchRatio || 0)) return (b.matchRatio || 0) - (a.matchRatio || 0);
            return (b.usedCount || 0) - (a.usedCount || 0);
        })
        .slice(0, 4);

    const renderCard = (r) => {
        const matchPercent = Math.round((r.matchRatio || 0) * 100);
        return `
            <article class="editorial-card" data-open="${escapeHtml(r.idMeal)}">
                <img src="${escapeHtml(r.strMealThumb)}" alt="${escapeHtml(r.strMeal)}" />
                <div class="editorial-card-body">
                    <h4>${escapeHtml(r.strMeal)}</h4>
                    <p>${matchPercent}% match · Missing ${r.missingCount || 0}</p>
                </div>
            </article>
        `;
    };

    latestWasteGrid.innerHTML = latest.map(renderCard).join("");
    popularWeekGrid.innerHTML = popular.map(renderCard).join("");
    latestWasteSection.classList.remove("hidden");
    popularWeekSection.classList.remove("hidden");
}

function inferDietary(recipe) {
    const combined = `${recipe.strCategory || ""} ${recipe.strMeal || ""} ${(recipe.missing || []).join(" ")} ${(recipe.used || []).join(" ")}`.toLowerCase();

    if (combined.includes("vegan")) return "vegan";
    if (combined.includes("vegetarian")) return "vegetarian";
    if (combined.includes("gluten")) return "gluten-free";

    if ((recipe.usedCount || 0) >= 3 && (recipe.missingCount || 0) <= 4) return "high-protein";
    if ((recipe.estMinutes || 999) <= 25) return "quick";
    return "";
}

function inferSeason(recipe) {
    const text = `${recipe.strMeal || ""} ${(recipe.used || []).join(" ")} ${(recipe.missing || []).join(" ")}`.toLowerCase();
    if (text.match(/pumpkin|squash|cinnamon|stew/)) return "autumn";
    if (text.match(/turkey|roast|festive|pie/)) return "festive";
    if (text.match(/salad|melon|berries|grill/)) return "summer";
    if (text.match(/soup|potato|lentil|casserole/)) return "winter";
    if (text.match(/asparagus|peas|herb/)) return "spring";
    return "";
}

function applyClientFilters(results) {
    let filtered = [...results];

    const mealType = normalize(mealTypeSelect?.value);
    const dietary = normalize(dietarySelect?.value);
    const seasonal = normalize(seasonalSelect?.value);
    const nameQuery = normalize(recipeNameInput?.value);
    const sortBy = normalize(sortSelect?.value || "score");

    if (mealType) {
        filtered = filtered.filter((r) => normalize(r.strCategory).includes(mealType));
    }

    if (dietary) {
        filtered = filtered.filter((r) => inferDietary(r) === dietary);
    }

    if (seasonal) {
        filtered = filtered.filter((r) => inferSeason(r) === seasonal);
    }

    if (nameQuery) {
        filtered = filtered.filter((r) => normalize(r.strMeal).includes(nameQuery));
    }

    if (sortBy === "time") {
        filtered.sort((a, b) => (a.estMinutes || 999) - (b.estMinutes || 999));
    } else if (sortBy === "ratio") {
        filtered.sort((a, b) => (b.matchRatio || 0) - (a.matchRatio || 0));
    } else if (sortBy === "missing") {
        filtered.sort((a, b) => (a.missingCount || 999) - (b.missingCount || 999));
    } else {
        filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    return filtered;
}

/* === PHASE 1B: HELPER FUNCTIONS === */

/** Infer dietary tags (array) for badge rendering */
function inferDietaryTags(recipe) {
    const result = [];
    const name = (recipe.strMeal || "").toLowerCase();

    if (name.includes("vegan") || name.includes("vegetable only")) result.push("Vegan");
    else if (name.includes("vegetarian") || name.includes("vegg")) result.push("Vegetarian");

    if (name.includes("gluten free") || name.includes("gf")) result.push("Gluten-Free");
    if (name.includes("dairy free") || name.includes("vegan")) result.push("Dairy-Free");
    if (name.includes("keto") || name.includes("low carb")) result.push("Keto");

    return result.slice(0, 3);
}

/** Infer difficulty based on ingredient count and instructions length */
function inferDifficulty(recipe) {
    const ingredientCount = (recipe.strIngredients || []).length;
    const instructionLength = (recipe.strInstructions || "").length;

    if (ingredientCount > 12 || instructionLength > 500) return { level: "hard", label: "Hard" };
    if (ingredientCount > 6 || instructionLength > 250) return { level: "medium", label: "Medium" };
    return { level: "easy", label: "Easy" };
}

/** Generate HTML for dietary/difficulty badges */
function getCurrentSeason() {
    const month = new Date().getMonth(); // 0-11
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "autumn";
    return "winter";
}

function countSeasonalIngredients(recipe) {
    const season = getCurrentSeason();
    const seasonalList = SEASONAL_INGREDIENTS[season] || [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ing = recipe[`strIngredient${i}`];
        if (ing && ing.trim()) ingredients.push(ing.trim().toLowerCase());
    }
    return ingredients.filter((ing) => seasonalList.some((s) => ing.includes(s))).length;
}

function estimateRecipeCost(recipe) {
    let total = 0;
    for (let i = 1; i <= 20; i++) {
        const ing = recipe[`strIngredient${i}`];
        if (!ing || !ing.trim()) continue;
        const name = ing.trim().toLowerCase();
        const cost = Object.entries(INGREDIENT_COST_ESTIMATE).find(([k]) => name.includes(k));
        total += cost ? cost[1] : 0.35; // default ~0.35 per unknown ingredient
    }
    return total;
}

function renderBadges(recipe) {
    const dietary = inferDietaryTags(recipe);
    const difficulty = inferDifficulty(recipe);

    let html = '<div class="recipe-badges">';

    dietary.forEach((tag) => {
        html += `<span class="badge badge-dietary">${tag}</span>`;
    });

    if ((recipe.expiringUsedCount || 0) > 0) {
        html += `<span class="badge badge-expiry">Uses ${recipe.expiringUsedCount} expiring</span>`;
    }

    if ((recipe.leftoverUsedCount || 0) > 0) {
        html += `<span class="badge badge-rescue">Rescues ${recipe.leftoverUsedCount} leftover</span>`;
    }

    // Seasonal badge
    const seasonalCount = countSeasonalIngredients(recipe);
    if (seasonalCount >= 2) {
        html += `<span class="badge badge-seasonal">In Season</span>`;
    }

    // Cost estimate badge
    const cost = estimateRecipeCost(recipe);
    if (cost > 0) {
        html += `<span class="badge badge-cost">~&pound;${cost.toFixed(2)}</span>`;
    }

    html += `<span class="badge badge-difficulty badge-${difficulty.level}">${difficulty.label}</span>`;
    html += '</div>';

    return html;
}

function buildExplainability(recipe) {
    const usedCount = Number.isFinite(recipe?.usedCount)
        ? recipe.usedCount
        : (Array.isArray(recipe?.used) ? recipe.used.length : 0);
    const missingCount = Number.isFinite(recipe?.missingCount)
        ? recipe.missingCount
        : (Array.isArray(recipe?.missing) ? recipe.missing.length : 0);
    const total = usedCount + missingCount;
    const matchPercent = Number.isFinite(recipe?.matchRatio)
        ? Math.round(recipe.matchRatio * 100)
        : (total > 0 ? Math.round((usedCount / total) * 100) : 0);
    const expiringUsedCount = Number.isFinite(recipe?.expiringUsedCount) ? recipe.expiringUsedCount : 0;
    const leftoverUsedCount = Number.isFinite(recipe?.leftoverUsedCount) ? recipe.leftoverUsedCount : 0;
    const score = Number.isFinite(recipe?.score) ? Number(recipe.score.toFixed(2)) : null;

    return {
        usedCount,
        missingCount,
        matchPercent,
        expiringUsedCount,
        leftoverUsedCount,
        score,
    };
}

function renderExplainabilityHtml(recipe) {
    const e = buildExplainability(recipe);
    const lines = [
        `${e.usedCount} ingredients matched`,
        `${e.missingCount} ingredients missing`,
        `${e.matchPercent}% ingredient match`,
    ];

    if (e.expiringUsedCount > 0) lines.push(`uses ${e.expiringUsedCount} expiring ingredient(s)`);
    if (e.leftoverUsedCount > 0) lines.push(`rescues ${e.leftoverUsedCount} leftover ingredient(s)`);
    if (e.score !== null) lines.push(`ranking score ${e.score}`);

    return `
        <div class="explainability-title">Why this recipe is recommended</div>
        <ul class="explainability-list">
            ${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
        </ul>
    `;
}

/** Show loading skeleton placeholders */
function showLoadingSkeleton() {
    const skeleton = document.getElementById("loadingSkeleton");
    const noResults = document.getElementById("noResults");

    if (skeleton) skeleton.classList.add("show");
    if (noResults) noResults.classList.remove("show");
}

/** Hide loading skeleton placeholders */
function hideLoadingSkeleton() {
    const skeleton = document.getElementById("loadingSkeleton");
    if (skeleton) skeleton.classList.remove("show");
}

/** Render empty state message */
function renderEmptyState(message) {
    if (!cards) return;

    const state = document.createElement("div");
    state.className = "empty-state";
    state.id = "noResults";
    state.innerHTML = `
        <div class="empty-state-icon">🍜</div>
        <h3>No Recipes Found</h3>
        <p>${message}</p>
    `;

    cards.innerHTML = "";
    cards.appendChild(state);
}

function renderCards(results) {
    if (!cards) return;

    hideLoadingSkeleton();
    cards.innerHTML = "";
    latestResultsById = {};
    renderFeaturedWastePicks(results);
    renderEditorialCollections(results);

    if (!results || !results.length) {
        renderEmptyState("Try a different ingredient combination or adjust your filters.");
        return;
    }

    for (const r of results) {
        latestResultsById[r.idMeal] = r;
        const usedText = r.used?.length ? r.used.join(", ") : "None";
        const missingText = r.missing?.length ? r.missing.slice(0, 8).join(", ") : "None";
        const timeText = r.estMinutes !== null && r.estMinutes !== undefined ? `${r.estMinutes} min` : "Time N/A";
        const heartText = isFavorited(r.idMeal) ? "Saved" : "Save";
        const badgesHtml = renderBadges(r);
        const explainabilityHtml = renderExplainabilityHtml(r);
        const matchPercent = Math.round((r.matchRatio || 0) * 100);

        const el = document.createElement("article");
        el.className = "recipe-card";
        el.innerHTML = `
            <img class="recipe-card-image" src="${escapeHtml(r.strMealThumb)}" alt="${escapeHtml(r.strMeal)}" data-open="${escapeHtml(r.idMeal)}" />
            <div class="recipe-card-content">
                <div class="recipe-card-topline">
                    <span class="recipe-kicker">Waste-Saving Pick</span>
                    <button class="icon-save-btn" data-toggle-favorite="${escapeHtml(r.idMeal)}" title="Save recipe">${heartText}</button>
                </div>
                <h3 class="recipe-card-title" data-open="${escapeHtml(r.idMeal)}">${escapeHtml(r.strMeal)}</h3>
                <div class="recipe-card-meta">
                    ${escapeHtml(timeText)} | ${matchPercent}% match | ${r.usedCount} used, ${r.missingCount} missing
                </div>
                <div class="match-bar">
                    <div class="match-fill" style="width: ${matchPercent}%"></div>
                </div>
                ${badgesHtml}
                <div class="recipe-explainability">${explainabilityHtml}</div>
                <div class="recipe-card-actions">
                    <button class="primary recipe-view-btn" data-open="${escapeHtml(r.idMeal)}">View Recipe</button>
                </div>
                <p class="recipe-card-footnote"><strong>Missing:</strong> ${escapeHtml(missingText)}${r.missingCount > 8 ? "..." : ""}</p>
            </div>
        `;
        cards.appendChild(el);
    }

    updateHeartIcons();
}

function openModal(recipe) {
    modalCurrentRecipeId = recipe.idMeal;
    currentRecipeInModal = recipe;
    currentServings = 4;

    if (modalTitle) modalTitle.textContent = recipe.strMeal || "Recipe";
    if (modalImg) {
        modalImg.src = recipe.strMealThumb || "";
        modalImg.alt = recipe.strMeal || "Recipe image";
    }

    const meta = [];
    if (recipe.strCategory) meta.push(recipe.strCategory);
    if (recipe.strArea) meta.push(recipe.strArea);
    if (recipe.estMinutes !== null && recipe.estMinutes !== undefined) meta.push(`${recipe.estMinutes} min`);

    if (modalMeta) modalMeta.textContent = meta.length ? meta.join(" | ") : "Details";
    if (modalCounts) modalCounts.textContent = `Used ${recipe.usedCount} | Missing ${recipe.missingCount}`;
    if (modalExplainability) modalExplainability.innerHTML = renderExplainabilityHtml(recipe);

    // Render used ingredients with green highlighting
    if (modalUsed) {
        if (recipe.used && recipe.used.length > 0) {
            modalUsed.innerHTML = recipe.used
                .map((ing) => `<span class="ingredient-tag ingredient-used">${escapeHtml(ing)}</span>`)
                .join(" ");
        } else {
            modalUsed.textContent = "None";
        }
    }

    // Render missing ingredients with red highlighting + substitution hints
    if (modalMissing) {
        if (recipe.missing && recipe.missing.length > 0) {
            modalMissing.innerHTML = recipe.missing
                .map((ing) => {
                    let html = `<span class="ingredient-tag ingredient-missing">${escapeHtml(ing)}</span>`;
                    if (recipe.missing.length <= 3) {
                        const lower = ing.toLowerCase();
                        const subKey = Object.keys(INGREDIENT_SUBSTITUTIONS).find((k) => lower.includes(k));
                        if (subKey) {
                            const subs = INGREDIENT_SUBSTITUTIONS[subKey];
                            html += `<span class="substitution-hint">Try: ${subs.map(escapeHtml).join(", ")}</span>`;
                        }
                    }
                    return html;
                })
                .join(" ");
        } else {
            modalMissing.textContent = "None";
        }
    }

    if (modalInstructions) modalInstructions.textContent = recipe.strInstructions || "No instructions available.";

    if (modalHeartBtn) {
        const fav = isFavorited(recipe.idMeal);
        modalHeartBtn.textContent = fav ? "Saved" : "Save Recipe";
    }

    if (modalLinks) {
        modalLinks.innerHTML = "";
        if (recipe.strYoutube) {
            const y = document.createElement("a");
            y.href = recipe.strYoutube;
            y.target = "_blank";
            y.rel = "noreferrer";
            y.textContent = "YouTube";
            modalLinks.appendChild(y);
        }
        if (recipe.strSource) {
            const s = document.createElement("a");
            s.href = recipe.strSource;
            s.target = "_blank";
            s.rel = "noreferrer";
            s.textContent = "Source";
            modalLinks.appendChild(s);
        }
    }

    if (modalOverlay) {
        modalOverlay.classList.remove("hidden");
        modalOverlay.setAttribute("aria-hidden", "false");
    }

    // Add to recently viewed
    addRecentlyViewed(recipe);
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.add("hidden");
        modalOverlay.setAttribute("aria-hidden", "true");
    }
    modalCurrentRecipeId = null;
}

function openAuthModal(tab) {
    if (!authModal) return;
    authModal.classList.remove("hidden");
    authModal.setAttribute("aria-hidden", "false");
    switchAuthTab(tab || "login");
    clearAuthFeedback();
}

function closeAuth() {
    if (!authModal) return;
    authModal.classList.add("hidden");
    authModal.setAttribute("aria-hidden", "true");
}

function switchAuthTab(tab) {
    const showLogin = tab === "login";
    if (authTabLogin) authTabLogin.classList.toggle("active", showLogin);
    if (authTabSignup) authTabSignup.classList.toggle("active", !showLogin);
    if (loginForm) loginForm.classList.toggle("hidden", !showLogin);
    if (signupForm) signupForm.classList.toggle("hidden", showLogin);
    clearAuthFeedback();
}

function setAuthFeedback(message, type = "info") {
    if (!authFeedback) return;
    authFeedback.textContent = message;
    authFeedback.classList.remove("hidden", "success", "error");
    if (type === "success") authFeedback.classList.add("success");
    if (type === "error") authFeedback.classList.add("error");
}

function clearAuthFeedback() {
    if (!authFeedback) return;
    authFeedback.textContent = "";
    authFeedback.classList.add("hidden");
    authFeedback.classList.remove("success", "error");
}

async function applyAuthView() {
    const loggedIn = isLoggedIn();

    if (publicHome) publicHome.classList.toggle("hidden", loggedIn);
    if (appShell) appShell.classList.toggle("hidden", !loggedIn);

    if (loggedIn) {
        // Load feature flags from session
        const session = getSession();
        featureFlagsCache = session?.user?.featureFlags || {};

        setRecipeSectionVisible(Boolean(latestResults.length));
        if (!metadataLoaded) {
            await loadMetadata();
            metadataLoaded = true;
        }
        await migrateLegacyLocalDataIfNeeded();
        await Promise.all([
            refreshFavorites(),
            refreshShoppingList(),
            refreshPantry(),
            refreshLeftovers(),
            refreshWasteLogs(),
            refreshImpactSummary(),
            refreshCookLog(),
            refreshMealPlan(),
        ]);
        loadRecentlyViewed();
        renderRecentlyViewedPanel();
        checkExpiryNotifications();

        // Trigger onboarding for first-time users
        if (!localStorage.getItem(ONBOARDING_KEY)) {
            setTimeout(startOnboarding, 800);
        }
    } else {
        setRecipeSectionVisible(false);
        pantryCache = [];
        leftoversCache = [];
        wasteLogsCache = [];
        mealPlanCache = [];
        cookLogCache = [];
        renderPantry();
        renderLeftovers();
        renderWasteLogs();
        renderCookLog();
        if (impactSummary) impactSummary.innerHTML = "";
        if (soonExpiringAlert) soonExpiringAlert.textContent = "";
        const dailySummary = document.getElementById("dailySummary");
        if (dailySummary) dailySummary.classList.add("hidden");
        const expiryBanner = document.getElementById("expiryNotificationBanner");
        if (expiryBanner) expiryBanner.classList.add("hidden");
    }
}

/* === AUTOCOMPLETE HANDLER === */
const POPULAR_INGREDIENTS = [
    "chicken", "beef", "fish", "salmon", "shrimp", "pork",
    "tomato", "onion", "garlic", "pepper", "carrot", "broccoli",
    "rice", "pasta", "bread", "potato", "beans", "lentils",
    "milk", "cheese", "butter", "oil", "salt", "sugar",
    "egg", "flour", "lemon", "lime", "basil", "oregano",
    "thyme", "cumin", "paprika", "ginger", "soy sauce"
];

// ── Ingredient Substitution Map ──────────────────────────────
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

// ── Seasonal Ingredients ─────────────────────────────────────
const SEASONAL_INGREDIENTS = {
    spring: ["asparagus", "peas", "radish", "artichoke", "mint", "spinach", "leek", "strawberry"],
    summer: ["tomato", "corn", "zucchini", "watermelon", "peach", "basil", "cucumber", "bell pepper"],
    autumn: ["pumpkin", "squash", "apple", "cranberry", "cinnamon", "sweet potato", "mushroom", "pear"],
    winter: ["potato", "turnip", "kale", "leek", "cabbage", "parsnip", "citrus", "beet"],
};

// ── Ingredient Cost Estimates (GBP per typical portion) ──────
const INGREDIENT_COST_ESTIMATE = {
    "chicken": 2.50, "beef": 4.00, "salmon": 5.00, "shrimp": 4.50, "pork": 3.00,
    "fish": 3.50, "egg": 0.30, "rice": 0.50, "pasta": 0.80, "bread": 0.60,
    "potato": 0.40, "tomato": 0.50, "onion": 0.30, "garlic": 0.15, "carrot": 0.25,
    "broccoli": 0.80, "pepper": 0.70, "mushroom": 0.90, "spinach": 0.60,
    "cheese": 1.50, "milk": 0.40, "butter": 0.50, "cream": 0.80, "yogurt": 0.60,
    "oil": 0.20, "flour": 0.15, "sugar": 0.10, "lemon": 0.30, "lime": 0.30,
    "beans": 0.40, "lentils": 0.35, "corn": 0.50, "peas": 0.40,
};

// ── Onboarding Steps ─────────────────────────────────────────
const ONBOARDING_STEPS = [
    { target: "#ingredients", title: "Search by Ingredients", text: "Type the ingredients you already have and find recipes that use them. Reduce waste by cooking what you own." },
    { target: "#pantryCard", title: "Your Pantry", text: "Track what's in your kitchen and when it expires. PantryPal prioritizes recipes using soon-expiring items." },
    { target: "#leftoverCard", title: "Leftover Rescue", text: "Log leftovers and activate Rescue Mode to find recipes that use them up before they go to waste." },
    { target: "#wasteTrackerCard", title: "Waste Tracker", text: "Log any wasted food to track your environmental impact. See your waste reduction progress over time." },
    { target: "#shoppingDrawerBtn", title: "Shopping List", text: "Build shopping lists from missing recipe ingredients. Copy or download your list for the store." },
];

let featureFlagsCache = {};

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleIngredientAutocomplete() {
    const autocompleteEl = document.getElementById("ingredientAutocomplete");
    if (!autocompleteEl || !input) return;

    const value = input.value.trim().toLowerCase();

    if (value.length < 1) {
        autocompleteEl.classList.remove("show");
        return;
    }

    const matches = POPULAR_INGREDIENTS.filter((ing) => ing.startsWith(value)).slice(0, 8);

    if (!matches.length) {
        autocompleteEl.classList.remove("show");
        return;
    }

    autocompleteEl.innerHTML = matches
        .map((ing) => `<li data-ingredient="${ing}">${ing}</li>`)
        .join("");

    autocompleteEl.classList.add("show");

    // Handle click on autocomplete item
    autocompleteEl.querySelectorAll("li").forEach((item) => {
        item.addEventListener("click", () => {
            const ing = item.getAttribute("data-ingredient");
            input.value = (input.value.trim() + ", " + ing).trim();
            autocompleteEl.classList.remove("show");
            input.focus();
        });
    });
}

/* === PHASE 2: RECENTLY VIEWED TRACKING === */

function loadRecentlyViewed() {
    try {
        const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
        recentlyViewedCache = data ? JSON.parse(data) : [];
    } catch {
        recentlyViewedCache = [];
    }
}

function saveRecentlyViewed() {
    try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewedCache));
    } catch {
        // Silently fail if storage is full
    }
}

function addRecentlyViewed(recipe) {
    if (!recipe || !recipe.idMeal) return;

    // Remove if already exists
    recentlyViewedCache = recentlyViewedCache.filter((r) => r.idMeal !== recipe.idMeal);

    // Add to front
    recentlyViewedCache.unshift({
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
        viewedAt: new Date().toISOString(),
    });

    // Keep only last 10
    recentlyViewedCache = recentlyViewedCache.slice(0, 10);
    saveRecentlyViewed();
}

function renderRecentlyViewedPanel() {
    const existingPanel = document.getElementById("recentlyViewedPanel");

    if (!recentlyViewedCache.length) {
        if (existingPanel) existingPanel.remove();
        return;
    }

    if (existingPanel) existingPanel.remove();

    const panel = document.createElement("div");
    panel.id = "recentlyViewedPanel";
    panel.className = "recently-viewed-panel";
    panel.innerHTML = `
        <div class="panel-header"><h3>Recently Viewed</h3></div>
        <div class="recently-viewed-grid">
            ${recentlyViewedCache
                .map(
                    (r) => `
                <div class="recent-card" data-open="${r.idMeal}">
                    <img src="${r.strMealThumb}" alt="${r.strMeal}" />
                    <h4>${r.strMeal}</h4>
                </div>
            `
                )
                .join("")}
        </div>
    `;

    // Insert after featured banners or at the top
    const bannerStrip = document.querySelector(".banner-strip");
    if (bannerStrip && bannerStrip.parentNode) {
        bannerStrip.parentNode.insertBefore(panel, bannerStrip.nextSibling);
    }

    // Add click handlers
    panel.querySelectorAll("[data-open]").forEach((el) => {
        el.addEventListener("click", () => {
            const id = el.getAttribute("data-open");
            const recipe = recentlyViewedCache.find((r) => r.idMeal === id);
            if (recipe && latestResultsById[id]) {
                openModal(latestResultsById[id]);
            }
        });
    });
}

/* === PHASE 4: RECIPE SERVINGS SCALING & PRINT === */

function parseQuantity(quantityStr) {
    if (!quantityStr) return null;
    const match = String(quantityStr).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
}

function scaleQuantity(quantityStr, scaleFactor) {
    if (!quantityStr) return quantityStr;
    const quantity = parseQuantity(quantityStr);
    if (!Number.isFinite(quantity)) return quantityStr;
    const scaled = (quantity * scaleFactor).toFixed(2).replace(/\.?0+$/, "");
    const unit = String(quantityStr).replace(/[\d.]+\s*/, "").trim();
    return unit ? `${scaled} ${unit}` : scaled;
}

function updateServings(newServings) {
    if (!currentRecipeInModal) return;
    
    currentServings = newServings;
    
    // Update button states
    document.querySelectorAll(".serving-btn").forEach((btn) => {
        const servings = btn.getAttribute("data-servings");
        if (String(servings) === String(newServings)) {
            btn.setAttribute("selected", "");
        } else {
            btn.removeAttribute("selected");
        }
    });

    // Recalculate and display ingredients
    const scaleFactor = newServings / 4; // Base is 4 servings
    const recipe = currentRecipeInModal;

    if (recipe.used && recipe.used.length > 0) {
        modalUsed.innerHTML = recipe.used
            .map((ing) => `<span class="ingredient-tag ingredient-used">${escapeHtml(scaleQuantity(ing, scaleFactor))}</span>`)
            .join(" ");
    }

    if (recipe.missing && recipe.missing.length > 0) {
        modalMissing.innerHTML = recipe.missing
            .map((ing) => `<span class="ingredient-tag ingredient-missing">${escapeHtml(scaleQuantity(ing, scaleFactor))}</span>`)
            .join(" ");
    }
}

function printRecipe() {
    if (!currentRecipeInModal) return;

    const recipe = currentRecipeInModal;
    const printContent = `
        <html>
            <head>
                <title>${escapeHtml(recipe.strMeal)}</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; }
                    h1, h2 { color: #333; }
                    img { max-width: 100%; height: auto; margin: 20px 0; }
                    .ingredients, .instructions { margin: 20px 0; }
                    .ingredient { margin: 8px 0; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <h1>${escapeHtml(recipe.strMeal)}</h1>
                <img src="${escapeHtml(recipe.strMealThumb)}" alt="${escapeHtml(recipe.strMeal)}" />
                <p><strong>${escapeHtml(recipe.strCategory || "")} | ${escapeHtml(recipe.strArea || "")} | ${escapeHtml(recipe.estMinutes || "N/A")} min | ${currentServings} servings</strong></p>
                <h2>Ingredients</h2>
                <div class="ingredients">
                    ${recipe.used?.map((ing) => `<div class="ingredient">✓ ${escapeHtml(scaleQuantity(ing, currentServings / 4))}</div>`).join("")}
                    ${recipe.missing?.map((ing) => `<div class="ingredient">○ ${escapeHtml(scaleQuantity(ing, currentServings / 4))}</div>`).join("")}
                </div>
                <h2>Instructions</h2>
                <div class="instructions">${escapeHtml(recipe.strInstructions)}</div>
            </body>
        </html>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

async function searchRecipes() {
    if (!isLoggedIn()) {
        openAuthModal("login");
        return;
    }

    const ingredients = input?.value?.trim() || "";
    if (!ingredients) {
        setDebug({ error: "Please enter ingredients first" });
        showToast("Please enter ingredients first");
        return;
    }

    const area = areaSelect ? areaSelect.value : "";
    const category = categorySelect ? categorySelect.value : "";
    const maxMinutes = maxMinutesInput ? maxMinutesInput.value : "";
    const rescueMode = rescueModeToggle ? rescueModeToggle.checked : false;
    const prioritizeExpiry = prioritizeExpiryToggle ? prioritizeExpiryToggle.checked : false;

    const qs = new URLSearchParams({ ingredients });
    if (area) qs.set("area", area);
    if (category) qs.set("category", category);
    if (maxMinutes) qs.set("maxMinutes", maxMinutes);
    if (rescueMode) qs.set("rescueMode", "true");
    if (prioritizeExpiry) qs.set("prioritizeExpiry", "true");

    showLoadingSkeleton();
    setRecipeSectionVisible(true);
    cards.innerHTML = "";
    setDebug({});

    try {
        const data = await fetchJson(`/api/recipes?${qs.toString()}`, {
            headers: {
                ...authHeaders(),
            },
        });

        latestResults = data.results || [];
        const filtered = applyClientFilters(latestResults);
        renderCards(filtered);

        setDebug({
            input: data.input,
            serverFilters: data.filters,
            countBeforeClientFilters: latestResults.length,
            countAfterClientFilters: filtered.length,
        });

        showToast(`Found ${filtered.length} recipe(s)`);

        // Track search count for survey trigger
        const count = Number(localStorage.getItem(SEARCH_COUNT_KEY) || "0") + 1;
        localStorage.setItem(SEARCH_COUNT_KEY, String(count));
        if (count === 5 && !localStorage.getItem(SURVEY_DONE_KEY)) {
            setTimeout(openSurveyModal, 1500);
        }
    } catch (err) {
        renderCards([]);
        setDebug({ error: err.message });
        showToast(err.message);
    }
}

// ── Sort/Filter panel toggles ──
function closeAllPanels() {
    if (sortPanel) { sortPanel.classList.add("hidden"); }
    if (toggleSortBtn) toggleSortBtn.setAttribute("aria-expanded", "false");
    if (filterPanel) { filterPanel.classList.add("hidden"); }
    if (toggleFilterBtn) toggleFilterBtn.setAttribute("aria-expanded", "false");
}

function updateFilterBadge() {
    if (!filterBadge) return;
    const active = [
        areaSelect?.value,
        categorySelect?.value,
        mealTypeSelect?.value,
        dietarySelect?.value,
        seasonalSelect?.value,
        recipeNameInput?.value,
        maxMinutesInput?.value,
    ].filter(Boolean).length;
    filterBadge.textContent = active;
    filterBadge.classList.toggle("hidden", active === 0);

    if (!hasActiveSearchCriteria()) {
        clearRecipeResultsAndHide();
    }
}

if (toggleSortBtn) {
    toggleSortBtn.addEventListener("click", () => {
        const open = !sortPanel.classList.contains("hidden");
        closeAllPanels();
        if (!open) {
            sortPanel.classList.remove("hidden");
            toggleSortBtn.setAttribute("aria-expanded", "true");
        }
    });
}

if (toggleFilterBtn) {
    toggleFilterBtn.addEventListener("click", () => {
        const open = !filterPanel.classList.contains("hidden");
        closeAllPanels();
        if (!open) {
            filterPanel.classList.remove("hidden");
            toggleFilterBtn.setAttribute("aria-expanded", "true");
        }
    });
}

// Sync hidden sortSelect with radio group so existing applyClientFilters works
document.addEventListener("change", (e) => {
    if (e.target?.name === "sortRadio") {
        if (sortSelect) sortSelect.value = e.target.value;
        if (latestResults.length) renderCards(applyClientFilters(latestResults));
    }
});

if (loginBtn) loginBtn.addEventListener("click", () => openAuthModal("login"));
if (signupBtn) signupBtn.addEventListener("click", () => openAuthModal("signup"));
if (closeAuthModal) closeAuthModal.addEventListener("click", closeAuth);
if (authTabLogin) authTabLogin.addEventListener("click", () => switchAuthTab("login"));
if (authTabSignup) authTabSignup.addEventListener("click", () => switchAuthTab("signup"));

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail")?.value?.trim() || "";
        const password = document.getElementById("loginPassword")?.value || "";
        setAuthFeedback("Signing in...");

        try {
            const data = await fetchJson("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            setSession({ token: data.token, user: data.user, at: Date.now() });
            setAuthFeedback("Login successful", "success");
            closeAuth();
            await applyAuthView();
            showToast("Logged in successfully");
        } catch (err) {
            setAuthFeedback(err.message, "error");
            showToast(err.message);
        }
    });
}

if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("signupName")?.value?.trim() || "";
        const email = document.getElementById("signupEmail")?.value?.trim() || "";
        const password = document.getElementById("signupPassword")?.value || "";
        setAuthFeedback("Creating account...");

        try {
            const data = await fetchJson("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            setSession({ token: data.token, user: data.user, at: Date.now() });
            setAuthFeedback("Signup successful", "success");
            closeAuth();
            await applyAuthView();
            showToast("Account created and logged in");
        } catch (err) {
            const msg = String(err.message || "Signup failed");
            const existsError = msg.toLowerCase().includes("already") || msg.toLowerCase().includes("registered");

            if (existsError) {
                switchAuthTab("login");
                const loginEmailInput = document.getElementById("loginEmail");
                if (loginEmailInput) loginEmailInput.value = email;
                setAuthFeedback("Account already exists. Please log in.", "error");
                showToast("Account already exists. Please log in.");
                return;
            }

            setAuthFeedback(err.message, "error");
            showToast(err.message);
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await fetchJson("/api/auth/logout", {
                method: "POST",
                headers: {
                    ...authHeaders(),
                },
            });
        } catch {
            // Ignore logout errors and clear session locally.
        }

        clearSession();
        favoritesCache = [];
        shoppingListCache = [];
        pantryCache = [];
        leftoversCache = [];
        wasteLogsCache = [];
        latestResults = [];
        latestResultsById = {};
        setRecipeSectionVisible(false);
        if (cards) cards.innerHTML = "";
        renderFavorites();
        renderShoppingList();
        renderPantry();
        renderLeftovers();
        renderWasteLogs();
        applyAuthView();
    });
}

if (btn) btn.addEventListener("click", searchRecipes);
if (input) {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchRecipes();
        }
    });

    // Autocomplete listener
    input.addEventListener("input", debounce(handleIngredientAutocomplete, 300));
    input.addEventListener("input", () => {
        if (!hasActiveSearchCriteria()) {
            clearRecipeResultsAndHide();
        }
    });
}

if (healthBtn) {
    healthBtn.addEventListener("click", async () => {
        try {
            const data = await fetchJson("/api/health");
            setDebug(data);
            showToast("Server is healthy");
        } catch (err) {
            setDebug({ error: err.message });
            showToast("Server error");
        }
    });
}

if (cards) {
    cards.addEventListener("click", (e) => {
        const toggleFavBtn = e.target.closest("button[data-toggle-favorite]");
        if (toggleFavBtn) {
            const id = toggleFavBtn.getAttribute("data-toggle-favorite");
            const recipe = latestResultsById[id];
            if (recipe) toggleFavorite(recipe);
            return;
        }

        const openEl = e.target.closest("[data-open]");
        if (openEl) {
            const id = openEl.getAttribute("data-open");
            const recipe = latestResultsById[id];
            if (recipe) openModal(recipe);
            return;
        }

    });
}

if (featuredWasteGrid) {
    featuredWasteGrid.addEventListener("click", (e) => {
        const openEl = e.target.closest("[data-open]");
        if (!openEl) return;

        const id = openEl.getAttribute("data-open");
        const recipe = latestResultsById[id];
        if (recipe) openModal(recipe);
    });
}

for (const grid of [latestWasteGrid, popularWeekGrid]) {
    if (!grid) continue;
    grid.addEventListener("click", (e) => {
        const openEl = e.target.closest("[data-open]");
        if (!openEl) return;

        const id = openEl.getAttribute("data-open");
        const recipe = latestResultsById[id];
        if (recipe) openModal(recipe);
    });
}

if (runRescueSearchBtn) {
    runRescueSearchBtn.addEventListener("click", () => {
        if (!isLoggedIn()) {
            openAuthModal("login");
            return;
        }

        if (rescueModeToggle) rescueModeToggle.checked = true;
        if (prioritizeExpiryToggle) prioritizeExpiryToggle.checked = true;
        if (!input?.value?.trim()) {
            showToast("Add ingredients first, then run rescue search");
            return;
        }

        searchRecipes();
    });
}

mountSidebarInQuickAccessDrawer();
setupSectionRail();

if (favoritesBtn) {
    favoritesBtn.addEventListener("click", () => {
        if (favoritesPanel) favoritesPanel.classList.toggle("hidden");
    });
}

if (shoppingDrawerBtn) shoppingDrawerBtn.addEventListener("click", openShoppingDrawer);
if (closeShoppingDrawer) closeShoppingDrawer.addEventListener("click", closeShoppingDrawerFn);
if (shoppingDrawer) {
    shoppingDrawer.addEventListener("click", (e) => {
        if (e.target === shoppingDrawer) closeShoppingDrawerFn();
    });
}

if (quickAccessDrawerBtn) quickAccessDrawerBtn.addEventListener("click", openQuickAccessDrawer);
if (closeQuickAccessDrawer) closeQuickAccessDrawer.addEventListener("click", closeQuickAccessDrawerFn);
if (quickAccessDrawer) {
    quickAccessDrawer.addEventListener("click", (e) => {
        if (e.target === quickAccessDrawer) closeQuickAccessDrawerFn();
    });
}

if (favoritesList) {
    favoritesList.addEventListener("click", (e) => {
        const viewBtn = e.target.closest("button[data-view-favorite]");
        if (viewBtn) {
            const id = viewBtn.getAttribute("data-view-favorite");
            const recipe = favoritesCache.find((r) => String(r.idMeal) === String(id));
            if (recipe) openModal(recipe);
            return;
        }

        const removeBtn = e.target.closest("button[data-remove-favorite]");
        if (removeBtn) {
            const id = removeBtn.getAttribute("data-remove-favorite");
            const recipe = favoritesCache.find((r) => String(r.idMeal) === String(id));
            if (recipe) toggleFavorite(recipe);
        }
    });
}

if (shoppingListEl) {
    shoppingListEl.addEventListener("click", (e) => {
        const clearGroupBtn = e.target.closest("button[data-clear-group]");
        if (clearGroupBtn) {
            removeRecipeGroup(clearGroupBtn.getAttribute("data-clear-group"));
            return;
        }

        const toggleEl = e.target.closest("[data-toggle]");
        if (toggleEl) {
            toggleBought(toggleEl.getAttribute("data-toggle"));
            return;
        }

        const removeBtn = e.target.closest("button[data-remove]");
        if (removeBtn) {
            removeItem(removeBtn.getAttribute("data-remove"));
        }
    });
}

if (pantryForm) {
    pantryForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) return openAuthModal("login");

        const ingredientName = pantryIngredientInput?.value?.trim() || "";
        const quantity = Number(pantryQuantityInput?.value || 1);
        const unit = pantryUnitInput?.value?.trim() || "unit";
        const expiryDate = pantryExpiryInput?.value || "";

        if (!ingredientName || !expiryDate) {
            showToast("Ingredient and expiry date are required");
            return;
        }

        try {
            await createPantryItem({ ingredientName, quantity, unit, expiryDate });
            pantryForm.reset();
            showToast("Pantry item added");
        } catch (err) {
            showToast(err.message);
        }
    });
}

if (pantryList) {
    pantryList.addEventListener("click", async (e) => {
        const btn = e.target.closest("button[data-remove-pantry]");
        if (!btn) return;
        try {
            await removePantryItemWithSync(btn.getAttribute("data-remove-pantry"));
        } catch (err) {
            showToast(err.message);
        }
    });
}

if (leftoverForm) {
    leftoverForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) return openAuthModal("login");

        const leftoverName = leftoverNameInput?.value?.trim() || "";
        const amount = Number(leftoverAmountInput?.value || 1);
        const unit = leftoverUnitInput?.value?.trim() || "portion";
        const mustUseBy = leftoverMustUseByInput?.value || "";

        if (!leftoverName || !mustUseBy) {
            showToast("Leftover name and must-use-by date are required");
            return;
        }

        try {
            await createLeftover({ leftoverName, amount, unit, mustUseBy });
            leftoverForm.reset();
            showToast("Leftover added");
        } catch (err) {
            showToast(err.message);
        }
    });
}

if (leftoverList) {
    leftoverList.addEventListener("click", async (e) => {
        const btn = e.target.closest("button[data-remove-leftover]");
        if (!btn) return;
        try {
            await removeLeftover(btn.getAttribute("data-remove-leftover"));
            showToast("Leftover removed");
        } catch (err) {
            showToast(err.message);
        }
    });
}

if (wasteForm) {
    wasteForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) return openAuthModal("login");

        const ingredientName = wasteIngredientInput?.value?.trim() || "";
        const quantity = Number(wasteQuantityInput?.value || 1);
        const unit = wasteUnitInput?.value?.trim() || "unit";
        const estimatedWeightGrams = Number(wasteWeightInput?.value || 0);
        const estimatedCost = Number(wasteCostInput?.value || 0);
        const reason = wasteReasonSelect?.value || "other";

        if (!ingredientName) {
            showToast("Wasted ingredient name is required");
            return;
        }

        try {
            await createWasteLog({
                ingredientName,
                quantity,
                unit,
                estimatedWeightGrams,
                estimatedCost,
                reason,
            });
            wasteForm.reset();
            showToast("Waste log added");
        } catch (err) {
            showToast(err.message);
        }
    });
}

for (const toggle of [prioritizeExpiryToggle, rescueModeToggle]) {
    if (!toggle) continue;
    toggle.addEventListener("change", () => {
        if (!hasActiveSearchCriteria()) {
            clearRecipeResultsAndHide();
            return;
        }
        if (input?.value?.trim()) searchRecipes();
    });
}

if (clearListBtn) clearListBtn.addEventListener("click", clearShoppingList);
if (copyListBtn) copyListBtn.addEventListener("click", copyShoppingList);
if (downloadListBtn) downloadListBtn.addEventListener("click", downloadShoppingListTxt);

if (quickOptions) {
    quickOptions.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;

        const presetIngredients = chip.getAttribute("data-preset-ingredients");
        const presetCategory = chip.getAttribute("data-preset-category");
        const presetDietary = chip.getAttribute("data-preset-dietary");
        const presetSeasonal = chip.getAttribute("data-preset-seasonal");
        const presetCourse = chip.getAttribute("data-preset-course");

        if (input && presetIngredients) input.value = presetIngredients;
        if (categorySelect && presetCategory) categorySelect.value = presetCategory;
        if (dietarySelect && presetDietary) dietarySelect.value = presetDietary;
        if (seasonalSelect && presetSeasonal) seasonalSelect.value = presetSeasonal;
        if (mealTypeSelect && presetCourse) mealTypeSelect.value = presetCourse;

        searchRecipes();
    });
}

function handleClearFilters() {
    if (areaSelect) areaSelect.value = "";
    if (categorySelect) categorySelect.value = "";
    if (mealTypeSelect) mealTypeSelect.value = "";
    if (dietarySelect) dietarySelect.value = "";
    if (seasonalSelect) seasonalSelect.value = "";
    if (sortSelect) sortSelect.value = "score";
    if (maxMinutesInput) maxMinutesInput.value = "";
    if (recipeNameInput) recipeNameInput.value = "";
    if (rescueModeToggle) rescueModeToggle.checked = false;
    if (prioritizeExpiryToggle) prioritizeExpiryToggle.checked = false;
    // reset sort radio
    const defaultRadio = document.querySelector('input[name="sortRadio"][value="score"]');
    if (defaultRadio) defaultRadio.checked = true;
    updateFilterBadge();
    if (!hasActiveSearchCriteria()) {
        clearRecipeResultsAndHide();
    } else if (latestResults.length) {
        renderCards(applyClientFilters(latestResults));
    }
    showToast("Filters cleared");
}

if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", handleClearFilters);
if (clearFiltersResultsBtn) clearFiltersResultsBtn.addEventListener("click", handleClearFilters);

for (const el of [mealTypeSelect, dietarySelect, seasonalSelect, sortSelect, recipeNameInput]) {
    if (!el) continue;
    el.addEventListener("change", () => {
        updateFilterBadge();
        if (!hasActiveSearchCriteria()) {
            clearRecipeResultsAndHide();
            return;
        }
        if (!latestResults.length) return;
        renderCards(applyClientFilters(latestResults));
    });
}

if (recipeNameInput) {
    recipeNameInput.addEventListener("input", () => {
        updateFilterBadge();
        if (!hasActiveSearchCriteria()) {
            clearRecipeResultsAndHide();
            return;
        }
        if (!latestResults.length) return;
        renderCards(applyClientFilters(latestResults));
    });
}

if (bannerStrip) {
    bannerStrip.addEventListener("click", (e) => {
        const card = e.target.closest(".banner-card");
        if (!card) return;

        const recipeName = card.dataset.recipeName;
        openFeaturedRecipeByName(recipeName);
    });

    bannerStrip.addEventListener("keydown", (e) => {
        const card = e.target.closest(".banner-card");
        if (!card) return;

        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();

        const recipeName = card.dataset.recipeName;
        openFeaturedRecipeByName(recipeName);
    });

    bannerStrip.addEventListener("mouseenter", () => {
        if (bannerRotationTimer) {
            clearInterval(bannerRotationTimer);
            bannerRotationTimer = null;
        }
    });

    bannerStrip.addEventListener("mouseleave", () => {
        if (!bannerRotationTimer && featuredBannerRecipes.length > bannerCards.length) {
            bannerRotationTimer = setInterval(() => {
                bannerCursor = (bannerCursor + 1) % featuredBannerRecipes.length;
                renderRotatingBanners();
            }, 6000);
        }
    });
}

if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

// Servings scaling buttons
document.querySelectorAll(".serving-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const servings = btn.getAttribute("data-servings");
        updateServings(parseInt(servings));
    });
});

// Print recipe button
if (printRecipeBtn) {
    printRecipeBtn.addEventListener("click", printRecipe);
}

if (modalAddMissing) {
    modalAddMissing.addEventListener("click", () => {
        if (!modalCurrentRecipeId) return;
        const recipe = latestResultsById[modalCurrentRecipeId];
        if (!recipe) return;

        const missing = recipe.missing || [];
        if (!missing.length) {
            showToast("No missing ingredients to add");
            return;
        }

        addItemsToShoppingList(missing, recipe);
        setDebug({ addedFromModal: missing, meal: recipe.strMeal });
    });
}

if (modalHeartBtn) {
    modalHeartBtn.addEventListener("click", () => {
        if (!modalCurrentRecipeId) return;

        const recipe =
            latestResultsById[modalCurrentRecipeId] ||
            favoritesCache.find((r) => String(r.idMeal) === String(modalCurrentRecipeId));

        if (!recipe) return;

        toggleFavorite(recipe);
        modalHeartBtn.textContent = isFavorited(recipe.idMeal) ? "Saved" : "Save Recipe";
    });
}

// ── I Cooked This button ─────────────────────────────────────
const modalCookBtn = document.getElementById("modalCookBtn");
if (modalCookBtn) {
    modalCookBtn.addEventListener("click", () => {
        if (!modalCurrentRecipeId) return;
        const recipe =
            latestResultsById[modalCurrentRecipeId] ||
            favoritesCache.find((r) => String(r.idMeal) === String(modalCurrentRecipeId));
        if (!recipe) return;

        showActionToast("Deduct used ingredients from pantry?", [
            { label: "Yes", action: () => logCook(recipe, true) },
            { label: "No", action: () => logCook(recipe, false) },
        ]);
    });
}

// ── Share Recipe button ──────────────────────────────────────
const modalShareBtn = document.getElementById("modalShareBtn");
if (modalShareBtn) {
    modalShareBtn.addEventListener("click", () => {
        if (!currentRecipeInModal) return;
        const r = currentRecipeInModal;
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ing = r[`strIngredient${i}`];
            const measure = r[`strMeasure${i}`];
            if (ing && ing.trim()) ingredients.push(`${(measure || "").trim()} ${ing.trim()}`.trim());
        }
        const text = [
            `${r.strMeal}`,
            `Category: ${r.strCategory || "N/A"} | Cuisine: ${r.strArea || "N/A"}`,
            `\nIngredients:\n${ingredients.map((i) => `- ${i}`).join("\n")}`,
            r.strSource ? `\nRecipe: ${r.strSource}` : "",
            `\nShared via PantryPal`,
        ].filter(Boolean).join("\n");

        navigator.clipboard.writeText(text).then(() => {
            showToast("Recipe copied to clipboard!");
        }).catch(() => {
            showToast("Failed to copy to clipboard");
        });
    });
}

// ── Add to Meal Plan button ──────────────────────────────────
const modalMealPlanBtn = document.getElementById("modalMealPlanBtn");
const mealPlanPicker = document.getElementById("mealPlanPicker");
const closeMealPlanPickerBtn = document.getElementById("closeMealPlanPicker");
const mealPlanPickerConfirm = document.getElementById("mealPlanPickerConfirm");

if (modalMealPlanBtn) {
    modalMealPlanBtn.addEventListener("click", () => {
        if (!currentRecipeInModal) return;
        if (mealPlanPicker) {
            mealPlanPicker.classList.remove("hidden");
            mealPlanPicker.setAttribute("aria-hidden", "false");
        }
    });
}

if (closeMealPlanPickerBtn) {
    closeMealPlanPickerBtn.addEventListener("click", () => {
        if (mealPlanPicker) {
            mealPlanPicker.classList.add("hidden");
            mealPlanPicker.setAttribute("aria-hidden", "true");
        }
    });
}

if (mealPlanPickerConfirm) {
    mealPlanPickerConfirm.addEventListener("click", async () => {
        if (!currentRecipeInModal) return;
        const day = document.getElementById("mealPlanPickerDay")?.value || "mon";
        const slot = document.getElementById("mealPlanPickerSlot")?.value || "dinner";
        await addToMealPlan(currentRecipeInModal, day, slot);
        if (mealPlanPicker) {
            mealPlanPicker.classList.add("hidden");
            mealPlanPicker.setAttribute("aria-hidden", "true");
        }
    });
}

// ── Meal Planner section events ──────────────────────────────
const mealPlannerBtn = document.getElementById("mealPlannerBtn");
const mealPlannerSection = document.getElementById("mealPlannerSection");

if (mealPlannerBtn) {
    mealPlannerBtn.addEventListener("click", () => {
        if (mealPlannerSection) {
            mealPlannerSection.classList.toggle("hidden");
            if (!mealPlannerSection.classList.contains("hidden")) refreshMealPlan();
        }
    });
}

const mealPlanPrevWeek = document.getElementById("mealPlanPrevWeek");
const mealPlanNextWeek = document.getElementById("mealPlanNextWeek");
const mealPlanGenerateShoppingBtn = document.getElementById("mealPlanGenerateShoppingBtn");

if (mealPlanPrevWeek) mealPlanPrevWeek.addEventListener("click", () => { mealPlanWeekOffset--; refreshMealPlan(); });
if (mealPlanNextWeek) mealPlanNextWeek.addEventListener("click", () => { mealPlanWeekOffset++; refreshMealPlan(); });
if (mealPlanGenerateShoppingBtn) mealPlanGenerateShoppingBtn.addEventListener("click", generateMealPlanShoppingList);

const mealPlanGrid = document.getElementById("mealPlanGrid");
if (mealPlanGrid) {
    mealPlanGrid.addEventListener("click", (e) => {
        const removeBtn = e.target.closest("[data-mp-remove]");
        if (removeBtn) removeMealPlanEntry(removeBtn.dataset.mpRemove);
    });
}

// ── Cook Log sidebar events ──────────────────────────────────
const cookLogList = document.getElementById("cookLogList");
if (cookLogList) {
    cookLogList.addEventListener("click", (e) => {
        const viewBtn = e.target.closest("[data-cook-view]");
        if (viewBtn) {
            const recipeId = viewBtn.dataset.cookView;
            const entry = cookLogCache.find((c) => String(c.recipeId) === recipeId);
            if (entry?.recipe) openModal(entry.recipe);
        }
    });
}

// ── Bulk Import ──────────────────────────────────────────────
const bulkPantryBtn = document.getElementById("bulkPantryBtn");
if (bulkPantryBtn) {
    bulkPantryBtn.addEventListener("click", async () => {
        const textarea = document.getElementById("bulkPantryInput");
        const expiryInput = document.getElementById("bulkPantryExpiry");
        if (!textarea || !expiryInput) return;

        const lines = textarea.value.split("\n").map((l) => l.trim()).filter(Boolean);
        const expiry = expiryInput.value;
        if (!lines.length) { showToast("Enter at least one ingredient"); return; }
        if (!expiry) { showToast("Please set an expiry date"); return; }

        const results = await Promise.allSettled(
            lines.map((name) => sendAuthedJson("/api/user/pantry", "POST", {
                ingredientName: name,
                quantity: 1,
                unit: "unit",
                expiryDate: expiry,
            }))
        );

        const succeeded = results.filter((r) => r.status === "fulfilled").length;
        showToast(`Added ${succeeded} of ${lines.length} items`);
        textarea.value = "";
        expiryInput.value = "";
        await refreshPantry();
    });
}

// ── CSV Export ────────────────────────────────────────────────
const downloadReportBtn = document.getElementById("downloadReportBtn");
if (downloadReportBtn) {
    downloadReportBtn.addEventListener("click", async () => {
        try {
            const [kpiData, wasteData] = await Promise.all([
                fetchAuthedJson("/api/user/metrics/kpi-summary?days=30"),
                fetchAuthedJson("/api/user/waste-logs"),
            ]);

            let csv = "PantryPal Impact Report\n\n";

            // KPI Section
            csv += "KPI Summary (Last 30 Days)\n";
            csv += "Metric,Value\n";
            const kpis = kpiData.kpis || {};
            csv += `Zero Missing Recipe %,${kpis.zeroMissingRecipePercentage || 0}\n`;
            csv += `Avg Missing per Recipe,${kpis.averageMissingIngredientsPerRecipe || 0}\n`;
            csv += `Avg Missing per Search,${kpis.averageMissingIngredientsPerSearch || 0}\n`;
            csv += `Avg Recipes per Search,${kpis.averageRecipesReturnedPerSearch || 0}\n`;
            csv += `Rescue Mode Usage %,${kpis.rescueModeUsageRate || 0}\n`;
            csv += `Expiry Priority Usage %,${kpis.prioritizeExpiryUsageRate || 0}\n`;
            csv += `Total Searches,${kpiData.totals?.totalSearches || 0}\n`;
            csv += `Total Recipes Returned,${kpiData.totals?.totalRecipesReturned || 0}\n`;

            // Waste Logs Section
            csv += "\nWaste Logs\n";
            csv += "Date,Ingredient,Quantity,Unit,Reason,Estimated Cost,Weight (g)\n";
            for (const log of (wasteData.items || [])) {
                csv += `${log.date ? new Date(log.date).toLocaleDateString() : ""},${log.ingredientName},${log.quantity},${log.unit},${log.reason},${log.estimatedCost},${log.estimatedWeightGrams}\n`;
            }

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `pantrypal-report-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            showToast("Report downloaded");
        } catch (err) {
            showToast(err.message || "Failed to download report");
        }
    });
}

// ── Theme Toggle ─────────────────────────────────────────────
function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    document.documentElement.setAttribute("data-theme", saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    showToast(`Switched to ${next} mode`);
}

const themeToggleBtn = document.getElementById("themeToggleBtn");
if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
loadTheme();

async function runDemoMode() {
    if (!isLoggedIn()) {
        openAuthModal("login");
        showToast("Log in first to load demo mode");
        return;
    }

    const proceed = window.confirm(
        "Load realistic demo data (pantry, leftovers, waste logs) and run a sample search?"
    );
    if (!proceed) return;

    const dayIso = (offset) => {
        const date = new Date();
        date.setDate(date.getDate() + offset);
        return date.toISOString().slice(0, 10);
    };

    const demoPantry = [
        { ingredientName: "chicken breast", quantity: 2, unit: "pcs", category: "meat", storageLocation: "fridge", expiryDate: dayIso(1) },
        { ingredientName: "spinach", quantity: 1, unit: "bag", category: "produce", storageLocation: "fridge", expiryDate: dayIso(2) },
        { ingredientName: "tomato", quantity: 4, unit: "pcs", category: "produce", storageLocation: "fridge", expiryDate: dayIso(3) },
        { ingredientName: "rice", quantity: 1, unit: "kg", category: "dry_goods", storageLocation: "pantry", expiryDate: dayIso(120) },
        { ingredientName: "onion", quantity: 3, unit: "pcs", category: "produce", storageLocation: "pantry", expiryDate: dayIso(8) },
        { ingredientName: "cheese", quantity: 1, unit: "block", category: "dairy", storageLocation: "fridge", expiryDate: dayIso(5) },
    ];

    const demoLeftovers = [
        { leftoverName: "roast chicken", amount: 2, unit: "portion", mustUseBy: dayIso(1), notes: "Sunday dinner leftovers" },
        { leftoverName: "boiled rice", amount: 1, unit: "portion", mustUseBy: dayIso(1), notes: "Good for stir fry" },
    ];

    const demoWasteLogs = [
        { ingredientName: "lettuce", quantity: 1, unit: "head", reason: "expired", estimatedCost: 1.2, estimatedWeightGrams: 180, date: dayIso(-2) },
        { ingredientName: "banana", quantity: 2, unit: "pcs", reason: "forgot", estimatedCost: 0.6, estimatedWeightGrams: 210, date: dayIso(-1) },
    ];

    showToast("Loading demo data...");
    await Promise.all([refreshPantry(), refreshLeftovers(), refreshWasteLogs()]);

    const pantryOps = demoPantry.map((item) => sendAuthedJson("/api/user/pantry", "POST", item));

    const activeLeftovers = new Set(
        leftoversCache
            .filter((x) => String(x.status || "").toLowerCase() === "active")
            .map((x) => normalize(x.leftoverName))
    );
    const leftoverOps = demoLeftovers
        .filter((item) => !activeLeftovers.has(normalize(item.leftoverName)))
        .map((item) => sendAuthedJson("/api/user/leftovers", "POST", item));

    const wasteOps = demoWasteLogs.map((item) => sendAuthedJson("/api/user/waste-logs", "POST", item));

    const [pantryResults, leftoverResults, wasteResults] = await Promise.all([
        Promise.allSettled(pantryOps),
        Promise.allSettled(leftoverOps),
        Promise.allSettled(wasteOps),
    ]);

    const countFulfilled = (items) => items.filter((x) => x.status === "fulfilled").length;
    const seeded = {
        pantry: countFulfilled(pantryResults),
        leftovers: countFulfilled(leftoverResults),
        wasteLogs: countFulfilled(wasteResults),
    };

    await Promise.all([
        refreshPantry(),
        refreshLeftovers(),
        refreshWasteLogs(),
        refreshImpactSummary(),
    ]);

    if (input) input.value = "chicken, rice, tomato, onion, spinach, cheese";
    if (rescueModeToggle) rescueModeToggle.checked = true;
    if (prioritizeExpiryToggle) prioritizeExpiryToggle.checked = true;
    updateFilterBadge();

    setDebug({ demoModeSeeded: seeded });
    showToast(`Demo ready: ${seeded.pantry} pantry, ${seeded.leftovers} leftovers, ${seeded.wasteLogs} waste logs`);
    await searchRecipes();
}

if (demoModeBtn) {
    demoModeBtn.addEventListener("click", () => {
        runDemoMode().catch((err) => {
            showToast(err.message || "Demo mode failed");
            setDebug({ error: "Demo mode failed", details: err.message });
        });
    });
}

// ── Expiry Notifications ─────────────────────────────────────
async function checkExpiryNotifications() {
    const banner = document.getElementById("expiryNotificationBanner");
    const bannerText = document.getElementById("expiryBannerText");
    const dailySummary = document.getElementById("dailySummary");
    const dailySummaryContent = document.getElementById("dailySummaryContent");

    if (!isLoggedIn()) return;

    try {
        const data = await fetchAuthedJson("/api/user/pantry/soon-expiring?days=2");
        if (!data.count || !data.items?.length) {
            if (banner) banner.classList.add("hidden");
            if (dailySummary) dailySummary.classList.add("hidden");
            return;
        }

        const names = data.items.map((i) => i.ingredientName).slice(0, 5);
        if (bannerText) bannerText.textContent = `${data.count} item(s) expiring within 48h: ${names.join(", ")}${data.count > 5 ? "..." : ""}`;
        if (banner) banner.classList.remove("hidden");

        // Daily summary
        if (dailySummaryContent) {
            dailySummaryContent.innerHTML = data.items.map((item) => `
                <div class="daily-summary-item">
                    <span>${escapeHtml(item.ingredientName)} (${escapeHtml(item.quantity)} ${escapeHtml(item.unit)})</span>
                    <span class="days-left">${escapeHtml(formatDaysLeft(item.expiryDate))}</span>
                </div>
            `).join("");
        }
        if (dailySummary) dailySummary.classList.remove("hidden");
    } catch {
        if (banner) banner.classList.add("hidden");
        if (dailySummary) dailySummary.classList.add("hidden");
    }
}

const dismissExpiryBanner = document.getElementById("dismissExpiryBanner");
if (dismissExpiryBanner) {
    dismissExpiryBanner.addEventListener("click", () => {
        const banner = document.getElementById("expiryNotificationBanner");
        if (banner) banner.classList.add("hidden");
    });
}

// ── Onboarding Tutorial ──────────────────────────────────────
let onboardingStep = 0;

function startOnboarding() {
    onboardingStep = 0;
    const overlay = document.getElementById("onboardingOverlay");
    if (!overlay) return;
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
    renderOnboardingStep();
}

function renderOnboardingStep() {
    const step = ONBOARDING_STEPS[onboardingStep];
    if (!step) { completeOnboarding(); return; }

    const title = document.getElementById("onboardingTitle");
    const text = document.getElementById("onboardingText");
    const progress = document.getElementById("onboardingProgress");
    const spotlight = document.querySelector(".onboarding-spotlight");
    const tooltip = document.querySelector(".onboarding-tooltip");
    const nextBtn = document.getElementById("onboardingNext");

    if (title) title.textContent = step.title;
    if (text) text.textContent = step.text;
    if (nextBtn) nextBtn.textContent = onboardingStep === ONBOARDING_STEPS.length - 1 ? "Done" : "Next";

    // Progress dots
    if (progress) {
        progress.innerHTML = ONBOARDING_STEPS.map((_, i) =>
            `<span class="onboarding-dot ${i === onboardingStep ? "active" : ""}"></span>`
        ).join("");
    }

    // Position spotlight and tooltip
    const target = document.querySelector(step.target);
    if (target && spotlight && tooltip) {
        const rect = target.getBoundingClientRect();
        const pad = 8;
        spotlight.style.top = `${rect.top - pad}px`;
        spotlight.style.left = `${rect.left - pad}px`;
        spotlight.style.width = `${rect.width + pad * 2}px`;
        spotlight.style.height = `${rect.height + pad * 2}px`;

        // Position tooltip — prefer below, flip above if it would go off-screen
        const tooltipH = 200; // approximate height
        const spaceBelow = window.innerHeight - rect.bottom - 16;
        if (spaceBelow >= tooltipH) {
            tooltip.style.top = `${rect.bottom + 16}px`;
        } else {
            tooltip.style.top = `${Math.max(16, rect.top - tooltipH - 16)}px`;
        }
        tooltip.style.left = `${Math.max(16, Math.min(rect.left, window.innerWidth - 340))}px`;
    }
}

function completeOnboarding() {
    const overlay = document.getElementById("onboardingOverlay");
    if (overlay) {
        overlay.classList.add("hidden");
        overlay.setAttribute("aria-hidden", "true");
    }
    localStorage.setItem(ONBOARDING_KEY, "true");
}

const onboardingSkip = document.getElementById("onboardingSkip");
const onboardingNextBtn = document.getElementById("onboardingNext");
const onboardingOverlayEl = document.getElementById("onboardingOverlay");

if (onboardingSkip) onboardingSkip.addEventListener("click", completeOnboarding);
if (onboardingNextBtn) {
    onboardingNextBtn.addEventListener("click", () => {
        onboardingStep++;
        if (onboardingStep >= ONBOARDING_STEPS.length) completeOnboarding();
        else renderOnboardingStep();
    });
}
// Click anywhere on the dark overlay area to dismiss
if (onboardingOverlayEl) {
    onboardingOverlayEl.addEventListener("click", (e) => {
        if (e.target === onboardingOverlayEl) completeOnboarding();
    });
}

// ── Feature Flags ────────────────────────────────────────────
function isFeatureEnabled(flagName, defaultValue = false) {
    if (featureFlagsCache.hasOwnProperty(flagName)) return Boolean(featureFlagsCache[flagName]);
    try {
        const localFlags = JSON.parse(localStorage.getItem(FEATURE_FLAGS_KEY) || "{}");
        if (localFlags.hasOwnProperty(flagName)) return Boolean(localFlags[flagName]);
    } catch { /* ignore */ }
    return defaultValue;
}

// ── Survey Modal ─────────────────────────────────────────────
function openSurveyModal() {
    const modal = document.getElementById("surveyModal");
    if (modal) {
        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
    }
}

function closeSurveyModal() {
    const modal = document.getElementById("surveyModal");
    if (modal) {
        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
    }
}

const closeSurveyBtn = document.getElementById("closeSurvey");
if (closeSurveyBtn) closeSurveyBtn.addEventListener("click", closeSurveyModal);

const submitSurveyBtn = document.getElementById("submitSurvey");
if (submitSurveyBtn) {
    submitSurveyBtn.addEventListener("click", async () => {
        const q1 = document.getElementById("surveyQ1")?.value || "";
        const q2 = document.getElementById("surveyQ2")?.value || "";
        const q3 = Number(document.getElementById("surveyQ3")?.value || 0);

        if (!q1 || !q2 || !q3) {
            showToast("Please answer all questions");
            return;
        }

        const ok = await submitFeedback({ q1, q2, q3 });
        if (ok) {
            localStorage.setItem(SURVEY_DONE_KEY, "true");
            closeSurveyModal();
        }
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (modalOverlay && !modalOverlay.classList.contains("hidden")) closeModal();
        if (authModal && !authModal.classList.contains("hidden")) closeAuth();
        if (shoppingDrawer && !shoppingDrawer.classList.contains("hidden")) closeShoppingDrawerFn();
        const surveyModal = document.getElementById("surveyModal");
        if (surveyModal && !surveyModal.classList.contains("hidden")) closeSurveyModal();
        const onboardingOverlay = document.getElementById("onboardingOverlay");
        if (onboardingOverlay && !onboardingOverlay.classList.contains("hidden")) completeOnboarding();
        if (mealPlanPicker && !mealPlanPicker.classList.contains("hidden")) {
            mealPlanPicker.classList.add("hidden");
            mealPlanPicker.setAttribute("aria-hidden", "true");
        }
    }
});

if (authModal) {
    authModal.addEventListener("click", (e) => {
        if (e.target === authModal) closeAuth();
    });
}

async function initAuth() {
    const session = getSession();

    if (!session?.token) {
        applyAuthView();
        return;
    }

    try {
        const data = await fetchJson("/api/auth/me", {
            headers: {
                ...authHeaders(),
            },
        });

        setSession({
            ...session,
            user: data.user,
        });
    } catch {
        clearSession();
    }

    applyAuthView();
}

initAuth();
startPublicBannerRotation();

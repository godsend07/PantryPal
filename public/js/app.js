/* PantryPal frontend */

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

let featureFlagsCache = {};

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
const themeToggleBtn = document.getElementById("themeToggleBtn");
if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
loadTheme();

if (demoModeBtn) {
    demoModeBtn.addEventListener("click", () => {
        runDemoMode().catch((err) => {
            showToast(err.message || "Demo mode failed");
            setDebug({ error: "Demo mode failed", details: err.message });
        });
    });
}

// ── Expiry Notifications ─────────────────────────────────────
const dismissExpiryBanner = document.getElementById("dismissExpiryBanner");
if (dismissExpiryBanner) {
    dismissExpiryBanner.addEventListener("click", () => {
        const banner = document.getElementById("expiryNotificationBanner");
        if (banner) banner.classList.add("hidden");
    });
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

initAuth();
startPublicBannerRotation();

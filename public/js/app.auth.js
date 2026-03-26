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

let onboardingStep = 0;

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

    if (progress) {
        progress.innerHTML = ONBOARDING_STEPS.map((_, i) =>
            `<span class="onboarding-dot ${i === onboardingStep ? "active" : ""}"></span>`
        ).join("");
    }

    const target = document.querySelector(step.target);
    if (target && spotlight && tooltip) {
        const rect = target.getBoundingClientRect();
        const pad = 8;
        spotlight.style.top = `${rect.top - pad}px`;
        spotlight.style.left = `${rect.left - pad}px`;
        spotlight.style.width = `${rect.width + pad * 2}px`;
        spotlight.style.height = `${rect.height + pad * 2}px`;

        const tooltipH = 200;
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

function isFeatureEnabled(flagName, defaultValue = false) {
    if (featureFlagsCache.hasOwnProperty(flagName)) return Boolean(featureFlagsCache[flagName]);
    try {
        const localFlags = JSON.parse(localStorage.getItem(FEATURE_FLAGS_KEY) || "{}");
        if (localFlags.hasOwnProperty(flagName)) return Boolean(localFlags[flagName]);
    } catch { /* ignore */ }
    return defaultValue;
}

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

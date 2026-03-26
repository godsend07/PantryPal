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

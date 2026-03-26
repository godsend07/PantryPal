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

function inferDifficulty(recipe) {
    const ingredientCount = (recipe.strIngredients || []).length;
    const instructionLength = (recipe.strInstructions || "").length;

    if (ingredientCount > 12 || instructionLength > 500) return { level: "hard", label: "Hard" };
    if (ingredientCount > 6 || instructionLength > 250) return { level: "medium", label: "Medium" };
    return { level: "easy", label: "Easy" };
}

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

    const seasonalCount = countSeasonalIngredients(recipe);
    if (seasonalCount >= 2) {
        html += `<span class="badge badge-seasonal">In Season</span>`;
    }

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

function showLoadingSkeleton() {
    const skeleton = document.getElementById("loadingSkeleton");
    const noResults = document.getElementById("noResults");

    if (skeleton) skeleton.classList.add("show");
    if (noResults) noResults.classList.remove("show");
}

function hideLoadingSkeleton() {
    const skeleton = document.getElementById("loadingSkeleton");
    if (skeleton) skeleton.classList.remove("show");
}

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

    if (modalUsed) {
        if (recipe.used && recipe.used.length > 0) {
            modalUsed.innerHTML = recipe.used
                .map((ing) => `<span class="ingredient-tag ingredient-used">${escapeHtml(ing)}</span>`)
                .join(" ");
        } else {
            modalUsed.textContent = "None";
        }
    }

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

    addRecentlyViewed(recipe);
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.add("hidden");
        modalOverlay.setAttribute("aria-hidden", "true");
    }
    modalCurrentRecipeId = null;
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

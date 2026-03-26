/* PantryPal shared frontend helpers */

function escapeHtml(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(String(str ?? "")));
    return div.innerHTML;
}

function normalize(s) {
    return String(s || "").toLowerCase().trim();
}

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

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
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
    return Boolean(session?.token);
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

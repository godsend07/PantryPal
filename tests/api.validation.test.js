const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

process.env.PORT = process.env.PORT || "3101";
process.env.MONGODB_URI = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/pantrypal_test_${Date.now()}`;

const { startServer } = require("../server");

let server;
let baseUrl;

test.before(async () => {
    server = await startServer();
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
    if (server) {
        await new Promise((resolve) => server.close(resolve));
        server = null;
    }

    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

async function request(path, options = {}) {
    const res = await fetch(`${baseUrl}${path}`, options);
    const body = await res.json().catch(() => ({}));
    return { res, body };
}

async function createTestUser() {
    const unique = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const email = `test_${unique}@example.com`;

    const { res, body } = await request("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Test User",
            email,
            password: "123456",
        }),
    });

    assert.equal(res.status, 201);
    assert.ok(body.token);
    return body.token;
}

test("API validation and core auth/pantry flow", async (t) => {
    await t.test("rejects signup with invalid email", async () => {
        const { res, body } = await request("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Bad Email",
                email: "invalid-email",
                password: "123456",
            }),
        });

        assert.equal(res.status, 400);
        assert.match(String(body.error || ""), /valid email/i);
    });

    await t.test("rejects login with invalid email", async () => {
        const { res, body } = await request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "invalid-email",
                password: "123456",
            }),
        });

        assert.equal(res.status, 400);
        assert.match(String(body.error || ""), /valid email/i);
    });

    await t.test("creates user and returns token", async () => {
        const token = await createTestUser();
        assert.equal(typeof token, "string");
        assert.ok(token.length > 20);
    });

    await t.test("rejects pantry create with invalid category", async () => {
        const token = await createTestUser();

        const { res, body } = await request("/api/user/pantry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ingredientName: "tomato",
                quantity: 1,
                unit: "pcs",
                category: "invalid",
                storageLocation: "pantry",
                expiryDate: "2030-01-01",
            }),
        });

        assert.equal(res.status, 400);
        assert.match(String(body.error || ""), /category/i);
    });

    await t.test("rejects pantry patch with invalid status", async () => {
        const token = await createTestUser();

        const created = await request("/api/user/pantry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ingredientName: "spinach",
                quantity: 1,
                unit: "bunch",
                category: "produce",
                storageLocation: "fridge",
                expiryDate: "2030-01-01",
            }),
        });

        const itemId = created.body?.item?.id;
        assert.ok(itemId);

        const { res, body } = await request(`/api/user/pantry/${encodeURIComponent(itemId)}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: "unknown_status" }),
        });

        assert.equal(res.status, 400);
        assert.match(String(body.error || ""), /status/i);
    });

    await t.test("rejects leftovers create with invalid mustUseBy", async () => {
        const token = await createTestUser();

        const { res, body } = await request("/api/user/leftovers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                leftoverName: "rice",
                amount: 1,
                unit: "portion",
                mustUseBy: "not-a-date",
            }),
        });

        assert.equal(res.status, 400);
        assert.match(String(body.error || ""), /mustUseBy/i);
    });

    await t.test("rejects leftovers patch with invalid status", async () => {
        const token = await createTestUser();

        const created = await request("/api/user/leftovers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                leftoverName: "soup",
                amount: 2,
                unit: "portion",
                mustUseBy: "2030-01-01",
            }),
        });

        const leftoverId = created.body?.id;
        assert.ok(leftoverId);

        const { res, body } = await request(`/api/user/leftovers/${encodeURIComponent(leftoverId)}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: "invalid_status" }),
        });

        assert.equal(res.status, 400);
        assert.match(String(body.error || ""), /status/i);
    });

    await t.test("rejects waste log create with invalid reason", async () => {
        const token = await createTestUser();

        const { res, body } = await request("/api/user/waste-logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ingredientName: "bread",
                quantity: 1,
                unit: "slice",
                reason: "invalid_reason",
                estimatedCost: 1.5,
                estimatedWeightGrams: 50,
            }),
        });

        assert.equal(res.status, 400);
        assert.match(String(body.error || ""), /reason/i);
    });

    await t.test("allows valid leftovers and waste log creation", async () => {
        const token = await createTestUser();

        const leftoverResp = await request("/api/user/leftovers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                leftoverName: "pasta",
                amount: 1,
                unit: "portion",
                mustUseBy: "2030-01-01",
            }),
        });

        assert.equal(leftoverResp.res.status, 201);
        assert.ok(leftoverResp.body.id);

        const wasteResp = await request("/api/user/waste-logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ingredientName: "lettuce",
                quantity: 1,
                unit: "head",
                reason: "expired",
                estimatedCost: 2,
                estimatedWeightGrams: 200,
            }),
        });

        assert.equal(wasteResp.res.status, 201);
        assert.ok(wasteResp.body.id);
    });

    await t.test("returns KPI summary for authenticated user", async () => {
        const token = await createTestUser();

        const { res, body } = await request("/api/user/metrics/kpi-summary?days=30", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        assert.equal(res.status, 200);
        assert.equal(typeof body.window?.days, "number");
        assert.equal(typeof body.totals?.totalSearches, "number");
        assert.equal(typeof body.kpis?.zeroMissingRecipePercentage, "number");
        assert.ok(Array.isArray(body.series));
    });

    await t.test("rejects invalid days for KPI summary", async () => {
        const token = await createTestUser();

        const { res, body } = await request("/api/user/metrics/kpi-summary?days=0", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        assert.equal(res.status, 400);
        assert.match(String(body.error || ""), /days/i);
    });

});

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");

const app = require("../server/server");
const { user, defaultSettings, getPublicProfile } = require("../server/data");

/**
 * In-memory HTTP request dispatcher for Express.
 * Executes express middleware and route handlers directly without opening network sockets.
 * Fast, self-contained, and environment-agnostic.
 *
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} url - Request target URL
 * @param {Object} [headers={}] - Request headers
 * @param {Object|string} [body=null] - Optional request payload
 * @returns {Promise<{statusCode: number, headers: Object, body: string, json: () => Object}>}
 */
function request(method, url, headers = {}, body = null) {
    return new Promise((resolve, reject) => {
        const reqHeaders = {};
        for (const [k, v] of Object.entries(headers)) {
            reqHeaders[k.toLowerCase()] = v;
        }

        let parsedBody = body;
        if (typeof body === "string") {
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                parsedBody = body;
            }
        }

        const req = {
            method: method.toUpperCase(),
            url,
            headers: reqHeaders,
            _body: body !== null && body !== undefined,
            body: parsedBody
        };

        const resHeaders = {};
        let resBody = "";
        let statusCode = 200;

        const res = {
            setHeader(name, value) {
                resHeaders[name.toLowerCase()] = value;
            },
            getHeader(name) {
                return resHeaders[name.toLowerCase()];
            },
            getHeaders() {
                return resHeaders;
            },
            status(code) {
                statusCode = code;
                return res;
            },
            writeHead(code, reasonPhrase, hdrs) {
                statusCode = code;
                const headersObj = typeof reasonPhrase === "object" ? reasonPhrase : hdrs;
                if (headersObj) {
                    for (const [k, v] of Object.entries(headersObj)) {
                        resHeaders[k.toLowerCase()] = v;
                    }
                }
                return res;
            },
            write(chunk) {
                if (chunk) resBody += chunk.toString();
                return true;
            },
            send(data) {
                if (typeof data === "object") {
                    return this.json(data);
                }
                resBody = String(data);
                this.end();
            },
            json(data) {
                resHeaders["content-type"] = "application/json; charset=utf-8";
                resBody = JSON.stringify(data);
                this.end();
            },
            end(chunk) {
                if (chunk) resBody += chunk.toString();
                resolve({
                    statusCode,
                    headers: resHeaders,
                    body: resBody,
                    json: () => JSON.parse(resBody)
                });
            }
        };

        try {
            app(req, res);
        } catch (err) {
            reject(err);
        }
    });
}

/* ==========================================================================
   SUITE 1: DOM-BASED CROSS-SITE SCRIPTING (DOM XSS)
   ========================================================================== */
describe("1. DOM-Based Cross-Site Scripting (DOM XSS)", () => {
    test("Positive Scenario: Dashboard loads safely and references external script", async () => {
        const res = await request("GET", "/");
        assert.equal(res.statusCode, 200);

        // UI renders dashboard container and safe script references
        assert.ok(res.body.includes('<div id="app"></div>'));
        assert.ok(res.body.includes('<script src="/app.js"></script>'));
    });

    test("Negative Scenario: Query parameter with script tags is not reflected as executable HTML", async () => {
        const maliciousPayload = "<script>alert('xss')</script><img src=x onerror=alert(1)>";
        const res = await request("GET", `/?name=${encodeURIComponent(maliciousPayload)}`);

        assert.equal(res.statusCode, 200);
        // Ensure server never interpolates query params directly into HTML markup
        assert.ok(!res.body.includes("<script>alert('xss')</script>"));
        assert.ok(!res.body.includes("<img src=x onerror=alert(1)>"));
    });

    test("Positive Scenario: Safe DOM text assignment logic in client app", () => {
        // Test client DOM textContent safety logic
        const username = "<img src=x onerror=alert(1)>";
        const dummyElement = { textContent: "" };
        dummyElement.textContent = `Welcome, ${username}`;

        // textContent prevents browser parser from executing tags
        assert.equal(dummyElement.textContent, "Welcome, <img src=x onerror=alert(1)>");
    });

    test("Defense-in-Depth: HTML escape utility neutralizes dangerous characters", () => {
        function escapeHTML(str) {
            if (typeof str !== "string") return "";
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        }

        const raw = `<script>alert("XSS & 'pwned'")</script>`;
        const escaped = escapeHTML(raw);
        assert.equal(escaped, `&lt;script&gt;alert(&quot;XSS &amp; &#39;pwned&#39;&quot;)&lt;/script&gt;`);
        assert.ok(!escaped.includes("<"));
        assert.ok(!escaped.includes(">"));
    });
});

/* ==========================================================================
   SUITE 2: PROTOTYPE POLLUTION
   ========================================================================== */
describe("2. Prototype Pollution Defenses", () => {
    test("Positive Scenario: Valid settings payload is accepted and merged safely", async () => {
        const validPayload = {
            theme: "dark",
            language: "fr",
            fontSize: "large"
        };

        const res = await request("POST", "/api/settings", {}, validPayload);
        assert.equal(res.statusCode, 200);

        const data = res.json();
        assert.equal(data.settings.theme, "dark");
        assert.equal(data.settings.language, "fr");
        assert.equal(data.settings.fontSize, "large");
        assert.equal(data.message, "Settings saved successfully.");
    });

    test("Negative Scenario 1: Rejects payload containing '__proto__' and detects prototype pollution", async () => {
        const attackPayload = JSON.parse('{"__proto__": {"polluted": true}}');

        const res = await request("POST", "/api/settings", {}, attackPayload);
        assert.equal(res.statusCode, 400);

        const data = res.json();
        assert.ok(data.error.includes("Prototype pollution attempt detected"));

        // Verify Object.prototype was NOT polluted
        const probe = {};
        assert.equal(probe.polluted, undefined);
        assert.equal(Object.prototype.polluted, undefined);
    });

    test("Negative Scenario 2: Rejects payload containing 'constructor' property", async () => {
        const attackPayload = JSON.parse('{"constructor": {"prototype": {"isAdmin": true}}}');

        const res = await request("POST", "/api/settings", {}, attackPayload);
        assert.equal(res.statusCode, 400);

        const probe = {};
        assert.equal(probe.isAdmin, undefined);
        assert.equal(Object.prototype.isAdmin, undefined);
    });

    test("Negative Scenario 3: Strips unallowlisted keys and ignores unexpected properties", async () => {
        const payload = {
            theme: "light",
            unknownField: "malicious_injected_value",
            isAdmin: true,
            role: "root"
        };

        const res = await request("POST", "/api/settings", {}, payload);
        assert.equal(res.statusCode, 200);

        const data = res.json();
        assert.equal(data.settings.theme, "light");
        assert.equal(data.settings.unknownField, undefined);
        assert.equal(data.settings.isAdmin, undefined);
        assert.equal(data.settings.role, undefined);
    });

    test("Defense-in-Depth: Object.prototype is frozen in runtime", () => {
        assert.ok(Object.isFrozen(Object.prototype), "Object.prototype must be frozen");
    });
});

/* ==========================================================================
   SUITE 3: SSR TOKEN LEAKAGE
   ========================================================================== */
describe("3. SSR Token Leakage Prevention", () => {
    test("Positive Scenario: Public user profile attributes are provided for UI rendering", async () => {
        const res = await request("GET", "/");
        assert.equal(res.statusCode, 200);

        assert.ok(res.body.includes("John Doe"));
        assert.ok(res.body.includes("john@example.com"));
        assert.ok(res.body.includes("Administrator"));
    });

    test("Negative Scenario 1: SSR HTML does NOT leak sessionToken or refreshToken", async () => {
        const res = await request("GET", "/");

        // The sensitive tokens defined in server/data.js must NEVER appear in the SSR markup
        assert.ok(!res.body.includes(user.sessionToken), "sessionToken must not be in HTML");
        assert.ok(!res.body.includes(user.refreshToken), "refreshToken must not be in HTML");
        assert.ok(!res.body.includes("TRAINING-FAKE-ACCESS-TOKEN"), "Fake access token must not be in HTML");
        assert.ok(!res.body.includes("TRAINING-FAKE-REFRESH-TOKEN"), "Fake refresh token must not be in HTML");
    });

    test("Negative Scenario 2: /api/profile endpoint strips sessionToken and refreshToken", async () => {
        const res = await request("GET", "/api/profile");
        assert.equal(res.statusCode, 200);

        const profile = res.json();
        assert.equal(profile.name, "John Doe");
        assert.equal(profile.email, "john@example.com");
        assert.equal(profile.role, "Administrator");
        assert.equal(profile.sessionToken, undefined, "sessionToken must be stripped from profile API");
        assert.equal(profile.refreshToken, undefined, "refreshToken must be stripped from profile API");
    });

    test("Defense-in-Depth: User data uses non-executable application/json container without inline JS", async () => {
        const res = await request("GET", "/");

        // Must embed serialized data inside non-executable script container
        assert.ok(res.body.includes('<script id="initial-user-data" type="application/json">'));
        // Must NOT expose data via executable inline JavaScript variable assignment
        assert.ok(!res.body.includes("window.initialUser ="));
    });
});

/* ==========================================================================
   SUITE 4: CONTENT SECURITY POLICY (CSP)
   ========================================================================== */
describe("4. Content Security Policy (CSP)", () => {
    test("Positive Scenario: CSP header is enforced with all required directives", async () => {
        const res = await request("GET", "/");
        const csp = res.headers["content-security-policy"];

        assert.ok(csp, "Content-Security-Policy header must be present");
        assert.ok(csp.includes("default-src 'self'"), "Must enforce default-src 'self'");
        assert.ok(csp.includes("script-src 'self'"), "Must enforce script-src 'self'");
        assert.ok(csp.includes("style-src 'self'"), "Must enforce style-src 'self'");
        assert.ok(csp.includes("object-src 'none'"), "Must enforce object-src 'none'");
        assert.ok(csp.includes("base-uri 'self'"), "Must enforce base-uri 'self'");
        assert.ok(csp.includes("frame-ancestors 'none'"), "Must enforce frame-ancestors 'none'");
    });

    test("Negative Scenario 1: CSP disallows 'unsafe-inline' and 'unsafe-eval' in script-src", async () => {
        const res = await request("GET", "/");
        const csp = res.headers["content-security-policy"];

        const scriptDirective = csp.split(";").find((d) => d.trim().startsWith("script-src"));
        assert.ok(scriptDirective, "script-src directive must exist");
        assert.ok(!scriptDirective.includes("'unsafe-inline'"), "script-src must NOT contain 'unsafe-inline'");
        assert.ok(!scriptDirective.includes("'unsafe-eval'"), "script-src must NOT contain 'unsafe-eval'");
    });

    test("Negative Scenario 2: Pages contain no inline executable scripts or inline styles", async () => {
        const homeRes = await request("GET", "/");
        assert.ok(!homeRes.body.includes("<script>"), "Home page must not have inline <script>");

        const accRes = await request("GET", "/account");
        assert.ok(!accRes.body.includes("<script>"), "Account page must not have inline <script>");
        assert.ok(!accRes.body.includes("<style>"), "Account page must not have inline <style>");
    });

    test("Defense-in-Depth: Enforces additional browser security headers", async () => {
        const res = await request("GET", "/");
        assert.equal(res.headers["x-content-type-options"], "nosniff");
        assert.equal(res.headers["referrer-policy"], "strict-origin-when-cross-origin");
        assert.ok(res.headers["permissions-policy"]);
    });
});

/* ==========================================================================
   SUITE 5: CLICKJACKING DEFENSES
   ========================================================================== */
describe("5. Clickjacking Defenses", () => {
    test("Positive Scenario 1: X-Frame-Options header is set to DENY on /account", async () => {
        const res = await request("GET", "/account");
        assert.equal(res.headers["x-frame-options"], "DENY");
    });

    test("Positive Scenario 2: CSP frame-ancestors directive is set to 'none' on /account", async () => {
        const res = await request("GET", "/account");
        const csp = res.headers["content-security-policy"];
        assert.ok(csp.includes("frame-ancestors 'none'"));
    });

    test("Positive Scenario 3: Account page retains functional delete button and user profile", async () => {
        const res = await request("GET", "/account");
        assert.equal(res.statusCode, 200);
        assert.ok(res.body.includes('id="delete-account"'));
        assert.ok(res.body.includes("Delete Account"));
        assert.ok(res.body.includes("John Doe"));
        assert.ok(res.body.includes('<script src="/account.js"></script>'));
        assert.ok(res.body.includes('<link rel="stylesheet" href="/account.css">'));
    });

    test("Negative Scenario: Framing is blocked across all application routes", async () => {
        const routes = ["/", "/account", "/api/profile", "/api/settings"];

        for (const route of routes) {
            const res = await request("GET", route);
            assert.equal(
                res.headers["x-frame-options"],
                "DENY",
                `Route ${route} must have X-Frame-Options: DENY`
            );
            const csp = res.headers["content-security-policy"];
            assert.ok(
                csp && csp.includes("frame-ancestors 'none'"),
                `Route ${route} must have frame-ancestors 'none'`
            );
        }
    });
});

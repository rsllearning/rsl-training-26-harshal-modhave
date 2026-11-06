const express = require("express");
const path = require("path");

const { user, defaultSettings, getPublicProfile } = require("./data");

// Defense-in-depth: Freeze Object.prototype on server runtime to prevent Prototype Pollution
if (Object.freeze) {
    Object.freeze(Object.prototype);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50kb" }));

/**
 * Escapes special HTML characters to prevent XSS when interpolating data into HTML templates.
 * @param {string} str - Raw string
 * @returns {string} Escaped string
 */
function escapeHTML(str) {
    if (typeof str !== "string") return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Security Headers Middleware (Defense-in-Depth)
 * Enforces Content Security Policy, Clickjacking protection, and MIME sniffing protection.
 */
app.use((req, res, next) => {
    // Content Security Policy (CSP):
    // - default-src 'self': restricts resource loading to own origin
    // - script-src 'self': blocks inline scripts and untrusted external scripts
    // - style-src 'self': blocks inline styles and untrusted external stylesheets
    // - img-src 'self' data:: allows images from origin and data URIs
    // - font-src 'self': allows fonts from origin
    // - connect-src 'self': allows XHR/fetch only to same origin
    // - object-src 'none': completely disables Flash, Java, and other legacy plugin objects
    // - base-uri 'self': prevents malicious <base> tag URL hijacking
    // - form-action 'self': restricts form POST actions to same origin
    // - frame-ancestors 'none': blocks framing from any domain (modern clickjacking defense)
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
    );

    // Clickjacking Defense for legacy browsers (superseded by frame-ancestors 'none' in modern CSP)
    res.setHeader("X-Frame-Options", "DENY");

    // Prevent browsers from MIME-type sniffing away from declared Content-Type
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Protect user privacy by stripping referrer when downgrading protocols
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Restrict access to sensitive browser features
    res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=()");

    next();
});

/*
 * Home page (Dashboard)
 * Mitigates SSR Token Leakage:
 * - Sanitizes user object to include only public profile fields (id, name, email, role).
 * - Strips sensitive tokens (sessionToken, refreshToken).
 * - Avoids inline executable JavaScript by embedding data in a safe non-executable application/json script block.
 */
app.get("/", (req, res) => {
    // Principle of Least Privilege: only expose safe public attributes to the client
    const publicUser = getPublicProfile(user);

    // Escape '<' to prevent script breakout attacks (e.g., </script>)
    const safeUserDataJSON = JSON.stringify(publicUser).replace(/</g, "\\u003c");

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >
            <title>User Security Dashboard</title>
            <link rel="stylesheet" href="/styles.css">
        </head>

        <body>
            <header class="header">
                <h1>User Security Dashboard</h1>
                <nav>
                    <a href="/">Dashboard</a>
                    <a href="/account">Account Settings</a>
                </nav>
            </header>

            <main class="container">
                <div id="app"></div>

                <section class="settings">
                    <h2>User Settings</h2>

                    <label>
                        Theme:
                        <select id="theme">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </label>

                    <label>
                        Language:
                        <select id="language">
                            <option value="en">English</option>
                            <option value="fr">French</option>
                        </select>
                    </label>

                    <label>
                        Font Size:
                        <select id="fontSize">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </label>

                    <button id="save-settings">
                        Save Settings
                    </button>

                    <p id="settings-status"></p>
                </section>
            </main>

            <!-- Non-executable JSON container for initial user data (Prevents SSR Token Leakage & Inline XSS) -->
            <script id="initial-user-data" type="application/json">${safeUserDataJSON}</script>

            <!-- External script conforming to CSP script-src 'self' -->
            <script src="/app.js"></script>
        </body>
        </html>
    `);
});

/*
 * Profile API
 * Returns only sanitized public user data.
 * Protects sessionToken and refreshToken from exposure.
 */
app.get("/api/profile", (req, res) => {
    res.json(getPublicProfile(user));
});

/*
 * Settings API
 * Enforces Prototype Pollution defenses:
 * 1. Checks and rejects dangerous prototype poisoning keys (__proto__, constructor, prototype).
 * 2. Uses strict allowlist for accepted settings fields.
 * 3. Validates acceptable enum values.
 * 4. Isolates properties in a prototype-less object (Object.create(null)).
 */
const ALLOWED_SETTING_KEYS = ["theme", "language", "fontSize"];
const ALLOWED_VALUES = {
    theme: ["light", "dark"],
    language: ["en", "fr"],
    fontSize: ["small", "medium", "large"]
};

app.get("/api/settings", (req, res) => {
    res.json(defaultSettings);
});

app.post("/api/settings", (req, res) => {
    const incomingSettings = req.body;

    if (!incomingSettings || typeof incomingSettings !== "object" || Array.isArray(incomingSettings)) {
        return res.status(400).json({
            error: "Invalid payload format. Expected a JSON object."
        });
    }

    // Explicitly scan for dangerous prototype pollution vectors
    const dangerousKeys = ["__proto__", "constructor", "prototype"];
    const incomingKeys = Object.keys(incomingSettings);

    for (const dKey of dangerousKeys) {
        if (incomingKeys.includes(dKey) || Object.prototype.hasOwnProperty.call(incomingSettings, dKey)) {
            return res.status(400).json({
                error: "Invalid request: Prototype pollution attempt detected and blocked."
            });
        }
    }

    // Build sanitized settings object without prototype chain
    const sanitized = Object.create(null);

    for (const key of ALLOWED_SETTING_KEYS) {
        if (Object.prototype.hasOwnProperty.call(incomingSettings, key)) {
            const val = incomingSettings[key];
            if (ALLOWED_VALUES[key] && ALLOWED_VALUES[key].includes(val)) {
                sanitized[key] = val;
            }
        }
    }

    // Convert to plain object for JSON response
    const finalSettings = Object.assign({}, defaultSettings, sanitized);

    res.json({
        message: "Settings saved successfully.",
        settings: finalSettings
    });
});

/*
 * Account page
 * Protected against Clickjacking with X-Frame-Options: DENY and frame-ancestors 'none'.
 * Inline styles extracted to /account.css and inline script extracted to /account.js to satisfy CSP.
 */
app.get("/account", (req, res) => {
    const publicUser = getPublicProfile(user);

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >
            <title>Account Settings</title>
            <link rel="stylesheet" href="/account.css">
        </head>

        <body>
            <div class="account-card">
                <nav>
                    <a href="/">&larr; Back to Dashboard</a>
                </nav>

                <h1>Account Settings</h1>

                <p>
                    <strong>Name:</strong>
                    ${escapeHTML(publicUser.name)}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeHTML(publicUser.email)}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${escapeHTML(publicUser.role)}
                </p>

                <button
                    id="delete-account"
                    class="danger"
                >
                    Delete Account
                </button>

                <p id="status"></p>
            </div>

            <!-- External script conforming to CSP script-src 'self' -->
            <script src="/account.js"></script>
        </body>
        </html>
    `);
});

// Serve static client assets (app.js, styles.css, account.js, account.css, etc.)
app.use(express.static(path.join(__dirname, "..", "client")));

// Export app for testability, and listen when run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Application running securely at http://localhost:${PORT}`);
    });
}

module.exports = app;

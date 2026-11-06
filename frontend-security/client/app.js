// Defense-in-depth: Freeze Object.prototype on client runtime
if (Object.freeze) {
    Object.freeze(Object.prototype);
}

/**
 * Escapes HTML characters in an untrusted string as a defense-in-depth utility.
 * @param {string} str - Raw untrusted input
 * @returns {string} Escaped string safe for HTML contexts
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
 * Safely retrieves initial user data from the non-executable application/json script block.
 * Eliminates reliance on inline executable scripts and mitigates SSR token leakage.
 * @returns {Object} User profile data
 */
function getInitialUser() {
    try {
        const scriptElem = document.getElementById("initial-user-data");
        if (scriptElem && scriptElem.textContent) {
            return JSON.parse(scriptElem.textContent);
        }
    } catch (e) {
        console.warn("Failed to parse initial user data:", e);
    }
    return window.initialUser || null;
}

const initialUser = getInitialUser();
const app = document.getElementById("app");

// Extract user name from URL query parameter (Untrusted Source)
const params = new URLSearchParams(window.location.search);
const rawUsername = params.get("name");

// Determine username: query param takes precedence if present, else initialUser name, else fallback
const username = (rawUsername && rawUsername.trim()) || initialUser?.name || "Guest";
const userEmail = initialUser?.email || "Unknown";
const userRole = initialUser?.role || "User";

/**
 * Renders the profile card using safe DOM manipulation APIs.
 * Prevents DOM-Based XSS by using textContent instead of innerHTML.
 */
function renderProfile() {
    if (!app) return;

    // Build DOM elements programmatically (Safe DOM manipulation)
    const profileCard = document.createElement("section");
    profileCard.className = "profile-card";

    const heading = document.createElement("h2");
    heading.textContent = `Welcome, ${username}`;

    const emailP = document.createElement("p");
    emailP.textContent = `Email: ${userEmail}`;

    const roleP = document.createElement("p");
    roleP.textContent = `Role: ${userRole}`;

    profileCard.appendChild(heading);
    profileCard.appendChild(emailP);
    profileCard.appendChild(roleP);

    // Clear existing content and attach safe DOM tree
    app.replaceChildren(profileCard);
}

renderProfile();

/**
 * Allowed settings configuration keys (Allowlist approach).
 */
const ALLOWED_SETTING_KEYS = Object.freeze(["theme", "language", "fontSize"]);

/**
 * Allowed enum values for settings fields.
 */
const ALLOWED_VALUES = Object.freeze({
    theme: ["light", "dark"],
    language: ["en", "fr"],
    fontSize: ["small", "medium", "large"]
});

/**
 * Safely processes and sanitizes user settings before transmission.
 * Prevents Prototype Pollution by:
 * 1. Blocking prototype poisoning keys (__proto__, constructor, prototype).
 * 2. Creating an isolated dictionary object with Object.create(null).
 * 3. Enforcing a strict key allowlist.
 * 4. Verifying property ownership with Object.hasOwn.
 *
 * @param {Object} userSettings - Incoming settings from UI or input
 * @returns {Object} Sanitized settings object
 */
function prepareSettings(userSettings) {
    if (!userSettings || typeof userSettings !== "object") {
        return {};
    }

    // Create a prototype-less dictionary to prevent prototype chain pollution
    const safeSettings = Object.create(null);

    for (const key of ALLOWED_SETTING_KEYS) {
        // Guard against dangerous prototype manipulation keys
        if (key === "__proto__" || key === "constructor" || key === "prototype") {
            continue;
        }

        if (Object.hasOwn(userSettings, key)) {
            const rawVal = userSettings[key];
            const allowed = ALLOWED_VALUES[key];
            if (allowed && allowed.includes(rawVal)) {
                safeSettings[key] = rawVal;
            }
        }
    }

    // Convert back to plain object for JSON serialization
    return Object.assign({}, safeSettings);
}

const saveButton = document.getElementById("save-settings");
const statusElement = document.getElementById("settings-status");

if (saveButton && statusElement) {
    saveButton.addEventListener("click", async () => {
        const theme = document.getElementById("theme")?.value;
        const language = document.getElementById("language")?.value;
        const fontSize = document.getElementById("fontSize")?.value;

        const settings = prepareSettings({
            theme,
            language,
            fontSize
        });

        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) {
                const errResult = await response.json().catch(() => ({}));
                statusElement.textContent = errResult.message || "Failed to save settings.";
                return;
            }

            const result = await response.json();
            statusElement.textContent = result.message || "Settings saved successfully.";
        } catch (error) {
            statusElement.textContent = "Unable to save settings.";
        }
    });
}

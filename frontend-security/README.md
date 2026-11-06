# User Security Dashboard – Front-End Security Hardening & Remediation

## Overview

This repository contains the hardened and remediated version of the **User Security Dashboard**, an application originally built using Vanilla JavaScript, HTML, CSS, Node.js, and Express containing intentional front-end and server-side security vulnerabilities.

The application has been audited, patched, and verified against five core modern web security domains:
1. **DOM-Based Cross-Site Scripting (DOM XSS)**
2. **Prototype Pollution**
3. **SSR Token Leakage**
4. **Content Security Policy (CSP)**
5. **Clickjacking**

The remediation follows a **Defense-in-Depth** architecture, ensuring that multiple independent defensive layers protect user data and runtime integrity even if any single security mechanism is bypassed or degraded.

---

## 1. Vulnerabilities Identified

| # | Security Vulnerability | Severity | Vulnerable Component / Location | Primary Risk |
|---|---|---|---|---|
| **1** | **DOM-Based XSS** | High | `client/app.js` (Lines 5–24) | Arbitrary script execution via untrusted URL parameter `?name=` interpolated into `.innerHTML`. |
| **2** | **Prototype Pollution** | High | `client/app.js` (`prepareSettings`) & `server/server.js` (`/api/settings`) | Manipulation of `Object.prototype` via `__proto__` / `constructor` injection in unvalidated JSON objects. |
| **3** | **SSR Token Leakage** | High | `server/server.js` (`GET /`, `GET /api/profile`) | Hardcoded session & refresh tokens serialized into HTML `<script>` tags and exposed on profile endpoints. |
| **4** | **Missing CSP** | Medium / High | `server/server.js` (All routes) | Lack of `Content-Security-Policy` header allows execution of inline scripts and loading of arbitrary remote assets. |
| **5** | **Clickjacking** | Medium | `server/server.js` (`GET /account`) | Missing `X-Frame-Options` and `frame-ancestors` permits embedding sensitive actions in hidden iframes. |

---

## 2. Detailed Vulnerability Breakdown & Security Fixes

### 1. DOM-Based Cross-Site Scripting (DOM XSS)

#### Vulnerable Implementation
In `client/app.js`:
```javascript
const params = new URLSearchParams(window.location.search);
const username = params.get("name") || window.initialUser?.name || "Guest";

// INSECURE: Untrusted query string directly parsed into DOM sink
app.innerHTML = `
    <section class="profile-card">
        <h2>Welcome, ${username}</h2>
        <p>Email: ${window.initialUser?.email || "Unknown"}</p>
        <p>Role: ${window.initialUser?.role || "User"}</p>
    </section>
`;
```
- **Vulnerability Cause**: The application read user input from an untrusted source (`window.location.search`) and concatenated it directly into `app.innerHTML`.
- **Attack Scenario**: An attacker delivers a link such as:
  `http://localhost:3000/?name=<img src=x onerror=alert(document.cookie)>`
  The browser parses the tags and executes JavaScript with full origin session permissions.

#### Security Fix
In `client/app.js`:
```javascript
// Programmatic DOM construction using safe textContent APIs
const profileCard = document.createElement("section");
profileCard.className = "profile-card";

const heading = document.createElement("h2");
heading.textContent = `Welcome, ${username}`; // Safe: treated strictly as plain text

const emailP = document.createElement("p");
emailP.textContent = `Email: ${userEmail}`;

const roleP = document.createElement("p");
roleP.textContent = `Role: ${userRole}`;

profileCard.appendChild(heading);
profileCard.appendChild(emailP);
profileCard.appendChild(roleP);

app.replaceChildren(profileCard);
```
- **Remediation**: Replaced raw string concatenation in `.innerHTML` with safe programmatic DOM element creation (`document.createElement`) and text assignment (`element.textContent`).
- **Defense-in-Depth**:
  - Implemented an `escapeHTML()` helper to neutralize dangerous HTML characters (`<`, `>`, `&`, `"`, `'`).
  - Enforced a strict CSP (`script-src 'self'`) blocking any inline script execution.

---

### 2. Prototype Pollution

#### Vulnerable Implementation
In `client/app.js`:
```javascript
function prepareSettings(userSettings) {
    const settings = {};
    for (const key in userSettings) {
        settings[key] = userSettings[key]; // INSECURE: unvalidated key iteration
    }
    return settings;
}
```
In `server/server.js`:
```javascript
app.post("/api/settings", (req, res) => {
    const incomingSettings = req.body;
    const settings = {};
    for (const key in incomingSettings) {
        settings[key] = incomingSettings[key]; // INSECURE: vulnerable to prototype poisoning
    }
    res.json({ message: "Settings saved successfully.", settings });
});
```
- **Vulnerability Cause**: The loop copied arbitrary properties from untrusted client input onto plain objects inheriting from `Object.prototype`. If payloads contain `__proto__` or `constructor`, prototype pollution can modify inherited properties across the entire application runtime.

#### Security Fix
In `server/server.js`:
```javascript
// Defense-in-depth: Freeze Object.prototype at runtime startup
if (Object.freeze) {
    Object.freeze(Object.prototype);
}

const ALLOWED_SETTING_KEYS = ["theme", "language", "fontSize"];
const ALLOWED_VALUES = {
    theme: ["light", "dark"],
    language: ["en", "fr"],
    fontSize: ["small", "medium", "large"]
};

app.post("/api/settings", (req, res) => {
    const incomingSettings = req.body;

    if (!incomingSettings || typeof incomingSettings !== "object" || Array.isArray(incomingSettings)) {
        return res.status(400).json({ error: "Invalid payload format. Expected a JSON object." });
    }

    // Explicitly scan and reject dangerous prototype pollution vectors
    const dangerousKeys = ["__proto__", "constructor", "prototype"];
    const incomingKeys = Object.keys(incomingSettings);

    for (const dKey of dangerousKeys) {
        if (incomingKeys.includes(dKey) || Object.prototype.hasOwnProperty.call(incomingSettings, dKey)) {
            return res.status(400).json({
                error: "Invalid request: Prototype pollution attempt detected and blocked."
            });
        }
    }

    // Use prototype-less dictionary for isolation
    const sanitized = Object.create(null);
    for (const key of ALLOWED_SETTING_KEYS) {
        if (Object.prototype.hasOwnProperty.call(incomingSettings, key)) {
            const val = incomingSettings[key];
            if (ALLOWED_VALUES[key] && ALLOWED_VALUES[key].includes(val)) {
                sanitized[key] = val;
            }
        }
    }

    res.json({
        message: "Settings saved successfully.",
        settings: Object.assign({}, defaultSettings, sanitized)
    });
});
```
- **Remediation**:
  1. **Prototype Freeze**: `Object.freeze(Object.prototype)` prevents runtime prototype tampering on both client and server.
  2. **Attack Detection**: Explicitly scans and rejects any payload containing `__proto__`, `constructor`, or `prototype` with HTTP 400.
  3. **Allowlist Validation**: Only explicitly enumerated keys (`theme`, `language`, `fontSize`) and valid enum values are processed.
  4. **Prototype-less Storage**: Employs `Object.create(null)` to eliminate prototype inheritance during processing.

---

### 3. SSR Token Leakage

#### Vulnerable Implementation
In `server/server.js`:
```javascript
app.get("/", (req, res) => {
    const initialUserData = JSON.stringify(user);
    res.send(`
        ...
        <script>
            window.initialUser = ${initialUserData}; // INSECURE: leaks session & refresh tokens
        </script>
        <script src="/app.js"></script>
    `);
});

app.get("/api/profile", (req, res) => {
    res.json(user); // INSECURE: returns sessionToken and refreshToken in response body
});
```
- **Vulnerability Cause**: The complete server user record (including `sessionToken` and `refreshToken`) was serialized into the HTML source code and exposed through `/api/profile`. Any script on the page (or browser extension / XSS payload) could steal sensitive credentials.

#### Security Fix
In `server/data.js` and `server/server.js`:
```javascript
// data.js: Data Minimization / Least Privilege helper
function getPublicProfile(userData) {
    if (!userData || typeof userData !== "object") return null;
    const { id, name, email, role } = userData;
    return { id, name, email, role }; // Tokens are stripped completely
}

// server.js: Render only sanitized public profile inside non-executable JSON block
app.get("/", (req, res) => {
    const publicUser = getPublicProfile(user);
    const safeUserDataJSON = JSON.stringify(publicUser).replace(/</g, "\\u003c");

    res.send(`
        ...
        <!-- Non-executable JSON container (Mitigates SSR Token Leakage & Inline XSS) -->
        <script id="initial-user-data" type="application/json">${safeUserDataJSON}</script>
        <script src="/app.js"></script>
    `);
});

app.get("/api/profile", (req, res) => {
    res.json(getPublicProfile(user)); // Only sanitized data returned
});
```
- **Remediation**:
  1. **Data Minimization**: Created `getPublicProfile()` to strip all authentication tokens (`sessionToken`, `refreshToken`) before sending data to the client.
  2. **Non-Executable JSON Container**: Replaced executable inline JavaScript (`window.initialUser = ...`) with `<script id="initial-user-data" type="application/json">`, escaping `<` as `\u003c` to prevent script breakout.
  3. **Protected API Endpoints**: `/api/profile` only returns public identity fields.

---

### 4. Content Security Policy (CSP)

#### Vulnerable Implementation
- No CSP headers were configured on any responses.
- Inline scripts (`window.initialUser = ...` and account button handlers) and inline `<style>` tags were scattered across templates.
- Without CSP, browsers allow inline scripts, untrusted third-party scripts, and dangerous plugins.

#### Security Fix
In `server/server.js`:
```javascript
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self'; " +
        "img-src 'self' data:; " +
        "font-src 'self'; " +
        "connect-src 'self'; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "frame-ancestors 'none';"
    );

    // Defense-in-depth standard security headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
    next();
});
```
- **Remediation**:
  - Extracted inline JavaScript into static external files (`client/app.js` and `client/account.js`).
  - Extracted inline CSS into static stylesheets (`client/styles.css` and `client/account.css`).
  - Enforced a strict CSP policy that disallows `'unsafe-inline'` and `'unsafe-eval'`.
  - Configured `object-src 'none'` to block Flash/plugins, and `base-uri 'self'` to prevent URL base hijacking.

---

### 5. Clickjacking

#### Vulnerable Implementation
In `server/server.js`:
- The `/account` endpoint rendered a critical "Delete Account" action without framing restrictions.
- An attacker could embed `http://localhost:3000/account` inside an invisible `<iframe>` on an external page (`test/iframe-test.html`) to deceive authenticated users into deleting their account (UI Redressing).

#### Security Fix
In `server/server.js` and `client/account.js`:
```javascript
// 1. Server HTTP Header: Legacy framing defense
res.setHeader("X-Frame-Options", "DENY");

// 2. Server CSP Directive: Modern Level 2/3 framing defense
// (frame-ancestors 'none' included in Content-Security-Policy)

// 3. Client Frame-Busting Guard (client/account.js)
try {
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
} catch (e) {
    document.body.innerHTML = "";
}
```
- **Remediation**:
  - `X-Frame-Options: DENY` ensures legacy browsers reject framing.
  - `Content-Security-Policy: ... frame-ancestors 'none'` enforces framing prevention in modern browsers across all routes.
  - Client-side frame-busting script provides secondary defense.
  - Verified with `test/iframe-test.html`.

---

## 3. Defense-in-Depth Architecture

The application adopts a multi-layered security model where no single control is solely relied upon:

```
+-----------------------------------------------------------------------+
| LAYER 1: NETWORK & HTTP HEADERS                                       |
| - Content-Security-Policy (default-src 'self', no unsafe-inline/eval)  |
| - X-Frame-Options: DENY                                               |
| - X-Content-Type-Options: nosniff                                     |
| - Referrer-Policy: strict-origin-when-cross-origin                    |
+-----------------------------------------------------------------------+
                                   |
+-----------------------------------------------------------------------+
| LAYER 2: SERVER-SIDE VALIDATION & ISOLATION                           |
| - Object.freeze(Object.prototype) runtime immutability                |
| - Input allowlisting & enum validation on POST /api/settings          |
| - Active detection & blocking of __proto__, constructor, prototype    |
| - Prototype-less intermediate storage via Object.create(null)         |
| - Data Minimization (getPublicProfile strips session/refresh tokens)  |
+-----------------------------------------------------------------------+
                                   |
+-----------------------------------------------------------------------+
| LAYER 3: SSR / CLIENT DATA TRANSPORT                                  |
| - Non-executable <script type="application/json"> data containers     |
| - HTML entity escaping (\u003c) preventing script context breakout    |
+-----------------------------------------------------------------------+
                                   |
+-----------------------------------------------------------------------+
| LAYER 4: CLIENT-SIDE EXECUTION                                        |
| - Safe DOM manipulation (textContent instead of innerHTML)            |
| - HTML escape utilities (escapeHTML)                                  |
| - Client Object.freeze(Object.prototype)                              |
| - Frame-busting clickjacking guard (window.top !== window.self)       |
+-----------------------------------------------------------------------+
```

---

## 4. Testing and Verification

### Automated Test Suite (`test/security.test.js`)

A comprehensive automated test suite covers **both positive and negative scenarios** across all five security domains.

Run the test suite:
```bash
npm test
```

#### Test Execution Results (21/21 Passing):
```text
▶ 1. DOM-Based Cross-Site Scripting (DOM XSS)
  ✔ Positive Scenario: Dashboard loads safely and references external script
  ✔ Negative Scenario: Query parameter with script tags is not reflected as executable HTML
  ✔ Positive Scenario: Safe DOM text assignment logic in client app
  ✔ Defense-in-Depth: HTML escape utility neutralizes dangerous characters
✔ 1. DOM-Based Cross-Site Scripting (DOM XSS)

▶ 2. Prototype Pollution Defenses
  ✔ Positive Scenario: Valid settings payload is accepted and merged safely
  ✔ Negative Scenario 1: Rejects payload containing '__proto__' and detects prototype pollution
  ✔ Negative Scenario 2: Rejects payload containing 'constructor' property
  ✔ Negative Scenario 3: Strips unallowlisted keys and ignores unexpected properties
  ✔ Defense-in-Depth: Object.prototype is frozen in runtime
✔ 2. Prototype Pollution Defenses

▶ 3. SSR Token Leakage Prevention
  ✔ Positive Scenario: Public user profile attributes are provided for UI rendering
  ✔ Negative Scenario 1: SSR HTML does NOT leak sessionToken or refreshToken
  ✔ Negative Scenario 2: /api/profile endpoint strips sessionToken and refreshToken
  ✔ Defense-in-Depth: User data uses non-executable application/json container without inline JS
✔ 3. SSR Token Leakage Prevention

▶ 4. Content Security Policy (CSP)
  ✔ Positive Scenario: CSP header is enforced with all required directives
  ✔ Negative Scenario 1: CSP disallows 'unsafe-inline' and 'unsafe-eval' in script-src
  ✔ Negative Scenario 2: Pages contain no inline executable scripts or inline styles
  ✔ Defense-in-Depth: Enforces additional browser security headers
✔ 4. Content Security Policy (CSP)

▶ 5. Clickjacking Defenses
  ✔ Positive Scenario 1: X-Frame-Options header is set to DENY on /account
  ✔ Positive Scenario 2: CSP frame-ancestors directive is set to 'none' on /account
  ✔ Positive Scenario 3: Account page retains functional delete button and user profile
  ✔ Negative Scenario: Framing is blocked across all application routes
✔ 5. Clickjacking Defenses

ℹ tests 21
ℹ suites 5
ℹ pass 21
ℹ fail 0
```

### Manual Verification Scenarios

1. **DOM XSS Manual Verification**:
   - Navigate to: `http://localhost:3000/?name=%3Cimg%20src=x%20onerror=alert(1)%3E`
   - **Result**: The string `<img src=x onerror=alert(1)>` appears as harmless plain text. No alert box appears, and no scripts execute.

2. **Prototype Pollution Manual Verification**:
   - Send attack payload:
     ```bash
     curl -X POST http://localhost:3000/api/settings \
       -H "Content-Type: application/json" \
       -d '{"__proto__": {"polluted": true}}'
     ```
   - **Result**: Server responds with HTTP `400 Bad Request` and `{"error":"Invalid request: Prototype pollution attempt detected and blocked."}`.

3. **SSR Token Leakage Manual Verification**:
   - Inspect page source: `curl -s http://localhost:3000/`
   - **Result**: Search for `TRAINING-FAKE-ACCESS-TOKEN-12345` or `TRAINING-FAKE-REFRESH-TOKEN-67890`. Zero matches found. User data is strictly limited to `{id, name, email, role}`.

4. **CSP Manual Verification**:
   - Inspect headers: `curl -I http://localhost:3000/`
   - **Result**: `Content-Security-Policy` header contains `default-src 'self'; script-src 'self'; ... frame-ancestors 'none';`.

5. **Clickjacking Manual Verification**:
   - Open `test/iframe-test.html` in a web browser while the application server is running (`npm start`).
   - **Result**: The iframe fails to embed `http://localhost:3000/account`. The browser displays a frame-load refusal error and logs CSP/X-Frame-Options violations in the developer console.

---

## 5. Running the Application

### Install Dependencies:
```bash
npm install
```

### Run Automated Tests:
```bash
npm test
```

### Start the Application:
```bash
npm start
```

Access the application in your browser:
- **Dashboard**: `http://localhost:3000/`
- **Account Settings**: `http://localhost:3000/account`
- **Clickjacking Test Bed**: Open `test/iframe-test.html` in your browser.

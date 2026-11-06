const user = {
    id: 101,
    name: "John Doe",
    email: "john@example.com",
    role: "Administrator",

    sessionToken: "TRAINING-FAKE-ACCESS-TOKEN-12345",
    refreshToken: "TRAINING-FAKE-REFRESH-TOKEN-67890"
};

const defaultSettings = {
    theme: "light",
    language: "en",
    fontSize: "medium"
};

/**
 * Sanitizes user data for client presentation following the Principle of Least Privilege.
 * Strips all sensitive credentials (sessionToken, refreshToken) to prevent SSR token leakage.
 *
 * @param {Object} userData - Full user record
 * @returns {Object} Safe public profile object
 */
function getPublicProfile(userData) {
    if (!userData || typeof userData !== "object") {
        return null;
    }
    const { id, name, email, role } = userData;
    return { id, name, email, role };
}

module.exports = {
    user,
    defaultSettings,
    getPublicProfile
};

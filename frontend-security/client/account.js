// Defense-in-depth: Freeze Object.prototype to prevent client-side prototype tampering
if (Object.freeze) {
    Object.freeze(Object.prototype);
}

// Defense-in-depth against Clickjacking (Frame-busting)
// If embedded within an unauthorized iframe, break out to top-level window
try {
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
} catch (e) {
    // Cross-origin framing access denied; clear DOM body to prevent UI redressing
    document.body.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const deleteButton = document.getElementById("delete-account");
    const statusText = document.getElementById("status");

    if (deleteButton && statusText) {
        deleteButton.addEventListener("click", () => {
            statusText.textContent = "Account deletion action triggered.";
        });
    }
});

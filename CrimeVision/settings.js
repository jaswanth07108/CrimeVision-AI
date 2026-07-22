window.onload = function () {

    // Load saved theme
    const theme = localStorage.getItem("theme") || "light";

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("darkMode").checked = true;
    }

    // Load language
    const language = localStorage.getItem("language") || "English";
    document.getElementById("language").value = language;
    applyLanguage(language);

    // Load notification
    const notification = localStorage.getItem("notification") || "on";
    document.getElementById("notification").checked = (notification === "on");
};

// Save Settings
function saveSettings() {

    // Theme
    if (document.getElementById("darkMode").checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }

    // Language
    const language = document.getElementById("language").value;
    localStorage.setItem("language", language);
    applyLanguage(language);

    // Notification
    const notification = document.getElementById("notification").checked ? "on" : "off";
    localStorage.setItem("notification", notification);

    alert("Settings Saved Successfully!");
}

// Change language
function applyLanguage(language) {

    if (language === "Telugu") {
        document.getElementById("settingsTitle").innerText = "సెట్టింగ్స్";
    } else if (language === "Hindi") {
        document.getElementById("settingsTitle").innerText = "सेटिंग्स";
    } else {
        document.getElementById("settingsTitle").innerText = "Application Settings";
    }
}
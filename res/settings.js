function getSetting(value) {
    if (localStorage.getItem('settings')) {
        var settings = JSON.parse(localStorage.getItem('settings'));
        return settings[value];
    } else {
        return globalThis.defaultSettings[value];
    }
}
globalThis.defaultSettings = {
    "desktopImage": "img/bsiv.png",
    "whenToFocusWindow": "mouseover",
    "resolution-change-hide-timeout": 2
};
globalThis.settingsData = {
    "desktopImage": {
        "type": "file",
        "description": "Desktop image"
    },
    "whenToFocusWindow": {
        "type": "options",
        "description": "When to focus windows.",
        "options": ['mouseover', 'click']
    },
    "resolution-change-hide-timeout": {
        "type": "int",
        "description": "Duration (in seconds) the width and height show when resizing the window."
    }
}
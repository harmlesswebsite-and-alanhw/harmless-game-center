function getSetting(value) {
    if (localStorage.getItem('settings')) {
        var settings = JSON.parse(localStorage.getItem('settings'));
        return settings[value];
    } else {
        return globalThis.defaultSettings[value];
    }
}
function setSetting(name, value) {
    var settings = JSON.parse(localStorage.getItem('settings') ?? '{}');
    settings[name] = value;
    localStorage.setItem('settings', JSON.stringify(settings));
}
globalThis.defaultSettings = {
    "desktopImage": "img/bsiv.png",
    "whenToFocusWindow": "mouseover",
    "resolution-change-hide-timeout": 2,
    "focusTimeout": 0.5
};
globalThis.settingsData = {
    "desktopImage": {
        "type": "file",
        "description": "Desktop image"
    },
    "whenToFocusWindow": {
        "type": "options",
        "description": "When to focus windows.",
        "options": ['mouseover', 'mousedown'],
        "requiresRestart": true
    },
    "resolution-change-hide-timeout": {
        "type": "int",
        "description": "Duration (in seconds) the width and height show when resizing the window.",
        "requiresRestart": true
    },
    "focusTimeout": {
        "type": "int",
        "description": "Wait this long (in seconds) after a window is eligible to be focused to focus it."
    }
}
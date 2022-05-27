function getSetting(value) {
    if (localStorage.getItem('settings')) {
        var settings = JSON.parse(localStorage.getItem('settings'));
        return settings[value];
    } else {
        return globalThis.defaultSettings[value];
    }
}
globalThis.defaultSettings = {
    "desktopImage": "img/bsiv.png"
};
globalThis.settingsData = {
    "desktopImage": {
        "type": "file",
        "description": "Desktop image"
    }
}
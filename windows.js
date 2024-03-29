function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
function closeWindow(w) {
    // Bring the window to the top to avoid gaps in z-indexes.
    focusWindow(w);
    globalThis.windows.splice(globalThis.windows.indexOf(w), 1);
    document.body.removeChild(document.getElementById(w.id));
    window.parent.postMessage({"type": "windowsChanged", "windows": globalThis.windows});
}
function closeWindowById(id) {
    for (var i = 0; i < globalThis.windows.length; i++) {
        if (windows[i].id === id) closeWindow(windows[i]);
    }
}
globalThis.windows = [];
class app {
    constructor(title, url, width = "400px", height = "300px") {
        this.id = uuidv4();
        this.title = title; 
        this.url = url; 
        this.top = 0;
        this.left = 0;
        this.width = width;
        this.height = height;
        this.minimized = false;
        this.focused = true;
        globalThis.windows.push(this);
        createWindow(this);
        refreshWindows();
    }
}
function focusWindow(w) {
    w.focused = true;
    var index = document.getElementById(w.id).style.zIndex;
    for (var i = 0; i < globalThis.windows.length; i++) {
        globalThis.windows[i].focused = false;
        if (globalThis.windows[i] === w) {
            globalThis.windows[i].focused = true;
        }
        if (document.getElementById(windows[i].id).style.zIndex > index) {
            document.getElementById(windows[i].id).style.zIndex--;
        }
    }
    document.getElementById(w.id).style.zIndex = globalThis.windows.length - 1;
    window.parent.postMessage({"type": "windowsChanged", "windows": globalThis.windows});
}
function createWindow(wi) {
    window.parent.postMessage({"type": "windowsChanged", "windows": globalThis.windows});
    var w = document.createElement('div');
    w.style.resize = 'both';
    w.style.overflow = 'auto';
    w.id = `${wi.id}`;
    w.style.zIndex = globalThis.windows.indexOf(wi);
    w.style.display = 'table';
    w.classList.add('app');
    var title = document.createElement('div');
    title.style.height = '0px';
    title.style.display = 'table-row';
    title.addEventListener('mousedown', function(ev) {
        this.setAttribute('data-beingdragged', 'true');
        this.setAttribute('data-original-cursor-x', ev.clientX);
        this.setAttribute('data-original-cursor-y', ev.clientY);
        this.setAttribute('data-original-top', this.parentNode.style.top.slice(0, -2));
        this.setAttribute('data-original-left', this.parentNode.style.left.slice(0, -2));
    });
    w.addEventListener(getSetting('whenToFocusWindow'), function() {
        console.log(wi.id === this.id);
        setTimeout(function() { focusWindow(wi); }, getSetting('focusTimeout') * 1000);
    });
    w.addEventListener('mousemove', function(ev) {
        var re = this.getBoundingClientRect();
        if (!this.children[0].getAttribute('data-beingdragged')) return; 
        ev.preventDefault();
        console.log(ev.clientX, ev.clientY);
        console.log(re.left, re.top);
        console.log(this.children[0].getAttribute('data-original-left'));
        this.style.left = (JSON.parse(this.children[0].getAttribute('data-original-left')) 
        + ev.clientX - JSON.parse(this.children[0].getAttribute('data-original-cursor-x'))) 
        + "px";
        this.style.top = (JSON.parse(this.children[0].getAttribute('data-original-top')) 
        + ev.clientY - JSON.parse(this.children[0].getAttribute('data-original-cursor-y'))) 
        + "px";
        for (var i = 0; i < windows.length; i++) {
            if (windows[i].id === this.getAttribute('id')) {
                globalThis.windows[i].top  = this.style.top.slice(0, -2);
                globalThis.windows[i].left = this.style.left.slice(0, -2);
            }
        }
    });
    w.addEventListener('mouseup', function(ev) {
        this.children[0].removeAttribute('data-beingdragged');
    })
    var titleBar = document.createElement('div');
    titleBar.textContent = wi.title;
    titleBar.classList.add('title-bar');
    var closeButtons = document.createElement('span');
    titleBar.style.display = 'table-cell';
    var minimize = document.createElement('button');
    minimize.innerHTML = '&mdash;';
    minimize.classList.add('operation-button');
    minimize.addEventListener('click', function() {
        console.log(this.parentNode.parentNode.parentNode.parentNode);
        this.parentNode.parentNode.parentNode.parentNode.classList.add('minimized');
        setTimeout(function(t) { t.parentNode.parentNode.parentNode.parentNode.classList.add('minimized'); }, 1000, this);
    });
    closeButtons.appendChild(minimize);
    var maximize = document.createElement('button');
    maximize.classList.add('operation-button');
    maximize.innerHTML = '□';
    maximize.addEventListener('click', function() {
        this.parentNode.parentNode.parentNode.parentNode.classList.toggle('maximized');
    });
    closeButtons.appendChild(maximize);
    var closebutton = document.createElement('button');
    closebutton.classList.add('operation-button');
    closebutton.classList.add('close-button');
    closebutton.addEventListener('click', function() {
        closeWindow(wi);
    });
    closebutton.innerHTML = '&times';
    closeButtons.style.float = 'right';
    closeButtons.appendChild(closebutton);
    titleBar.appendChild(closeButtons);
    title.appendChild(titleBar);
    w.style.height = wi.height;
    w.style.width = wi.width;
    w.style.position = 'fixed';
    w.style.top = wi.top;
    w.style.left = wi.left;
    w.appendChild(title);
    var contentContainer = document.createElement('div');
    contentContainer.style.display = 'table-row';
    var content = document.createElement('iframe');
    content.style.width = '100%';
    content.style.height = '100%';
    content.style.display = 'table-cell';
    content.style.border = 'none';
    content.src = wi.url;
    contentContainer.appendChild(content);
    w.appendChild(contentContainer);
    document.body.appendChild(w);
    focusWindow(wi);
}
function refreshWindows() {

}
window.onmessage = function(ev) {
    console.log(ev.data);
    switch (ev.data.type) {
        case 'focusWindowById':
            for (var i = 0; i < windows.length; i++) {
                if (windows[i].id === ev.data.id) focusWindow(windows[i]);
            }
            break;
        case 'newApp':
            new app(ev.data.title, ev.data.url, ev.data.width ?? "300px", ev.data.height ?? "400px");
            break;
        case 'closeWindowById':
            closeWindowById(ev.data.id);
            break;
        case 'unminimizeWindowById':
            document.getElementById(ev.data.id).classList.remove('minimized');
            break;
    }
}
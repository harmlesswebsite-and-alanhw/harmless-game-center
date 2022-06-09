globalThis.closed = true;
window.addEventListener('hashchange', function() {
    openFile(location.hash.slice(1));
});
function openFile(loc) {
    // Since we have nodeIntegration: true, we can use
    // require directly here.
    globalThis.closed = false;
    const fs = require('fs');
    closeAllMessages();
    const file = loc;
    if (!fs.existsSync(file)) {
        document.getElementById('nonexistentfilename').textContent = file;
        return document.getElementById('filenotfound').style.display = 'block';
    }
    // Read file
    fs.readFile(file, function(error, data) {
        if (error) {
            document.getElementById('fileerrortext').textContent = error;
            return document.getElementById('fileerror').style.display = 'block';
        }
        // CALLBACK HELL! 2 levels deep now!
        fs.realpath(file, function(error, path) {
            document.getElementById('filename').textContent = path;
            document.getElementById('currentTitle').textContent = `Editing ${path.split('/')[path.split('/').length - 1]}`;
            document.getElementById('fileinfo').style.display = 'block';
            document.getElementById('where2save').value = path;
            fs.readFile(path, 'utf-8', function(err, data) {
                // 3 levels now!
                document.getElementById('writehere').value = data;
            });
        });
    });
}
if (location.hash.slice(1)) openFile(decodeURIComponent(location.hash.slice(1)));
function closeAllMessages() {
    var msgs = document.querySelectorAll('#status-bar > div');
    for (var i = 0; i < msgs.length; i++) msgs[i].style.display = 'none';
}
document.getElementById('file2open').addEventListener('keydown', function(ev) {
    if (ev.key === 'Escape') {
        closeAllMessages();
        document.getElementById('nope').style.display = 'block';
    }
});
document.getElementById('where2save').addEventListener('keydown', function(ev) {
    if (ev.key === 'Escape') {
        closeAllMessages();
        document.getElementById('nope').style.display = 'block';
    }
});
function saveFile(path, contents) {
    const fs = require('fs');
    fs.writeFile(path, contents, function(error) {
        closeAllMessages();
        if (error) {
            document.getElementById('writeerrortext').textContent = error;
            return document.getElementById('writeerror').style.display = 'block';
        }
        document.getElementById('writesuccess').style.display = 'block';
    });
}
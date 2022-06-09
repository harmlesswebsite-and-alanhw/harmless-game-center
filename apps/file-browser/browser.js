const fs = require('fs');
function getFiles(dir, modifyURL = true) {
    document.getElementById('filelist').innerHTML = '';
    // CALLBACK HELL!
    document.getElementById('current-position').textContent = dir;
    fs.readdir(dir, function(error, files) {
        if (error) {
            return {"status": false, "error": error};
        }
        files.unshift('..');
        for (var i = 0; i < files.length; i++) {
            const row = document.createElement('tr');
            row.addEventListener('dblclick', function() {
                if (this.children[1].textContent === 'File') {
                    var fileExt = this.children[0].textContent.split('.');
                    fileExt = fileExt[fileExt.length - 1];
                    console.log(`Extension: ${fileExt}`);
                    switch (fileExt) {
                        case 'png':
                        case 'jpeg':
                        case 'jpg':
                        case 'svg':
                        case 'gif':
                        case 'webp':
                            window.parent.postMessage({"type": 'newApp', "title": 'Image ' + this.children[0].textContent, "url":'apps/image-viewer/index.html#' + this.children[0].getAttribute('data-goesto'), 'height': '450px', 'width': '700px'}, '*');
                            break;
                        default:
                            window.parent.postMessage({"type": 'newApp', "title": 'Text editor', "url":'apps/text-editor/index.html#' + this.children[0].getAttribute('data-goesto'), 'height': '450px', 'width': '700px'}, '*');
                            break;
                    }
                } else {
                    getFiles(this.children[0].getAttribute('data-goesto'));
                }
            });
            const file = files[i];
            fs.stat(`${dir}/${files[i]}`, function(err, success) {
                if (err) return false;
                var name = document.createElement('td');
                name.textContent = fs.realpathSync(`${dir}/${file}`);
                if (modifyURL) location.hash = name.textContent;
                name.setAttribute('data-goesto', fs.realpathSync(`${dir}/${file}`));
                if (file === "..") name.innerHTML = '..';
                row.appendChild(name);
                var isFile = document.createElement('td');
                isFile.textContent = success.isDirectory() ? 'Directory' : 'File';
                row.appendChild(isFile);
                var lastmod = document.createElement('td');
                lastmod.textContent = success.mtime;
                row.appendChild(lastmod);
            });
            document.getElementById('filelist').appendChild(row);
        }
    });
}
if (location.hash.slice(1)) getFiles(decodeURIComponent(location.hash.slice(1)));
else getFiles('/');
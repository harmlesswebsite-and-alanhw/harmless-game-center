const fs = require('fs');
function getFiles(dir) {
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
                if (this.children[1].textContent === 'File') return;
                getFiles(this.children[0].getAttribute('data-goesto'));
            });
            const file = files[i];
            fs.stat(`${dir}/${files[i]}`, function(err, success) {
                if (err) return false;
                var name = document.createElement('td');
                name.textContent = fs.realpathSync(`${dir}/${file}`);
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
getFiles('/');
const fs = require('fs');
function getFiles(dir) {
    document.getElementById('filelist').innerHTML = '';
    // CALLBACK HELL!
    document.getElementById('current-position').textContent = dir;
    fs.readdir(dir, function(error, files) {
        if (error) {
            return {"status": false, "error": error};
        }
        for (var i = 0; i < files.length; i++) {
            const row = document.createElement('tr');
            row.addEventListener('dblclick', function() {

            });
            const file = files[i];
            fs.stat(`${dir}/${files[i]}`, function(err, success) {
                if (err) return false;
                var name = document.createElement('td');
                name.textContent = fs.realpathSync(`${dir}/${file}`);
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
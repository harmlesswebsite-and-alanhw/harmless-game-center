class program {
    constructor(name, starts, description, options = {coverImage: "img/someapp.svg", height: '450px', width: '700px'}) {
        this.name = name;
        this.starts = starts;
        this.start = function() {
            document.querySelector('iframe').contentWindow.postMessage({"type": 'newApp', "title": this.name, "url": this.starts, 'height': options.height ?? '450px', 'width': options.width ?? '700px'});
            return this;
        };
        console.log(options);
        this.coverImage = options.coverImage;
        this.description = description;
    }
}
function getApps() {
    const fs = require('fs');
    fs.promises.readdir(process.cwd() + "/apps")
    .then(function(files) {
        var apps = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i] === '..' || files[i] === '.') return;
            var config = fs.readFileSync(`apps/${files[i]}/config.json`);
            config = JSON.parse(config);
            apps.push(new program(config.name, config.start, config.description, {coverImage: config.image ?? "img/someapp.svg"}));
        }
        setApps(apps);
    })
    .catch(function() {
        return 'FALIURE';
    });
}
document.addEventListener('keydown', function(ev) {
    if (ev.key === 'Escape') {
        document.getElementById('app-list').style.display = 'none';
    }
});
function setApps(apps) {
    for (var i = 0; i < apps.length; i++) {
        var app = apps[i];
        var appButton = document.createElement('button');
        appButton.style.display = 'block';
        appButton.style.textAlign = 'center';
        appButton.title = apps[i].description;
        appButton.style.verticalAlign = 'middle';
        appButton.setAttribute('data-starts', apps[i].starts);
        appButton.setAttribute('data-name', apps[i].name);
        appButton.addEventListener('click', function() {
            document.getElementById('app-list').style.display = 'none';
            document.querySelector('iframe').contentWindow.postMessage({"type": 'newApp', "title": this.getAttribute('data-name'), "url": this.getAttribute('data-starts'), 'height': '450px', 'width': '700px'});
        });
        var image = document.createElement('img');
        image.alt = `App icon for ${apps[i].name}`;
        image.style.verticalAlign = 'middle';
        image.height = '64';
        console.log(apps[i]);
        image.src = apps[i].coverImage;
        appButton.appendChild(image);
        appButton.appendChild(document.createTextNode(' '));
        var name = apps[i].name;
        var namespan = document.createElement('span');
        namespan.style.verticalAlign = 'middle';
        namespan.textContent = name;
        appButton.appendChild(namespan);
        console.log('foo');
        document.getElementById('application-list').appendChild(appButton);
    }
}
getApps();
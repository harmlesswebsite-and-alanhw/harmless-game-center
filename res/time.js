function getTime() {
    var time = new Date().toLocaleTimeString();
    var date = new Date().toLocaleDateString();
    document.getElementById('time').textContent = `${date} ${time}`;
}
getTime();
setInterval(function() {
    getTime();
}, 1000);
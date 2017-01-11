function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    var siginifier = "AM";
    if (h > 11) {siginifier = "PM"};
    if (h > 12) {h = h-12};
    document.getElementById('curTime').innerHTML = h + ":" + m + ":" + s + " " + siginifier;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
function getData() {
    $.getJSON("http://api.sunrise-sunset.org/json", {lat: 43.200710, lng: -70.797379, formatted: 0}, function(result){
        var sunriseDate = new Date(Date.parse(result.results.sunrise));
        $('.sunrise').text(sunriseDate.toLocaleTimeString( [], {hour:"numeric", minute:"numeric"}));
        var sunsetDate = new Date(Date.parse(result.results.sunset));
        $('.sunset').text(sunsetDate.toLocaleTimeString( [], {hour:"numeric", minute:"numeric"}));
    });
    var curDate = new Date();
    $.get("http://localhost:8080",function(result){
        $('#moonPhase').text(result);
    });
}
function starter() {
    getData();
    startTime();
}
starter();
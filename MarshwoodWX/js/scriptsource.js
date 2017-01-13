//This stores the current date object:
var today = null;
function updateTime() {
    //Update today:
    today = new Date();
    //Insert the local time string into #curTime:
    $("#curTime").text(today.toLocaleTimeString("en-US"));
}

function getData() {
    //When passed into .toLocaleTimeString() with "en-US", this will yield a time with only the hour, minute, and AM/PM:
    var timeOptions = {
        "hour": "numeric",
        "minute": "numeric"
    };
    //Set the sunrise, sunset data for MHS's location:
    $.getJSON("http://api.sunrise-sunset.org/json", {lat: 43.200710, lng: -70.797379, formatted: 0}, function(result) {
        //Parse sunrise datestring and insert the time into #sunrise:
        var sunriseDate = new Date(result.results.sunrise);
        $('#sunrise').text(sunriseDate.toLocaleTimeString("en-US", timeOptions));
        //Do the same thing for the sunset:
        var sunsetDate = new Date(result.results.sunset);
        $('#sunset').text(sunsetDate.toLocaleTimeString("en-US", timeOptions));
        
        //Now that the sunrise and sunset has been loaded, adjust the iframe:
        adjustFrame();
        //Also, resize the frame whenever the window is resized:
        window.addEventListener("resize", adjustFrame);
    });
    //Set the moon phase data for today's date in MHS' timezone for MHS' location:
    $.getJSON("http://api.usno.navy.mil/rstt/oneday", {date: today.toLocaleDateString("en-US"), tz: -5, coords: "43.2007N,70.7974W"}, function(result) {
        //If curphase is specified, then put it in #moonPhase:
        if (result.hasOwnProperty("curphase")) $("#moonPhase").text(result.curphase);
        //Otherwise, use closestphase.phase:
        else $("#moonPhase").text(result.closestphase.phase);
    });
}

function adjustFrame() {
    //This stores what will be the top attribute of the iframe:
    var getOffset = 0;
    //Get the elements which we want to above above the iframe:
    var aboveFrameElems = $(".above-frame");
    for (var i = 0; i < aboveFrameElems.length; i++) {
        //Get the current element:
        var curElem = aboveFrameElems.get(i);
        //Get its bottom:
        //Remember to add window.scrollY since getBoundingClientRect() is relative to the window, not the document:
        var curElemBottom = curElem.getBoundingClientRect().bottom+window.scrollY;
        //Make getOffset the maximum of all of the bottoms:
        getOffset = Math.max(getOffset, curElemBottom);
    }
    $("#frame").css("top", getOffset+"px")
    
    //This is done so that it goes after the sunrise/sunset blocks, but can be next to the moon phase block.
}

//Set the time:
updateTime();
//Keep updating the time two times every second:
setInterval(updateTime, 500);
//Get the API data:
getData();
//This stores the current date object:
var today = null;
function updateTime() {
    /* This function updates the #cur-time element. */
    
    //Update today:
    today = new Date();
    //Insert the local time string into #cur-time:
    $("#cur-time").text(today.toLocaleTimeString("en-US"));
}

function changeWindDir() {
    /* This function clears #wind-dir if the wind speed is 0 mph. */
    
    //Get the #wind-dir element:
    var windDirElem = $("#wind-dir");
    //If it's text is N/A, then clear it:
    if (windDirElem.text() === "N/A") windDirElem.text("");
}

function getApiData() {
    /* This function gets the JSON data from APIs and puts it into the Web page. */
    
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

//ordinalDirections[i] represents an arc with measure (360/16) degrees centered at the point i sixteenths-way around the circle:
var ordinalDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
function toOrdinalDir(deg) {
    /* Given a degree measure, the below algorithm finds which arc the degree measure is in and then returns the corresponding ordinal direction. */
    return ordinalDirections[Math.round(deg/(360/16)) % 16];
}

function getLoopData() {
    /* This function gets the JSON data from the loop packet and puts it into the Web page. */
    
    $.getJSON("http://localhost:8000/", function(data) {
        //Fill in the inside/outside temperature/windchill/heatindex as degrees Fahreinheit:
        $("#out-temp").text(data.outTemp+" \u00b0F");
        $("#in-temp").text(data.inTemp+" \u00b0F");
        $("#windchill").text(data.windchill.toFixed(1)+" \u00b0F");
        $("#heatindex").text(data.heatindex+" \u00b0F");
        //Fill in the humidity as degrees Fahreinheit:
        $("#out-humidity").text(data.outHumidity+"%");
        //Fill in the windspeed as miles per hour:
        $("#wind-speed").text(data.windSpeed+" mph");
        //If the wind speed is not 0, add the ordinal direction:
        if (data.windSpeed !== 0) $("#wind-dir").text(toOrdinalDir(data.windDir));
        //Otherwise, clear the ordinal direction:
        else $("#wind-dir").text("");
        //Fill in the today's today rain as inches and the rain rate as inches per hour:
        $("#day-rain").text(data.dayRain.toFixed(2)+" in");
        $("#rain-rate").text(data.rainRate.toFixed(2)+" in/hr");
        //Fill in the pressure as mmHg, but first, convert from inHg to mmHg:
        $("#barometer").text((data.barometer*25.4).toFixed(1)+" mmHg");
        //Just in case the above adjustments changed with height of a box, re-adjust the frame:
        adjustFrame();
    });
}

function adjustFrame() {
    /* This function positions the #frame element below the .above-frame elements. */
    
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
    //Finally, set the #frame's top attribute so that it is beneath all of the .above-frame elements:
    $("#frame").css("top", getOffset+"px")
}

//Set the time:
updateTime();
//Get rid of the wind direction if it isn't needed:
changeWindDir();
//Keep updating the time two times every second:
setInterval(updateTime, 500);
//Get the API data:
getApiData();
//Get the loop data every two seconds after the page loads:
//Commented out because getLoopData is not ready for production yet.
//setInterval(getLoopData, 2000);
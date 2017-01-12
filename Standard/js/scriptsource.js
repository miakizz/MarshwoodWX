function startTime() {
    //Insert the local time string into #curTime:
    var today = new Date();
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
    });
    $.get("http://localhost:8080", function(result) {
        //Set the moon phase status to whatever the local server gives us back:
        $('#moonPhase').text(result);
    });
}

function adjustFrame() {
    //Set the top of the iframe to the bottom of the second row:
    var secondRow = $("#row2");
    var secondRowYOffset = secondRow.offset().top+secondRow.height();
    //Remember to add window.scrollY since getBoundingClientRect() is affected by scrolling.
    $("#frame").css("top", (window.scrollY+secondRowYOffset)+"px")
    
    //This is done so that it goes after the sunrise/sunset blocks, but can be next to the moon phase block.
}

//Set the time:
startTime();
//Keep updating the time two times every second:
setInterval(startTime, 500);
//Get the API data:
getData();
var xmlData = [],
    days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    times = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    week = [],
    tData = []
    results;

var roomArray = ['Wilkinson 269 Mac Lab', 'Wilkinson 261 Digital Media Lab', 'Wilkinson 262 General Access Laboratory', 'Wilkinson 268 Sentient Laboratory']


var results = "";
$.ajax({
    url: '/data',
    datatype: 'xml',
    success: function(e) {
        var xmlDoc = jQuery.parseXML(e);
        results = $.xml2json(xmlDoc);
        getEvents(results.entry, roomArray);

    }
});

var noEvent = true,
    flag = false;


createWeek()






function getEvents(results, rooms) {

    for (var i = results.length - 1; i >= 0; i--) {
        var result = results[i];


        var thisweek = moment().startOf('week');
        var thisweek2 = moment().startOf('week');
        var day = dayToDayNumber(result.day_of_week);
        var dayThisWeek = thisweek.weekday(day);
        var dayThisWeek2 = thisweek2.weekday(day);

        var sT = result.start_time.split(":");
        var eT = result.end_time.split(":");

        sT = dayThisWeek.hours(sT[0]).minutes(sT[1]);
        eT = dayThisWeek2.hours(eT[0]).minutes(eT[1]);

        var a = moment(sT),
            b = moment(eT),
            len = b.diff(a, 'minutes');



        var startDate = moment(result.start_day, "DDMMYYYY");
        var endDate = moment(result.end_day, "DDMMYYYY");
        var dateRange = moment().range(startDate, endDate);

        var venue = result.venue_name.trim();


        if (dateRange.contains(thisweek)) {


            xmlData.push({
                uosName: result.uosName,
                alphaDigit: result.AlphaDigit,
                startDate: moment(result.start_day, "DDMMYYYY"),
                endDate: moment(result.end_day, "DDMMYYYY"),
                startTime: sT,
                endTime: eT,
                length: len,
                frequency: result.frequency,
                venue: venue,
                dayOfWeek: result.day_of_week,
                computedDay: dayThisWeek,
                range: moment().range(sT, eT)
            });
        }

    };

    var today = moment().day();
    for (var i = rooms.length - 1; i >= 0; i--) {
        getEventsByDay(today, rooms[i].trim());

    };

    updateHeading();
    updateLine();
    var timerId = setInterval(updateHeading, 10000);
    var timerId = setInterval(updateLine, 10000);






}


function dayToDayNumber(day) {
    switch (day) {
        case "SUN":
            return 0;
            break;
        case "MON":
            return 1;
            break;
        case "TUE":
            return 2;
            break;
        case "WED":
            return 3;
            break;
        case "THU":
            return 4;
            break;
        case "FRI":
            return 5;
            break;
        case "SAT":
            return 6;
            break;


    }
}


function momentToDay(day) {
    switch (day) {
        case 1:
            return 0;
            break;
        case 2:
            return 1;
            break;
        case 3:
            return 2;
            break;
        case 4:
            return 3;
            break;
        case 5:
            return 4;
            break;
        case 6:
            return 5;
            break;
        case 0:
            return 6
            break;
    }
}



function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function(a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function createWeek() {
    for (var i = 0; i < days.length; i++) {
        for (var x = 0; x < times.length; x++) {
            var day = {};
            day.day = days[i];
            day.time = times[x];
            week.push(day);

        };
    };
}


function getEventsByDay(day, room) {

    var d = momentToDay(day);
    var tempArray = [];
    var room = room;




    for (var i = 0; i < xmlData.length; i++) {
        if (xmlData[i].dayOfWeek === days[d] && xmlData[i].venue == room) {
            tempArray.push(xmlData[i]);
        }
    };
    createTimeLineForDay(days[d], tempArray, room);
}




function createTimeLineForDay(day, events, room) {

    var segmentCount = 0,
        daySegments = 144,
        startTime = 9,
        curBlockNo = 0,
        eCount = 0,
        dayTimeLine = [];

    //Get Starting Time
    var thisweek = moment().startOf('week');
    var day = dayToDayNumber(day);
    var currentTime = thisweek.weekday(day);
    currentTime.set('hours', 9);
    var lastTime = currentTime;

    //Sort Events by Time
    events = events.sort(compareMilli);
    eventStarted = false;

    // Create Blocks
    do {
        var block = {}, currentEvent = null,
            nextTime = 1;


        block.room = room;
        block.roomNo = room.replace(/\D/g, '').trim();



        var addToSegment = 1;
        var addToMinutes = 5;

        var evs = isEventOnAtTime(currentTime);
        //Check if event starts at this time
        if (evs.length > 0) {
            //Make an event and go to end of event
            block.starTime = evs[0].startTime.format('ha');
            block.endTime = evs[0].endTime.format('ha');

            block.starTimeA = evs[0].startTime;
            block.endTimeA = evs[0].endTime;

            block.range = moment().range(evs[0].startTime, evs[0].endTime);
            block.e = evs;

            //Go to the end of the event
            addToSegment = (evs[0].length / 5);
            addToMinutes = evs[0].length;

            block.segmentCount = addToSegment;

            dayTimeLine.push(block);

            eventStarted = true;

        } else {
            //Create Empty block and skip to next Event Time (difference between next event block)
            eventStarted = false;
            //If there's no events left

        }


        if (!eventStarted) {
            var nextEvent = getNextEvent(currentTime);

            //if There's an event left
            if (nextEvent) {
                block.starTime = currentTime.format('ha');
                block.endTime = nextEvent.startTime.format('ha');
                block.range = moment().range(currentTime, nextEvent.startTime);

                block.starTimeA = currentTime;
                block.endTimeA = nextEvent.startTime;

                var difference = nextEvent.startTime.diff(currentTime, 'minutes');
                addToSegment = difference / 5;
                addToMinutes = difference;
                block.segmentCount = addToSegment;
                dayTimeLine.push(block);
            } else {
                block.starTime = currentTime.format('ha');
                block.endTime = moment(currentTime).set('hours', 21).format('ha');

                block.starTimeA = currentTime;
                block.endTimeA = moment(currentTime).set('hours', 21);

                block.range = moment().range(currentTime, moment(currentTime).set('hours', 21));

                block.segmentCount = daySegments - segmentCount;
                segmentCount = segmentCount = daySegments;
                dayTimeLine.push(block);
            }
        }

        function isEventOnAtTime(time) {
            var evArray = [];
            for (var x = 0; x < events.length; x++) {
                //Check if event starts at this time
                if (currentTime.isSame(events[x].startTime)) {
                    //Make an event and go to end of event
                    evArray.push(events[x])

                } else {
                    //Create Empty block and skip to next Event Time (difference between next event block)
                }
            }
            return evArray;

        }

        function getNextEvent(ct) {
            var eA = 0;
            for (var i = 0; i < events.length; i++) {
                if (events[i].startTime.isAfter(ct)) {
                    return events[i];
                }
            }


        }
        segmentCount = segmentCount + addToSegment;
        currentTime.add('minutes', addToMinutes);

    }
    while (segmentCount < daySegments);
    createHtmlForDay(dayTimeLine, room);
    tData.push(dayTimeLine);



}



function updateHeading() {

    var a = [];
    for (var i = tData.length - 1; i >= 0; i--) {
        var freeOrEvent = false;
        var now = moment();
        var html = "";
        html += "<div class='heading'><h1>Room " + tData[i][0].roomNo + "</h1><p>" + tData[i][0].room.replace('Wilkinson', "").replace(/[0-9]/g, '') + "<br>";
        var room = tData[i];
        for (var x = 0; x < room.length; x++) {
            if (room[x].range.contains(now)) {
                if (room[x].e) {
                    html += '<span class="occupied">Occupied</span> till ' + room[x].endTime;
                } else {
                    html += '<span class="free">Free</span>';
                }


            }

        };
        html += '</p></div>';
        //a.push(html)
        var idSel = '#' + tData[i][0].roomNo;
        $(idSel).find('.heading').html(html);




    };


}


function updateLine() {
    var startTime = moment().hour(9).minutes(0);
    var endTime = moment().hour(21).minutes(0);
    var time = $('.time').width();
    var d = endTime.diff(startTime, 'minutes');
    //every minute is 1680 divived by minutes
    var minuteLength = 1680 / d;


    var now = moment();

    $('h1.date').html(now.format('h.mm'));

    if (now.isAfter(startTime) && now.isBefore(endTime)) {
        var linePoint = now.diff(startTime, 'minutes') * minuteLength;
        $('.line').css('left', linePoint);

    }


}




function createHtmlForDay(dayTimeLine, room) {
    var html = "";
    var elWidth = 1680;
    var ind = elWidth / 144;


    html += "<div class='day' id='" + room.replace(/\D/g, '').trim() + "'><div class='heading'></div>"
    for (var i = 0; i < dayTimeLine.length; i++) {
        var i1 = "",
            rm = "";
        var segmentSize = "";

        switch (true) {
            case dayTimeLine[i].segmentCount > 0 && dayTimeLine[i].segmentCount <= 12:
                segmentSize = "small";
                break;
            case dayTimeLine[i].segmentCount > 12 && dayTimeLine[i].segmentCount <= 24:
                segmentSize = "medium";
                break;
            case dayTimeLine[i].segmentCount > 24:
                segmentSize = "large";
                break;

        }

        if (dayTimeLine[i].e) {
            i1 = "event";
        }

        if (dayTimeLine[i].roomNo) {
            rm = dayTimeLine[i].roomNo
        }

        html += '<div name="" id="' + rm + '" class="block ' + segmentSize + ' ' + i1 + '" style="width:' + dayTimeLine[i].segmentCount * ind + 'px">'
        html += '<h1>' + dayTimeLine[i].starTime + '<span> to ' + dayTimeLine[i].endTime + '</span></h1>'
        if (dayTimeLine[i].e) {
            html += '<p>' + dayTimeLine[i].e[0].uosName + '</p>'
        } else {
            html += '<p>All Access</p>'
        }
        html += '</div>'
    };
    html += '</div>';
    $('.timeLine').append(html);
}





function compareMilli(a, b) {
    if (a.startTime._d < b.startTime._d) return 0;
    if (a.startTime._d > b.startTime._d) return 1;
    return 0;
}

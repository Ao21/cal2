var db = require('../controllers/database');
var moment = require('moment');

// Get records from a city
exports.getTimetable = function(req, res) {

    var xmlData = [],
        days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        times = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        week = [],
        tData = [],
        results;

    var roomArray = ['Wilkinson 269 Mac Lab', 'Wilkinson 261 Digital Media Lab', 'Wilkinson 262 General Access Laboratory', 'Wilkinson 268 Sentient Laboratory']

    db.getRecords("", function(err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        // Respond with results as JSON
        getEvents(results, roomArray);

    });







    function getEvents(results, rooms) {

        for (var i = results.length - 1; i >= 0; i--) {
            var result = results[i];

            if (result.AlphaDigit != 'AlphaDigit') {

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
                        uosName: result.uos_name,
                        alphaDigit: result.AlphaDigit,
                        startDate: moment(result.start_day, "DDMMYYYY"),
                        endDate: moment(result.end_day, "DDMMYYYY").hours(23),
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
            }

        };

        var today = moment().day();
        for (var i = rooms.length - 1; i >= 0; i--) {
            getEventsByDay(today, rooms[i].trim());

        };


        res.render('timetable2', {
            dataJson: JSON.stringify(tData),
            data: tData,
            rooms: roomArray
        });


        //updateHeading();
        //updateLine();
        //var timerId = setInterval(updateHeading, 10000);
        //var timerId = setInterval(updateLine, 10000);






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

                    var difference = nextEvent.startTime.diff(currentTime, 'minutes');
                    addToSegment = difference / 5;
                    addToMinutes = difference;
                    block.segmentCount = addToSegment;
                    dayTimeLine.push(block);
                } else {
                    block.starTime = currentTime.format('ha');
                    block.endTime = moment(currentTime).set('hours', 21).format('ha');
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
        // createHtmlForDay(dayTimeLine, room);

        tData.push(dayTimeLine);



    }









    function compareMilli(a, b) {
        if (a.startTime._d < b.startTime._d) return 0;
        if (a.startTime._d > b.startTime._d) return 1;
        return 0;
    }


};
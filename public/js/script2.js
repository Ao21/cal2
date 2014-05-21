updateHeading();
updateLine();
var timerId = setInterval(updateHeading, 10000);
var timerId = setInterval(updateLine, 10000);



function updateHeading() {

    var a = [];
    for (var i = 0; i < tData.length; i++) {

        var now = moment();
        var html = "";
        html += "<div class='heading'><h1>Room " + tData[i][0].roomNo + "</h1><p>" + tData[i][0].room.replace('Wilkinson', "").replace(/[0-9]/g, '') + "<br>";
        var room = tData[i];
        for (var x = 0; x < room.length; x++) {
            var r = moment().range(room[x].range.start, room[x].range.end)
            if (r.contains(now)) {
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
updateHeading();
updateLine();
var timerId = setInterval(updateHeading, 10000);
var timerId = setInterval(updateLine, 10000);



function updateHeading(){
    console.log(uData);
    for (var i = uData.length - 1; i >= 0; i--) {
        
        $(uData[i].idSel).find('.heading').html(uData[i].html);
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

    $('h1.date').html(now.format('h.mmA'));

    if (now.isAfter(startTime) && now.isBefore(endTime)) {
        var linePoint = now.diff(startTime, 'minutes') * minuteLength;
        $('.line').css('left', linePoint);

    }


}

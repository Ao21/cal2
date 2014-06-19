$(document).ready(function() {

    var count = 0;
    var countMax = 4;

    $('#addRoom').click(function(e) {
        e.preventDefault();

        if (count != countMax) {
            $("#rooms option:selected").each(function() {
                if ($(this).attr('disabled') === 'disabled') {

                } else {
                    var selectedValues = $('#rooms').val();
                    $('#selectedRooms tbody').append('<tr><td><p style="float:left">' + selectedValues + '</p><button type="button" id="' + selectedValues + '" class="close" aria-hidden="true">&times;</button></td></tr>');
                    $("option[value='" + selectedValues + "']").attr("disabled", "disabled");
                    $("#rooms option:not([disabled])").first().attr("selected", "selected");
                    count++;

                    $('button.close[id="' + selectedValues + '"]').on('click', function() {
                        count--;
                        var sel = $(this).parent().find('p').html();
                        $("option[value='" + sel + "']").attr("disabled", false);
                        $(this).parent().remove();
                        $("#rooms option:not([disabled])").first().attr("selected", "selected");
                        updateButtons();

                    });
                }

            });

        }
        updateButtons();
    });


    function updateButtons() {
        if (count >= 4) {
            $('button#addRoom').addClass('disabled');
        } else {
            $('button#addRoom').removeClass('disabled');

        }
    }


    $('button#submit').click(function() {



        var subArray = [];

        var array = [];
        $('td p').each(function(t, val) {
            subArray.push({
                room: $(val).html()
            });
        });


        var object = {};
        object.name = $('#tName').val();


        object.array = JSON.stringify(subArray);


        console.log(JSON.stringify(subArray));








        $.ajax({
            type: "POST",
            url: '/createTimetable',
            data: object,
            dataType: 'json'
        });


    })







})

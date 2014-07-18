var db = require('../controllers/database');

/*
 * GET home page.
 */

exports.index = function(req, res) {

    db.getAllTimetables("", function(err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        // Respond with results as JSON

        console.log(results);

        res.render('index', {
            dataJson: JSON.stringify(results),

            data: results,
            title: 'Create a Timetable'
        });
    });


};



exports.renderTimetable = function(req, res) {

    db.getTimetableById(req.params.id, function(err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        // Respond with results as JSON

        console.log(results);



        res.render('index', {
            dataJson: JSON.stringify(results),

            data: results,
            title: 'Create a Timetable'
        });
    });


}

exports.upload = function(req, res) {
    res.render('upload', {
        title: 'Upload CSV'
    });
};


exports.createATimetable = function(req, res) {

    db.getAllRooms("", function(err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        results = trimValues(results);
        // Respond with results as JSON

        function trimValues(results) {
            for (var i = results.length - 1; i >= 0; i--) {
                console.log(results[i].venue_name);
                results[i].venue_name = results[i].venue_name.trim()
            };
            return results;
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

        res.render('createTimetable', {
            dataJson: JSON.stringify(results),


            data: results.sort(dynamicSort("venue_name")),
            title: 'Create a Timetable'
        });
    });

};



exports.createT = function(req, res) {
    var name = req.body.name;
    var rooms = req.body.array;

    var object = [name, rooms];

    var object = {
        name: name,
        rooms: rooms
    }


    db.createTimetable(object, function(err, result) {
        res.send(200, "success");
        

    })

}

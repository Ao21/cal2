var db = require('../controllers/database');

/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('index', {
        title: 'Express'
    });
};

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
        console.log(results);
        // Respond with results as JSON
        res.render('createTimetable', {
            data: results,
            title: 'Create a Timetable'
        });
    });

};
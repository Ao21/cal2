var fs = require('fs'),
    csv = require('csv'),
    mysql = require('mysql');
var db = require('../controllers/database');

/*
 * GET users listing.
 */


exports.data = function(req, res) {

    db.getRecords("", function(err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        }
        // Respond with results as JSON
        res.render('data', {
            data: results
        });
    });
};

exports.timetable = function(req, res) {

    res.render('timetable');


};


exports.upload = function(req, res) {

    csv()
        .from(fs.createReadStream(req.files.csvFile.path))
        .on('end', function() {
            console.log('done');
        })
        .to.array(function(data, count) {
            //console.log(data);
            blah(data);
        })

    res.send("respond with a resource");

};



blah = function(data) {

    db.insertRecords(data, function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
    })



}
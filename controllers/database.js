var mysql = require('mysql'),
    async = require('async');


/*
var client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'Ao21Ao21',
    database: 'mynode_db',
    connectionLimit: 10,
    supportBigNumbers: true
});


var pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT
});

*/
var client = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT

})



// Get records from a city
exports.getRecords = function(city, callback) {
    var sql = "SELECT * FROM timetable";
    /*
  
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    client.query('USE mynode_db');
    connection.query(sql, [city], function(err, results) {
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });

*/


    async.series([

        function clear(cb) {
            client.query(sql, [city], function(err, results) {
                callback(false, results)
            });
        }


    ], function(err, results) {
        if (err) {
            console.log('Exception initializing database.');
            throw err;
        } else {
            console.log('Database initialization complete.');

        }
    });




};



// Get records from a city
exports.getRecordsByVenue = function(venue, callback) {


};





exports.insertRecords = function(city, callback) {

    var sql2 = "INSERT INTO timetable (uos_name,AlphaDigit,sessionid,Label_code,Part_code,Part_title,class_code,class_title,nominal_size,size_limit,is_closed,start_day,end_day,frequency_description,day_of_week,start_time,end_time,venue_name,bookingid,family_name,given_names,usyd_intranet_login,building_code,capacity) VALUES ?";


    async.series([

        function clear(callback) {
            client.query('DROP DATABASE IF EXISTS mynode_db', callback);
        },
        function create_db(callback) {
            client.query('CREATE DATABASE mynode_db', callback);
        },
        function use_db(callback) {
            client.query('USE mynode_db', callback);
        },
        function create_table(callback) {
            client.query('CREATE TABLE timetable (' +
                'uos_name VARCHAR(40), ' +
                'AlphaDigit VARCHAR(40), ' +
                'sessionid VARCHAR(40), ' +
                'Label_code VARCHAR(40), ' +
                'Part_code VARCHAR(40), ' +
                'Part_title VARCHAR(40), ' +
                'class_code VARCHAR(40), ' +
                'class_title VARCHAR(40), ' +
                'nominal_size VARCHAR(40), ' +
                'size_limit VARCHAR(40), ' +
                'is_closed VARCHAR(40), ' +
                'start_day VARCHAR(40), ' +
                'end_day VARCHAR(40), ' +
                'frequency_description VARCHAR(40), ' +
                'day_of_week VARCHAR(40), ' +
                'start_time VARCHAR(40), ' +
                'end_time VARCHAR(40), ' +
                'venue_name VARCHAR(255), ' +
                'bookingid VARCHAR(40), ' +
                'family_name VARCHAR(40), ' +
                'given_names VARCHAR(40), ' +
                'usyd_intranet_login VARCHAR(40), ' +
                'building_code VARCHAR(40), ' +
                'capacity VARCHAR(40), ' +
                'ID MEDIUMINT NOT NULL AUTO_INCREMENT, ' +
                'PRIMARY KEY(ID))', callback);
        },
        function drop(callback) {
            client.query("DROP TABLE IF EXISTS timetable", callback);
        },
        function go(callback) {
            client.query('CREATE TABLE timetable (' + 'uos_name VARCHAR(40), ' + 'AlphaDigit VARCHAR(40), ' + 'sessionid VARCHAR(40), ' + 'Label_code VARCHAR(40), ' + 'Part_code VARCHAR(40), ' + 'Part_title VARCHAR(40), ' + 'class_code VARCHAR(40), ' + 'class_title VARCHAR(40), ' + 'nominal_size VARCHAR(40), ' + 'size_limit VARCHAR(40), ' + 'is_closed VARCHAR(40), ' + 'start_day VARCHAR(40), ' + 'end_day VARCHAR(40), ' + 'frequency_description VARCHAR(40), ' + 'day_of_week VARCHAR(40), ' + 'start_time VARCHAR(40), ' + 'end_time VARCHAR(40), ' + 'venue_name VARCHAR(255), ' + 'bookingid VARCHAR(40), ' + 'family_name VARCHAR(40), ' + 'given_names VARCHAR(40), ' + 'usyd_intranet_login VARCHAR(40), ' + 'building_code VARCHAR(40), ' + 'capacity VARCHAR(40), ' + 'ID MEDIUMINT NOT NULL AUTO_INCREMENT, ' + 'PRIMARY KEY(ID))', callback);
        },
        function clear(callback) {
            client.query(sql2, [city], callback);
        }


    ], function(err, results) {
        if (err) {
            console.log('Exception initializing database.');
            throw err;
        } else {
            console.log('Database initialization complete.');
        }
    });

};
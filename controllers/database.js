var mysql = require('mysql'),async = require('async');


/*
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'Ao21Ao21',
  database: 'mynode_db',
  connectionLimit: 10,
  supportBigNumbers: true
});
*/

var pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT
  connectionLimit: 10,
  supportBigNumbers: true
});


// Get records from a city
exports.getRecords = function(city, callback) {
  var sql = "SELECT * FROM timetable";
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    connection.query(sql, [city], function(err, results) {
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
};


exports.insertRecords = function(city, callback) {














  var sql = "INSERT INTO timetable (uos_name,AlphaDigit,sessionid,Label_code,Part_code,Part_title,class_code,class_title,nominal_size,size_limit,is_closed,start_day,end_day,frequency_description,day_of_week,start_time,end_time,venue_name,bookingid,family_name,given_names,usyd_intranet_login,building_code,capacity) VALUES ?";
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }

     pool.query("DROP TABLE IF EXISTS timetable", function(){

         pool.query('CREATE TABLE timetable (' +
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
                         'PRIMARY KEY(ID))', function(){


    // make the query
    connection.query(sql, [city], function(err, results) {
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
});

  });
};
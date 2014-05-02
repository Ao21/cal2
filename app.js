
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , uploadcsv = require('./routes/csvupload')
  , http = require('http')
  , fs = require('fs')
  , mysql = require('mysql')
  , async = require('async')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.set('connection', mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'Ao21Ao21'}));
  app.use(express.errorHandler());
});

app.configure('production', function() {
  console.log('Using production settings.');
  app.set('connection', mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT}));
});

app.get('/', routes.index);
app.get('/data', uploadcsv.data);
app.post('/uploadcsv', uploadcsv.upload);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


var client = app.get('connection');
async.series([
  function connect(callback) {
    client.connect(callback);
  },
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
  }
], function (err, results) {
  if (err) {
    console.log('Exception initializing database.');
    throw err;
  } else {
    console.log('Database initialization complete.');
  }
});

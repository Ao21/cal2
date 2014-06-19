/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    uploadcsv = require('./routes/csvupload'),
    timeTab = require('./controllers/timetable'),
    timeTab2 = require('./controllers/timetable2'),
    http = require('http'),
    fs = require('fs'),
    mysql = require('mysql'),
    async = require('async'),
    path = require('path'),
    db = require('./controllers/database');

var app = express();

app.configure(function() {
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

app.configure('development', function() {
    app.set('connection', mysql.createConnection({
        host: 'localhost',
        user: 'root',
        port: '3306',
        password: 'Ao21Ao21'
    }));
    app.use(express.errorHandler());
});

app.configure('production', function() {
    console.log('Using production settings.');
    app.set('connection', mysql.createConnection({
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT
    }));
});

app.get('/', routes.index);
app.get('/data', uploadcsv.data);
app.get('/timetable', uploadcsv.timetable);
app.get('/timetable2', timeTab.getTimetable);
app.post('/uploadcsv', uploadcsv.upload);
app.get('/upload', routes.upload);
app.get('/createTimetable', routes.createATimetable);
app.post('/createTimetable', routes.createT);

app.get('/tables/:id', timeTab2.getTimetable);

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

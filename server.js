'use strict'
var express = require('express');
var path=require('path');

var app = express();
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
        });

app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname+'/public/dash.mpd'));
        });


var server = app.listen(3000, function () {
                        
                        var host = server.address().address;
                        var port = server.address().port;
                        
                        console.log('Example app listening at '+ port);
                        
                        });
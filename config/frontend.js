var express = require('express');
var path = require('path');

module.exports = function(app) {

    console.log('Configuring frontend routes ' + __dirname);
    app.use('/js', express.static(__dirname + '/../dist/js'));
    app.use('/views', express.static(__dirname + '/../dist/views'));
    app.use('/css', express.static(__dirname + '/../dist/css'));
    app.use('/fonts', express.static(__dirname + '/../dist/fonts'));
    app.use('/assets', express.static(__dirname + '/../dist/assets'));

    app.use('/favicon.ico', express.static(__dirname + '/../dist/assets/favicon.png'));

    app.get('/*', function(req, res, next) {
        // Just send the index.html for other files to support HTML5Mode
        res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
    });

}
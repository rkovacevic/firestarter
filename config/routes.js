var fs = require('fs');
var mongoose = require('mongoose');

module.exports = function(app, passport) {

    // Bootstraps the controllers 
    fs.readdirSync(__dirname + '/../app/controllers').forEach(function(file) {
        if (~file.indexOf('.js')) {
            console.log('Bootstrapping controller: ' + file);
            require(file)(app, passport);
        }
    });

    require('frontend')(app);

    /**
     * Error handling
     */

    app.use(function(err, req, res, next) {
        // treat as 404
        if (err.message && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).send('Internal server error');
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next) {
        res.status(404).send('Not found');
    });
};
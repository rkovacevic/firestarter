var mongoose = require('mongoose');
var auth = require('passport/auth')

var User = mongoose.model('User');

module.exports = function(app, passport) {

    app.post('/api/users/me/subscriptions', function(req, res, next) {
        User.findOne({ _id: req.user._id }, function(err, user) {
            if (err) return res.status(500).send('Server error');
            user.subscriptions.push(req.body._id);
            user.save(function (err) {
                if (err) return res.status(500).send('Server error');
                return res.status(200).send('Subscribed');
            })
        });
    });

    app.delete('/api/users/me/subscriptions/:id', function(req, res, next) {
        req.user.subscriptions.splice(
            req.user.subscriptions.indexOf(req.params.id), 1);

        req.user.save(function (err) {
            if (err) return res.status(500).send('Server error');
            return res.status(200).send('Unsubscribed');
        });
        
    });
}
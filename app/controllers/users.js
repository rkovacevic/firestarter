var mongoose = require('mongoose');
var auth = require('passport/auth')

var User = mongoose.model('User');

module.exports = function(app, passport) {

    app.get('/api/users/me', auth.loggedIn, function(req, res, next) {
        User.findOne({
            _id: req.user._id
        })
            .populate('subscriptions', '_id name')
            .exec(function(err, user) {
                if (err) return res.status(500).send('Server error');
                return res.status(200).send(user);
            });
    });

    app.post('/api/users', function(req, res, next) {
        var user = new User(req.body);
        user.provider = 'local';

        User.count({
            'name': user.name
        }, function(error, result) {
            if (result > 0) {
                return res.status(400).send({
                    name: {
                        message: 'Already taken'
                    }
                })
            }

            User.count({
                'email': user.email
            }, function(error, result) {
                if (result > 0) {
                    return res.status(400).send({
                        name: {
                            message: 'Already registered, try logging in'
                        }
                    })
                }
                user.save(function(err) {
                    if (err) {
                        return res.status(400).send(err.errors);
                    }
                    req.logIn(user, function(err) {
                        if (err) {
                            return res.status(401).send(err);
                        }
                        return res.status(200).send(user);
                    });
                });
            })
        })
    });

    app.post('/api/users/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return res.status(401).send(info.message);
            }
            if (!user) {
                return res.status(401).send(info.message);
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.status(401).send(err);
                }
                User.findOne({
                    _id: req.user._id
                })
                    .populate('subscriptions', '_id name')
                    .exec(function(err, user) {
                        if (err) return res.status(500).send('Server error');
                        return res.status(200).send(user);
                    });
            });
        })(req, res, next);
    });

    // Remember Me middleware
    app.use(function(req, res, next) {
        if (req.method == 'POST' && req.url == '/api/users/login') {
            if (req.body.rememberme) {
                req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
            } else {
                req.session.cookie.expires = false;
            }
        }
        next();
    });

    app.post('/api/users/logout', auth.loggedIn, function(req, res) {
        req.logout();
        res.status(200).send('Logged out');
    });

    app.get('/api/users/suggested', auth.loggedIn, function(req, res, next) {
        User.find({})
            .where('_id').nin(req.user.subscriptions.concat([req.user._id]))
            .select('_id name email')
            .limit(10)
            .exec(function(err, users) {
                if (err) {
                    return res.status(500).send('Server error');
                }
                return res.status(200).send(users);
            })
    });
}
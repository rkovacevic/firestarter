var mongoose = require('mongoose');
var auth = require('passport/auth')

var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = function(app, passport) {

    app.get('/api/posts', auth.loggedIn, function(req, res, next) {
        Post.find({})
        .where('author').in(req.user.subscriptions.concat([req.user._id]))
        .limit(10)
        .sort('-postedDate')
        .populate('author', '_id name').exec(function(err, posts) {
            if (err) {
                return res.status(500).send('Server error');
            }
            return res.status(200).send(posts);
        })
    });

    app.post('/api/posts', auth.loggedIn, function(req, res, next) {
        var post = new Post(req.body);
        post.author = req.user._id;
        
        post.save(function(err) {
            if (err) {
                return res.status(500).send('Server error');
            }
            return res.status(200).send({
                _id: post._id,
                text: post.text,
                postedDate: post.postedDate,
                author: {
                    _id: req.user._id,
                    name: req.user.name
                }
            });
        });
    });

}
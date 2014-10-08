## Node + Express + Mongoose + AngularJS + Gulp Twitter clone demo app 

## Installation and Usage
    
    $ git clone https://github.com/rkovacevic/firestarter.git
    $ cd firestarter
    $ npm install (you may need to run it as sudo)
    $ npm start

## Deploying to Heroku

	$ heroku apps:create <APP_NAME>
	$ heroku config:set BUILDPACK_URL=https://github.com/appstack/heroku-buildpack-nodejs-gulp.git
	$ heroku config:set DB_URL=mongodb://<USERNAME>:<PASSWORD>@<SERVER>:<PORT>/<DATABASE>
	$ git push heroku master

## License

MIT

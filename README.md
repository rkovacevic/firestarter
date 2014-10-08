## Node + Express + Mongoose + AngularJS + Gulp Twitter clone demo app 

Demo

http://rkovacevic-firestarter.herokuapp.com/

## Installation and Usage
    
    $ git clone https://github.com/rkovacevic/firestarter.git
    $ cd firestarter
    $ npm install (you may need to run it as sudo)
    $ gulp --db mongodb://<USERNAME>:<PASSWORD>@<SERVER>:<PORT>/<DATABASE>

## Deploying to Heroku

	$ heroku apps:create <APP_NAME>
	$ heroku config:set NODE_ENV=production
	$ heroku config:set BUILDPACK_URL=https://github.com/rkovacevic/heroku-buildpack-nodejs-gulp-bower.git
	$ heroku config:set DB_URL=mongodb://<USERNAME>:<PASSWORD>@<SERVER>:<PORT>/<DATABASE>
	$ git push heroku master

## License

MIT

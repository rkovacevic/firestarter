var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rimraf = require('gulp-rimraf'),
    concat = require('gulp-concat'),
    concatVendor = require('gulp-concat-vendor'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    minifyCSS = require('gulp-minify-css'),
    es = require('event-stream'),
    embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    express = require('express'),
    http = require('http'),
    install = require('gulp-install'),
    nodemon = require('gulp-nodemon'),
    minimist = require('minimist'),
    gulpif = require('gulp-if'),
    runSequence = require('run-sequence'),
    lr = require('tiny-lr')();

var knownOptions = {
    string: ['db'],
    boolean: ['production'],
    default: {
        production: process.env.NODE_ENV === 'production'
    }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('clean', function() {
    // Clear the destination folder
    gulp.src('dist/**/*.*', {
        read: false
    })
        .pipe(rimraf({
            force: true
        }));
});

gulp.task('bower', function() { 
    return gulp.src(['./bower.json'])
        .pipe(install());
});

gulp.task('vendor-scripts', function() {
    return gulp.src(['bower_components/*'])
        .pipe(concatVendor('vendor.js'))
        .pipe(gulpif(options.production, uglify()))
        .pipe(gulp.dest('dist/js'))
        .pipe(refresh(lr));
});

gulp.task('scripts', function() {
    return gulp.src(['public/**/*.js', '!public/**/*_test.js'])
        .pipe(concat('main.js'))
        .pipe(gulpif(options.production, ngAnnotate()))
        .pipe(gulpif(options.production, uglify()))
        .pipe(gulp.dest('dist/js'))
        .pipe(refresh(lr));
});

gulp.task('styles', function() {
    return es.concat(
        gulp.src(['public/**/*.css', 'bower_components/**/*.css'])
        .pipe(concat('app.css'))
        .pipe(gulpif(options.production, minifyCSS()))
        .pipe(gulp.dest('dist/css'))
        .pipe(refresh(lr)),

        gulp.src(['bower_components/bootswatch-dist/fonts/*'])
        .pipe(gulp.dest('dist/fonts'))
        .pipe(refresh(lr))
    );
});

gulp.task('templates', function() {
    return gulp.src('./public/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('assets', function() {
    return gulp.src('./public/assets/**/*')
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('server', function() {
    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['public/**/*', 'dist/**/*'],
        env: {
            'NODE_ENV': options.production ? 'production' : 'development',
            'NODE_PATH': './config:./app/controllers',
            'DB_URL': options.db
        }
    })
        .on('restart', function() {
            console.log('Server restarted')
        });
});

gulp.task('lr-server', function() {
    if (options.production) return;

    // Create a LiveReload server
    lr.listen(35729, function(err) {
        if (err) {
            gutil.log(err);
        }
    });
});

gulp.task('watch', function() {
    if (options.production) return;

    gulp.watch('public/**/*.js', ['scripts']);
    gulp.watch('public/**/*.css', ['styles']);
    gulp.watch('public/**/*.html', ['templates']);
});


// The default task (called when you run `gulp`)
gulp.task('default', 
    function(callback) {
        runSequence('clean',
            ['scripts', 'bower', 'templates', 'assets'],
            ['vendor-scripts', 'styles'],
            ['lr-server', 'watch', 'server'],
            callback);
    });
gulp.task('heroku:production', 
    function(callback) {
        runSequence('clean',
            ['scripts', 'bower', 'templates', 'assets'],
            ['vendor-scripts', 'styles'],
            callback);
    });
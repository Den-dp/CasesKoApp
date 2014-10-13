var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');

// we'd need a slight delay to reload browsers connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 100;
var EXPRESS_APP_PORT = 5000;

/**
 * watching our expressjs server
 */
gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({
        script: 'server/app.js',
        env: {'PORT': EXPRESS_APP_PORT },
        watch: ['server/app.js', 'server/data.js']
    })
        .on('start', function onStart() {
            // ensure start only got called once
            if (!called) {
                cb();
            }
            called = true;
        })
        .on('restart', function onRestart() {
            // reload connected browsers after a slight delay
            setTimeout(function reload() {
                browserSync.reload({
                    stream: false
                });
            }, BROWSER_SYNC_RELOAD_DELAY);
        });
});

gulp.task('browser-sync', ['nodemon'], function () {
    browserSync.init({
        // watch the following files; changes will be injected (css & images) or cause browser to refresh
        files: ['client/**/*.{js,css,html}'],

        // informs browser-sync to proxy our expressjs app which would run at the following location
        proxy: 'http://localhost:' + EXPRESS_APP_PORT,

        // informs browser-sync to use the following port for the proxied app
        // so it must be not the same as EXPRESS_APP_PORT
        port: EXPRESS_APP_PORT + 1,

        notify: false,
        minify: false,
        logConnections: true
    });
});

gulp.task('default', ['browser-sync']);
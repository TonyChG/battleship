/* GULP
**
** Loads Plugins - first
**
** Luc Terracher - 2015
*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var conf = require('./config.json');

// [Task] Concat .js files
gulp.task('js', function(){
    return gulp.src(conf.path.js)
        .pipe(uglify())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(conf.path.build_js));
});

// [Task] Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(conf.path.sass)
        .pipe(plumber()) // Don't stop on error
        .pipe(sourcemaps.init()) // init sourcemap
        .pipe(sass(conf.sass_opt)) // scss process + options
        .on('error', notify.onError(function (error) { return conf.sass_error + error })) // Notify on error
        .pipe(sourcemaps.write(conf.path.sourcemap)) // write sourcemap
        .pipe(plumber.stop()) // plumber - stop before gulp.dest()
        .pipe(gulp.dest(conf.path.css)) // write the css file;
        .pipe(browserSync.stream()); // Sync devices
});

// [TASK] Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: {
            baseDir: conf.dev_url
        }
    });

    gulp.watch(conf.path.js, ['js']);
    gulp.watch(conf.path.sass, ['sass']);
    gulp.watch(conf.startfile).on("change", browserSync.reload);
});

gulp.task('default', ['serve']);

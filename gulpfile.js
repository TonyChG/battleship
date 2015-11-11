/* GULP
** Luc Terracher - 2015
*/

// ** Loads Plugins - first

var gulp = require('gulp');
var fs = require('fs');
var argv = require('yargs').argv;
var spawn = require('child_process').spawn;
var bump = require('gulp-bump');
var header = require("gulp-header");
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var rm = require('gulp-rimraf');
var conf = require('./config.json');
var pkg_version = require('./package.json').version;
console.log('YOLO V', pkg_version);

// Get copyright using NodeJs file system
var getCopyright = function () {
    return fs.readFileSync('Copyright');
};

// ** [Task] Clean js build folder
gulp.task('clean-js', function() {
    return gulp.src((conf.path.dist_js+'/*')).pipe(rm());
});

// ** [Task] Concat .js files + Uglify
gulp.task('js', ['clean-js'], function() {
    return gulp.src(conf.path.js)
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(concat(conf.build_appname))
            .pipe(uglify())
            .pipe(header(getCopyright(), {version: pkg_version}))
            .pipe(sourcemaps.write('../app'))
            .pipe(gulp.dest(conf.path.dist_js));
});

// ** [Task] Concat .js files + Uglify + JSHINT
gulp.task('js-jshint', function(){
    return gulp.src(conf.path.jshint_files)
        .pipe(jshint(conf.path.jshint))
        .pipe(jshint.reporter(stylish));
});

// ** [Task] Compile sass into CSS & auto-inject into browsers
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

// ** [TASK] Watchers for SCSS + JS + HTML + gulpfile
gulp.task('watchers', function() {
    if (conf.enable_js_hint) {
        gulp.watch(conf.path.js, ['clean-js', 'js', 'js-jshint']);
    } else {
        gulp.watch(conf.path.js, ['clean-js', 'js']);
    }
    gulp.watch(conf.path.sass, ['sass']);
    gulp.watch(conf.startfile).on("change", browserSync.reload);
});

// ** [TASK] Static Server
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: conf.dev_url
        }
    });
});


/*
** Main task
*/
gulp.task('default', ['clean-js', 'js', 'serve', 'watchers']);

/*
** Build task (todo: need to do scss part)
*/
gulp.task('build', ['clean-js', 'js']);


// ** Auto Reload the Gulpfile onChange
gulp.task('reload', function() {
    var p;

    gulp.watch('gulpfile.js', spawnChildren);
    spawnChildren();
    function spawnChildren(e) {
        if(p) { p.kill(); }
        console.log('DEBUG RELOAD:', argv.task);
        p = spawn('gulp', [argv.task], {stdio: 'inherit'});
    }
});

// ** Bump version of json files
gulp.task('bump', function(){
  gulp.src(["./bower.json", "./package.json"])
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});

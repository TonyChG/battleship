var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/main.scss")
        .pipe(sass())
        .pipe(gulp.dest("."))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    proxy: "http://localhost:8888/"
  });

  gulp.watch("app/scss/*.scss", ['sass']);
});

gulp.task('default', ['serve']);
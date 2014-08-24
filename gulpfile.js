
var gulp       = require('gulp');
var broswerify = require('gulp-browserify');
var jade       = require('gulp-jade');
var stylus     = require('gulp-stylus');

gulp.task('jade', function() {
    gulp.src('./html/**/*.jade')
        .pipe(jade({doctype: 'html'}))
        .pipe(gulp.dest(('./build')));
});

gulp.task('js', function() {
    gulp.src('./js/app.js')
        .pipe(broswerify())
        .pipe(gulp.dest('./build'));
});

gulp.task('styles', function() {
    gulp.src('./styles/main.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./build'));
});

gulp.task('img', function() {
    gulp.src('./img/**/*')
        .pipe(gulp.dest('./build/img'));
});



gulp.task('watch', ['js', 'jade', 'styles', 'img'], function() {

    gulp.watch('js/**/*.js', function() {
        gulp.run("js");
    });

    gulp.watch('html/**/*.jade', function() {
        gulp.run("jade");
    });

    gulp.watch('styles/**/*.styl', function() {
        gulp.run("styles");
    });

    gulp.watch('img/**/*', function() {
        gulp.run("img");
    });

});

gulp.task("default", ['js', 'jade', 'styles', 'img']);


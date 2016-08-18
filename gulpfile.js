'use strict';

const gulp = require('gulp');
const jade = require('gulp-jade');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const stylus = require('gulp-stylus');
const rigger = require('gulp-rigger');
const rimraf = require('rimraf');
const browserSync = require("browser-sync").create();;
const headerfooter = require('gulp-headerfooter');
const fs = require('fs');
const autoprefixer = require("gulp-autoprefixer");
const reload = browserSync.reload;

var path = {
	build: {
		html: '.',
		css: 'css/',
		js: 'js/'
	},
	src: {
		html: 'src/html/[^_]*.html',
		jade: 'src/jade/[^_]*.jade',
		style: 'src/sass/*.scss',
		stylus: 'src/stylus/*.styl',
		js: 'src/js/*.js'
	},
	watch: {
		html: 'src/html/**/*.html',
		jade: 'src/jade/**/*.jade',
		style: 'src/sass/**/*.scss',
		stylus: 'src/stylus/**/*.styl',
		js: 'src/js/**/*.js'
	}
};

gulp.task('clean', function (cb) {
	rimraf('./*.html', cb);
	rimraf('./css/', cb);
});

gulp.task('jade:build', function() {
	return gulp.src(path.src.jade)
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(path.build.html))
		.on('end',reload);
});

gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.on('end',reload);
});

gulp.task('style:build', function () {
	return gulp.src(path.src.style)
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(sass({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		//.pipe(autoprefixer())
		.pipe(gulp.dest(path.build.css))
		.on('end',reload);
});

gulp.task('stylus:build', function () {
	return gulp.src(path.src.stylus)
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(stylus({
			linenos: true,
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(autoprefixer())
		.pipe(gulp.dest(path.build.css))
		.on('end',reload);
});

gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.js))
		.on('end',reload)
});

gulp.task('build', gulp.series(
	'jade:build',
	'stylus:build',
	'js:build'
));


gulp.task('webserver', function () {
	browserSync.init({
		server: {
			baseDir: ""
		},
		tunnel: false,
		host: 'localhost',
		port: 9008,
		//reloadDelay: 5000,
		logPrefix: "Zzz"
	});

	gulp.watch(path.watch.html, gulp.series('html:build'), function(done) {
		browserSync.reload();
		done();
	});

	gulp.watch(path.watch.style, gulp.series('style:build'), function(done) {
		browserSync.reload();
		done();
	});

	gulp.watch(path.watch.js, gulp.series('js:build'), function(done) {
		browserSync.reload();
		done();
	});
});


gulp.task('watch', function(){
	gulp.watch(path.watch.jade, gulp.series('jade:build'));
	gulp.watch(path.watch.stylus, gulp.series('stylus:build'));
	gulp.watch(path.watch.js, gulp.series('js:build'));
	//browserSync.watch(`${options.src}/**/*.*`).on('change', browserSync.reload);
});


gulp.task('run', gulp.parallel('webserver','watch'));
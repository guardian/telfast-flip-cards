'use strict';

var
gulp            = require('gulp'),
autoprefixer    = require('gulp-autoprefixer'),
argv            = require('yargs').argv,
browserify      = require('browserify'),
buffer          = require('vinyl-buffer'),
del             = require('del'),
gulpif          = require('gulp-if-else'),
header          = require('gulp-header'),
htmlmin 				= require('gulp-htmlmin'),
jshint          = require('gulp-jshint'),
less            = require('gulp-less'),
livereload      = require('gulp-livereload'),
minifyCSS       = require('gulp-clean-css'),
notify          = require('gulp-notify'),
path            = require('path'),
pug 						= require('gulp-pug'),
rename 					= require('gulp-rename'),
source          = require('vinyl-source-stream'),
sourcemaps      = require('gulp-sourcemaps'),
stylish         = require('jshint-stylish'),
uglify          = require('gulp-uglify'),
watchify        = require('watchify');

var cwd = process.cwd();
var pkg = require('./package.json');


// set up folder paths
var devDir = path.join(cwd, 'dev/');
var distDir = path.join(cwd, 'public/');

var banner = ['/**!',
	' * <%= pkg.name %> - <%= pkg.description %>',
	' * @version v<%= pkg.version %>',
	' * @license <%= pkg.license %>',
	' */',
	''].join('\n');

// error reporting
var notifyError = function(title) {
	return function(err) {
		notify.onError({
			title:    title,
			subtitle: 'Build Failed!',
			message:  '<%= error.message %>',
			sound:    'Beep'
		})(err);
		//end calling task, prevent subsequent steps
		this.emit('end');
	};
};

// gulp build --production
var production = !!argv.production;
var watching = argv._.length ? argv._[0] === 'watch' : true;

// --------------------------
// Gulp tasks
// --------------------------

gulp.task('default', ['watch']);

gulp.task('build', [
	//'clean',
	'rebuild'
]);

gulp.task('rebuild', [
	'less',
	'pug2html',
	'copy-assets',
	'browserify',
	'lintjs'
]);

// watch for changes
gulp.task('watch', [
		'rebuild'
	],
	function() {
		livereload.listen();
		gulp.watch(devDir + 'assets/less/**/*.less', ['less']);
		gulp.watch(devDir + '**/*.jade', ['pug2html']);
		// gulp.watch(devDir + '**/*.php', ['php2html']);
		gulp.watch(devDir + 'assets/img/**/*', ['copy-images']);
		gulp.watch(devDir + 'assets/js/**/*.js', ['lintjs']);

		// note : App JS is watched by watchify

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload browser on change
    gulp.watch([
        distDir + '**/*.css',
        distDir + '**/*.js'
    ]).on('change', livereload.changed);

	}
);

// --------------------------
// HTML tasks
// --------------------------


gulp.task('pug2html', function() {

	function renameToHtml(path) {
		path.extname = '.html';
	}

	return gulp.src(devDir + '/**/index.jade')
		.pipe(pug({ basedir: devDir + '/', doctype: 'html', pretty: false }))
		.pipe(htmlmin())
		.pipe(rename(renameToHtml))
		.pipe(gulp.dest(distDir))
		.pipe(notify({'onLast': true, message: 'Compiled Pug Templates' }));
});


// --------------------------
// Javascript tasks
// --------------------------

// lint js

function doJSHint(files) {
	return gulp.src(files)
		.pipe(jshint({'camelcase': false}))
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'))
		.on('error', notifyError('JS Lint'))
		.pipe(notify({
			'onLast': true,
			message: 'Linted JS'
		}));
}

gulp.task('lintjs', function() {
	return doJSHint([
		'gulpfile.js',
		devDir + 'assets/js/app.js',
		devDir + 'assets/js/src/**/*.js'
	]);
});


// Browserify App JS
gulp.task('browserify', function() {
	var bundler = browserify(devDir + 'assets/js/app.js', {
			debug: !production,
			cache: {}
		}
	);

	if (watching) {
		bundler = watchify(bundler);
	}

	var rebundle = function() {
		return bundler
			.transform('babelify')
			.bundle()
			.on('error', notifyError('Browserify JS'))
			.pipe(source('bundle.js'))
			.pipe(buffer())
			.pipe(gulpif(!production, function() {
				return sourcemaps.init({loadMaps: true});
			}))
			.pipe(gulpif(production, uglify))
			.pipe(header(banner, { pkg : pkg } ))
			.pipe(gulpif(!production, function() {
				return sourcemaps.write('./');
			}))
			.pipe(gulp.dest(distDir + 'assets/js/'))
			.pipe(livereload())
			.pipe(notify({
				'onLast': true,
				message: 'Browserified JS'
			}));
	};
	bundler.on('update', rebundle);
	return rebundle();
});




// --------------------------
// CSS tasks
// --------------------------

gulp.task('less', function() {
	return gulp.src(devDir + 'assets/less/style.less')
		.pipe(gulpif(!production, function() {
			return sourcemaps.init({loadMaps: true});
		}))
		.pipe(less())
		.on('error', notifyError('Less Compile'))
		.pipe(autoprefixer())
		.pipe(minifyCSS())
		.pipe(gulpif(!production, function() {
			return sourcemaps.write('./');
		}))
		.pipe(gulp.dest(distDir + 'assets/css/'))
		.pipe(notify({
			'onLast': true,
			message: 'Compiled LESS'
		}));
});


// --------------------------
// First run & build tasks
// --------------------------

// clean build files
gulp.task('clean', function() {
	return del([distDir]);
});


// copy relevant folders from dev to dist locations

gulp.task('copy-assets', [
	'copy-images'
]);

gulp.task('copy-images', function() {
	return gulp.src(devDir + 'assets/img/**/*')
		.pipe(gulp.dest(distDir + 'assets/img'))
		.pipe(notify({'onLast': true, message: 'Copied Images' }));
});

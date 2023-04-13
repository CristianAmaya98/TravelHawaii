const { src, dest, series, parallel, watch } = require('gulp');

/* GENERAL */
const sourcemaps = require('gulp-sourcemaps');

/* HTML */
const fileinclude = require('gulp-file-include');
const formatHtml = require('gulp-format-html');
const removeEmptyLines = require('gulp-remove-empty-lines');
const htmlmin = require('gulp-htmlmin');

/* SCSS */
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');

/* WEB SERVER */
const connect = require('gulp-connect');

const config = {
	env: {
		production: false,
		name: 'TravelHawaii',
		port: 3070,
		root: './dist',
	},
	html: {
		src: ['./src/index.html'],
		watch: ['./src/**/*.html'],
		dest: './dist',
	},
	scss: {
		src: ['./src/scss/app.scss'],
		watch: ['./src/scss/**/*.scss'],
		dest: './dist',
	},
	assets: {
		src: ['./src/assets/**/*'],
		watch: ['./src/assets/**/*'],
		dest: './dist/assets',
	},
};

function taskCompilarHTML() {
	return src(config.html.src)
		.pipe(
			fileinclude({
				prefix: '@@',
				basepath: '@file',
			})
		)
		.pipe(removeEmptyLines())
		.pipe(formatHtml())
		.pipe(
			htmlmin({
				collapseWhitespace: config.env.production,
				removeComments: config.env.production,
			})
		)
		.pipe(dest(config.html.dest))
		.pipe(connect.reload());
}

function taskCompilarSCSS() {
	return src(config.scss.src)
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				outputStyle: config.env.production ? 'compressed' : 'expanded',
			}).on('error', sass.logError)
		)
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(cssnano())
		.pipe(sourcemaps.write())
		.pipe(dest(config.scss.dest))
		.pipe(connect.reload());
}

function assetsTransfer() {
	return src(config.assets.src)
		.pipe(dest(config.assets.dest))
		.pipe(connect.reload());
}

function connectLiveReload() {
	connect.server({
		name: config.env.name,
		root: config.env.root,
		livereload: true,
		port: config.env.port,
	});
}

function watchAndReload() {
	watch(config.html.watch, taskCompilarHTML);
	watch(config.scss.watch, taskCompilarSCSS);
}

exports.dev = series(
	taskCompilarHTML,
	taskCompilarSCSS,
	assetsTransfer,
	parallel(watchAndReload, connectLiveReload)
);

/*jslint node: true */
"use strict";

/* Gulp variables */
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
//var sass = require('gulp-sass');
var sass = require('gulp-ruby-sass');
var minifyCss = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var rename = require('gulp-rename');
var sh = require('shelljs');
var replace = require('replace'); /*`npm install --save replace` */
var templateCache = require('gulp-angular-templatecache');
var flatten = require('gulp-flatten');
var del = require('del');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var shell = require('gulp-shell');


var replaceFiles = ['./dev/app/shared/constants.js'];
var DevelopmnetPaths = {
  sass: ['./scss/**/*.scss'],
  templates: ['./dev/app/**/*.html'],
  js: ['./dev/app/**/*.js'],
  jslist: [
    './dev/**/*app.module.js',
    './dev/**/*app.routes.js',
    './dev/**/*app.config.js',
    './dev/app/shared/shared.js',
    './dev/app/shared/constants.js',
    './dev/app/shared/**/*.js',
    './dev/app/**/*.js',
    './dev/app/*.js',
    './dev/output-temp/templates-cached.js'
  ]
};


/* Gulp taks */
gulp.task('default', ['sass']);

gulp.task('install', ['git-check'], GulpInstall);
gulp.task('git-check', GulpGitCheck);

gulp.task('sass', GulpSass);

gulp.task('clean-templates-outputfolder', GulpCleanTemplatesOutput); //partial task
gulp.task('minify-html', GulpMinifyHtml); //partial task
gulp.task('cache-templates', GulpCacheTheTemplates); //partial task
gulp.task('prepare-templates', GulpPrepareTemplates);

gulp.task('watch', GulpWatch);

gulp.task('clean-javascript-outputfolder', GulpCleanJavascriptOutput); //partial task
gulp.task('concat-project-js', GulpConcatProjectJs);
gulp.task('prepare-js', GulpPrepareJs);

gulp.task('add-proxy', GulpAddProxyInDev);
gulp.task('remove-proxy', GulpRemoveProxyInDev);
gulp.task('minify-js', ['sass', 'prepare-templates'], GulpMinifyJs);

gulp.task('build-browser', GulpSetupDevelopment);
gulp.task('build-device', GulpSetupProduction);




gulp.task('run-android', shell.task([
  'gulp build-device',
  'ionic run android'
]));

/* Gulp Callback functions */

function GulpSetupProduction() {
  return runSequence('remove-proxy', 'sass', 'prepare-templates', 'prepare-js');//, 'minify-js');
}

function GulpSetupDevelopment() {
  return runSequence('add-proxy', 'sass', 'prepare-templates', 'prepare-js');
}

function GulpMinifyJs() {
  return gulp.src("./www/js/app.js")
    .pipe(uglify())
    .pipe(gulp.dest("./www/js/"));
}

function GulpConcatProjectJs() {
  var source = [].concat(
    DevelopmnetPaths.jslist);
  return gulp.src(source)
    .pipe(concat("app.js"))
    .pipe(gulp.dest("./www/js/"));
}

function GulpPrepareJs() {
  return runSequence('clean-javascript-outputfolder', 'concat-project-js');
}

function GulpCleanTemplatesOutput() {
  return del(['./www/templates/**/*']);
}

function GulpCleanJavascriptOutput() {
  return del(['www/js/**/*']);
}

function GulpMinifyHtml() {
  var opts = {
    comments: true,
    conditionals: true,
    spare: true,
    empty: true
  };
  return gulp.src('./dev/app/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(flatten())
    .pipe(gulp.dest('./www/templates/'));
}

function GulpPrepareTemplates() {
  return runSequence('clean-templates-outputfolder', 'minify-html', 'cache-templates');
}

function GulpCacheTheTemplates() {
  return gulp
    .src("./www/templates/*.html")
    .pipe(templateCache("templates-cached.js", {
      module: "starter",
      standalone: false,
      root: "./templates/"
    }))
    .pipe(gulp.dest("./dev/output-temp/"));
}

function GulpSass(done) {
   sass('./scss/ionic.app.scss').pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
}

// function GulpSass(done) {
//   gulp.src('./scss/ionic.app.scss')
//     .pipe(sass({
//       errLogToConsole: true
//     }))
//     .pipe(gulp.dest('./www/css/'))
//     .pipe(minifyCss({
//       keepSpecialComments: 0
//     }))
//     .pipe(rename({
//       extname: '.min.css'
//     }))
//     .pipe(gulp.dest('./www/css/'))
//     .on('end', done);
// }

function GulpWatch() {
  gulp.watch(DevelopmnetPaths.sass, ['sass']);
  gulp.watch(DevelopmnetPaths.templates, ['prepare-templates']);
  gulp.watch(DevelopmnetPaths.js, ['prepare-js']);
}

function GulpInstall() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
}

function GulpGitCheck(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
}

function GulpAddProxyInDev() {
  return replace({
    regex: "http://DOMAIN/api/",
    replacement: "http://localhost:8100/api/api/",
    paths: replaceFiles,
    recursive: false,
    silent: false,
  });
}

function GulpRemoveProxyInDev() {
  return replace({
    regex: "http://localhost:8100/api/api/",
    replacement: "http://DOMAIN/api/",
    paths: replaceFiles,
    recursive: false,
    silent: false,
  });
}

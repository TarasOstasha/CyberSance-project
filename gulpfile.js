const gulp = require('gulp');
const nano = require('gulp-cssnano');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const terser = require('gulp-terser');

// Less Task
function lessTask() {
  return gulp
    .src('./src/styles/main.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer(['last 15 versions', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(nano())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Bower CSS Task
function bowerCssTask() {
  return gulp
    .src([
      'src/bower/bootstrap/dist/css/bootstrap.css', // Correct Bootstrap path
      'src/bower/toastr/toastr.min.css',
    ])
    .pipe(sourcemaps.init())
    .pipe(nano())
    .pipe(concat('bower.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'));
}

// Images Task
function imagesTask() {
  return gulp.src('./src/images/**/*.{jpg,png}').pipe(gulp.dest('dist/images'));
}

// Fonts Task
function fontsTask() {
  return gulp
    .src('src/fonts/**/*.*') // Correct path to the fonts directory
    .pipe(gulp.dest('dist/fonts')); // Output to the dist folder
}

// HTML Task
function htmlTask() {
  return gulp.src('src/**/*.html').pipe(gulp.dest('dist'));
}

// Bower JS Task
function bowerJsTask() {
  return gulp
    .src([
      'src/bower/jquery/dist/jquery.js',
      'src/bower/bootstrap/dist/js/bootstrap.js',
      'src/bower/toastr/toastr.js',
    ])
    .pipe(concat('bower.min.js'))
    .pipe(terser()) // Replace uglify() with terser()
    .pipe(gulp.dest('dist/js'));
}

// Main JS Task
function mainJsTask() {
  return gulp
    .src('src/scripts/main.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(terser()) // Replace uglify() with terser()
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
}

// BrowserSync Task
function browserSyncTask(cb) {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    notify: false,
  });
  cb();
}

// Watch Task
function watchTask() {
  gulp.watch('src/styles/**/*.less', lessTask);
  gulp.watch('src/**/*.html', gulp.series(htmlTask, browserSync.reload));
  gulp.watch('src/scripts/*.js', gulp.series(mainJsTask, browserSync.reload));
}

// Default Task
const build = gulp.series(
  gulp.parallel(
    htmlTask,
    imagesTask,
    lessTask,
    bowerCssTask,
    bowerJsTask,
    fontsTask,
    mainJsTask,
  ),
  gulp.parallel(browserSyncTask, watchTask),
);

exports.less = lessTask;
exports.bowerCss = bowerCssTask;
exports.images = imagesTask;
exports.fonts = fontsTask;
exports.html = htmlTask;
exports.bowerJs = bowerJsTask;
exports.mainJs = mainJsTask;
exports.browserSync = browserSyncTask;
exports.watch = watchTask;
exports.default = build;

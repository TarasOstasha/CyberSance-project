const gulp = require('gulp');
const nano = require('gulp-cssnano');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const terser = require('gulp-terser');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const { src, dest, watch, series, parallel } = require('gulp');

// Error Handler
function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

// Less Task
function lessTask() {
  return gulp
    .src('./src/styles/main.less')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 15 versions', 'ie 8', 'ie 7'],
        cascade: false,
      }),
    )
    .pipe(nano())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Bower CSS Task
function bowerCssTask() {
  return gulp
    .src([
      'src/bower/bootstrap/dist/css/bootstrap.css',
      'src/bower/toastr/toastr.min.css',
    ])
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(sourcemaps.init())
    .pipe(nano())
    .pipe(concat('bower.min.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('dist/css'));
}

// Images Task
function imagesTask() {
  return gulp
    .src('./src/images/**/*.{svg}')
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.gifsicle({ interlaced: true }),
        imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
      ]),
    )
    .pipe(gulp.dest('dist/images'))
    .on('end', () => console.log('Images optimized successfully!'));
}


// Fonts Task
function fontsTask() {
  return gulp
    .src('src/fonts/**/*.*')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(gulp.dest('dist/fonts'));
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
      'src/bower/bootstrap/dist/js/bootstrap.min.js',
      'src/bower/toastr/toastr.js',
    ])
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(concat('bower.min.js'))
    .pipe(terser())
    .pipe(gulp.dest('dist/js'));
}

// Main JS Task
function mainJsTask() {
  return gulp
    .src('src/scripts/main.js')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('dist/js'));
}

// BrowserSync Task
function browserSyncTask(cb) {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    notify: false,
    open: true,
  });
  cb();
}

// Watch Task
function watchTask() {
  gulp.watch('src/styles/**/*.less', gulp.series(lessTask));
  gulp.watch(
    'src/**/*.html',
    gulp.series(htmlTask, (cb) => {
      browserSync.reload();
      cb();
    }),
  );
  gulp.watch(
    'src/scripts/**/*.js',
    gulp.series(mainJsTask, (cb) => {
      browserSync.reload();
      cb();
    }),
  );
  gulp.watch(
    'src/images/**/*.{jpg,png,svg}',
    gulp.series(imagesTask, (cb) => {
      browserSync.reload();
      cb();
    }),
  );
}

// Default Task
const build = gulp.series(
  gulp.parallel(
    htmlTask,
    imagesTask,
    bowerCssTask,
    bowerJsTask,
    fontsTask,
    mainJsTask,
    lessTask
  ),
  gulp.parallel(browserSyncTask, watchTask),
);

exports.default = build;
exports.imagesTask = imagesTask;
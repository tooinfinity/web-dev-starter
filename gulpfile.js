var
    gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    pug = require("gulp-pug"),
    rename = require('gulp-rename'),
    notify = require("gulp-notify"),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber'),
    uglify = require("gulp-uglify");
var browserSync = require("browser-sync").create();

// compile es6 javascript and concat in one file

function script() {
    return gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'))
}

// compile scss file and minified to css on dist folder

function style() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer('last 2 versions'), cssnano()]))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify({
            message: 'Compile and minified <%= file.relative %> success'
        }))
}

// compile pug file to html on public folder
function html() {
    return gulp.src('./src/html/**/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(notify({
            message: 'Compile <%= file.relative %> success'
        }))
}


function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch('./src/html/**/*.pug', html).on('change', browserSync.reload);
    gulp.watch('./src/scss/**/*.scss', style).on('change', browserSync.reload);
    gulp.watch('./src/js/**/*.js', script).on('change', browserSync.reload);
}

exports.script = script;
exports.style = style;
exports.html = html;
exports.watch = watch;


exports.build = gulp.series(gulp.parallel(style, html, script), watch);
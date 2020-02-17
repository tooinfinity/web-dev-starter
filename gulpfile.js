var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    pug = require("gulp-pug"),
    rename = require('gulp-rename'),
    notify = require("gulp-notify");
var browserSync = require("browser-sync").create();

// compile scss file to css on public folder
function style() {
    return gulp.src('./src/assets/scss/**/*.scss')
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer('last 2 versions')]))
        .pipe(gulp.dest('./public/assets/css'))
        .pipe(notify({
            message: 'Compile <%= file.relative %> success'
        }));
}
// compile scss file and minified to css on dist folder
function styleMin() {
    return gulp.src('./src/assets/scss/**/*.scss')
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
        .pipe(gulp.dest('./dist/assets/css'))
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
        .pipe(gulp.dest('./public'))
        .pipe(notify({
            message: 'Compile <%= file.relative %> success'
        }))
}
// compile pug file and minified to html on dist folder
function htmlMin() {
    return gulp.src('./src/html/**/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('./dist'))
        .pipe(notify({
            message: 'Compile and minified <%= file.relative %> success'
        }))
}



function watch() {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
    gulp.watch('./src/assets/scss/**/*.scss', style).on('change', browserSync.reload);
    gulp.watch('./src/html/**/*.pug', html).on('change', browserSync.reload);
}

exports.style = style;
exports.styleMin = styleMin;
exports.html = html;
exports.htmlMin = htmlMin;

exports.watch = watch
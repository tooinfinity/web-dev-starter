var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync").create();

const sourcefile = './src/assets/scss/**/*.scss';
const distfile = './dist/assets/css';


function style() {
    return (
        gulp
        .src(sourcefile)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sass())
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }), cssnano()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distfile))
    );
}
exports.style = style;

function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch(sourcefile, style);
    gulp.watch(sourcefile).on('change', browserSync.reload);
}

exports.watch = watch
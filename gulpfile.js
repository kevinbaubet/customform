const packagejson = require('./package.json');
const plugins = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

// Compilation SASS
function sass(pumpCallback) {
    return plugins.pump([
        plugins.gulp.src('./src/**/*.scss'),
        plugins.sass(packagejson.sass),
        plugins.postcss([
            plugins.autoprefixer(packagejson.autoprefixer),
            plugins.postcssPxtorem(packagejson.pxtorem)
        ]),
        plugins.gulp.dest('./dist/')
    ], pumpCallback);
}

// Watch SASS
function watchsass() {
    plugins.gulp.watch('./src/**/*.scss', plugins.gulp.parallel(sass))
}

// Minify
function minify(pumpCallback) {
    return plugins.pump([
        plugins.gulp.src('./src/**/*.js'),
        plugins.uglify(),
        plugins.rename(function (path) {
            path.extname = '.min.js'
        }),
        plugins.gulp.dest('./dist/')
    ], pumpCallback);
}

// Alias
exports.default = plugins.gulp.series(sass, watchsass);
exports.prod = plugins.gulp.parallel(sass, minify);
const package = require('./package.json');
const plugins = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

// Compilation SASS
plugins.gulp.task('sass', function () {
    return plugins.gulp.src('./src/**/*.scss')
        .pipe(plugins.sass(package.sass).on('error', plugins.sass.logError))
        .pipe(plugins.postcss([
            plugins.autoprefixer(package.autoprefixer),
            plugins.postcssPxtorem(package.pxtorem)
        ]))
        .pipe(plugins.gulp.dest('./dist/'));
});

// Watch SASS
plugins.gulp.task('watchsass', function () {
    plugins.gulp.watch('./src/**/*.scss', ['sass']);
});

// Minify
plugins.gulp.task('minify', function() {
    return plugins.gulp.src('./src/**/*.js')
        .pipe(plugins.uglify()).on('error', function (error) {
            console.error(error);
        })
        .pipe(plugins.rename(function (path) {
            path.extname = '.min.js'
         }))
        .pipe(plugins.gulp.dest('./dist/'));
});

// Alias
plugins.gulp.task('default', ['sass', 'watchsass']);
plugins.gulp.task('prod', ['sass', 'minify']);
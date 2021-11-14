const gulp = require('gulp');
const themeKit = require('@shopify/themekit');
var sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');


gulp.task('sass',function(){
    return gulp.src('styles/custom-styles.scss')
            .pipe(sass())
            .pipe(cleanCSS({compatibility: 'ie11'})) // minify css
            .pipe(gulp.dest('assets'))
});


gulp.task('watch',function(){
    gulp.watch('styles/**/*.scss',gulp.series('sass'))
    themeKit.command('watch', {
        env: 'development'
    })
});



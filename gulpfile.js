var gulp = require('gulp')
var less = require('gulp-less')
var AutoPrefixerPlugin = require('less-plugin-autoprefix')

var autoprefixer = new AutoPrefixerPlugin({browsers: ['> 2%']})

gulp.task('less', function () {
  return gulp.src('src/main.less')
    .pipe(less({plugins: [autoprefixer]}))
    .pipe(gulp.dest('public/css'))
})

gulp.task('watch', function () {
  return gulp.watch('src/**/*.less', ['less'])
})

gulp.task('default', ['less', 'watch'])

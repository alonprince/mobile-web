# require('coffee-script/register')
gulp = require 'gulp'
coffee = require 'gulp-coffee'

paths = 
    scripts: ['js/*.coffee']


gulp.task 'scripts',  () ->
    gulp.src(paths.scripts)
      .pipe(coffee())
    .pipe(gulp.dest './js')

gulp.task 'watch', () ->
    gulp.watch paths.scripts, ['scripts']

gulp.task 'default', ['watch', 'scripts']
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const del = require('del');

gulp.task('watch', (done) => {
  gulp.watch('assets/**/*.css', (done) => {
    gulp
      .src('assets/**/*.css')
      .pipe(rev())
      .pipe(gulp.dest('public/assets'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('public/assets'));

    done();
  });
});

gulp.task('scss', (done) => {
  console.log('minifying css...');
  gulp
    .src('assets/scss/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('assets/css'));

  done();
});

gulp.task('cleanup_assets', (done) => {
  console.log('cleaning up...');
  del.sync(['public', 'assets/css']);
  done();
});

gulp.task('build', gulp.series('cleanup_assets', 'scss', 'watch'), (done) => {
  console.log('building assets...');
  done();
});

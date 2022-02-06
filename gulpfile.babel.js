import gulp from 'gulp';
import del from 'del';
import gulpWebserver from 'gulp-webserver';
import fileinclude from 'gulp-file-include';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import bro from 'gulp-bro';
import babelify from 'babelify';
import gulpImage from 'gulp-image';

const sass = gulpSass(dartSass);
const routes = {
  html: {
    watch: 'src/**/*.html',
    src: 'src/*.html',
    dest: 'build'
  },
  scss: {
    watch: 'src/scss/**/*.scss',
    src: 'src/scss/main.scss',
    dest: 'build/css'
  },
  js: {
    watch: 'src/js/**/*.js',
    src: 'src/js/main.js',
    dest: 'build/js'
  },
  img: {
    src: 'src/images/*',
    dest: 'build/images'
  }
}

const clean = () => del(['build']);

const webserver = () =>
  gulp
    .src('build')
    .pipe(gulpWebserver({
      livereload: true,
      open: true
    }));

const html = () =>
  gulp
    .src(routes.html.src)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(routes.html.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(bro({
      transform: [
        babelify.configure({ presets: ['@babel/preset-env'] }),
        [ 'uglifyify', { global: true } ]
      ]
    }))
    .pipe(gulp.dest(routes.js.dest));

const img = () =>
  gulp
    .src(routes.img.src)
    .pipe(gulpImage())
    .pipe(gulp.dest(routes.img.dest));

const watch = () => {
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
  gulp.watch(routes.img.src, img);
};

const prepare = gulp.series([clean, img]);
const assets = gulp.series([html, styles, js]);
const live = gulp.series([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
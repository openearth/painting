// generated on 2015-06-30 using generator-gulp-webapp 1.0.2
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import githubPages from 'gulp-gh-pages';
import concat from 'gulp-concat';
import debug from 'gulp-debug';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';
import jsonServer from 'json-server';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const es6LintOptions = {
  extends: 'eslint:recommended',
  baseConfig: {
    parser: 'babel-eslint'
  },
  ecmaFeatures: {
    'modules': true
  },
  env: {
    es6: true
  }
};
const bs = browserSync.create();

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src([
    'app/scripts/**/*.js'
  ])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!bs.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  },
  globals: {
    assert: false,
    expect: false,
    should: false
  }
};

gulp.task('lint', lint('app/scripts/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/**/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.debug())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe($.if('*.html', $.minifyHtml({conditionals: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
               .on('error', function (err) {
                 console.log(err);
                 this.end();
               })))
    .pipe(gulp.dest('dist/images'));
});

// referenced wrong....
gulp.task('moreimages', () => {
  return gulp.src([
    'bower_components/mapbox.js/**/*.{png,jpg,svg}'
  ])
    .pipe(gulp.dest('dist/styles'));
});


gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}',
    base: '.'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('morefonts', () => {
  // some fonts are expected in certain locations
  return gulp.src([
    'bower_components/open-sans-fontface/fonts/**/*.{eot,svg,ttf,woff,woff2}',
    'bower_components/roboto-fontface/fonts/**/*.{eot,svg,ttf,woff,woff2}'
  ])
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));

});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});
gulp.task('data', () => {
  return gulp.src([
    'app/data/**/*'
  ]).pipe(gulp.dest('dist/data'));
});

gulp.task('models', () => {
  return gulp.src([
    'app/models/**/*'
  ]).pipe(gulp.dest('dist/models'));
});



gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'scripts', 'fonts', 'templates'], () => {
  bs.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  }, function (err, bs) {

    var jsonApi = jsonServer.create({
      static: 'models'
    });
    jsonApi.use(jsonServer.defaults());
    jsonApi.use(jsonServer.router('app/data/db.json'));
    bs.app.use('/api', jsonApi);

  });
  gulp.watch([
    'app/*.html',
    'app/templates/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/templates/**/*.html', ['templates']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  bs.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', () => {
  bs.init({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('templates', [], () => {
  return gulp.src('app/templates/*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(concat('templates.html'))
  // this is used in serve and in build
    .pipe(gulp.dest('.tmp/templates'))
    .pipe(gulp.dest('dist/templates'));
});

gulp.task('build', ['lint', 'html', 'images', 'moreimages', 'fonts', 'morefonts', 'extras', 'data', 'models', 'templates'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(githubPages());
});

var gulp        = require('gulp'),
    frontmatter = require('gulp-front-matter'),
    md          = require('gulp-markdown-it'),
    minify      = require('gulp-minify-html'),
    rename      = require('gulp-rename'),
    compass     = require('gulp-compass'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    clean       = require('gulp-rimraf'),
    gutil       = require('gulp-util'),
    coffee      = require('gulp-coffee'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    path        = require('path'),
    swig        = require('swig'),
    through     = require('through2'),
    browsersync = require('browser-sync').create(),
    site        = require('./site.json'),
    deploy      = require('gulp-gh-pages'),
    repostname  = /(\d{4})-(\d{1,2})-(\d{1,2})-(.*)/;

site.time = new Date();

swig.setDefaults({
    loader: swig.loaders.fs(__dirname + '/dev/templates'),
    cache: false
});

function collectPosts() {
    var posts = [];
    var tags = [];
    return through.obj(function (file, enc, cb) {
        posts.push(file.page);
        posts[posts.length - 1].content = file.contents.toString();

        if (file.page.tags) {
            file.page.tags.forEach(function (tag) {
                if (tags.indexOf(tag) == -1) {
                    tags.push(tag);
                }
            });
        }

        this.push(file);
        cb();
    },
    function (cb) {
        posts.sort(function (a, b) {
            return b.date - a.date;
        });
        site.posts = posts;
        site.tags = tags;
        cb();
    });
}

function filename2date() {
    return through.obj(function (file, enc, cb) {
        var basename = path.basename(file.path, '.md');
        var match = repostname.exec(basename);
        if (match)
        {
            var year     = match[1];
            var month    = match[2];
            var day      = match[3];
            var basename = match[4];
            file.page.date = new Date(year + "-" + month + "-" + day);
            file.page.url  = '/' + year + '/' + month + '/' + day + '/' + basename;
        }

        this.push(file);
        cb();
    });
}

function summarize(marker) {
    return through.obj(function (file, enc, cb) {
        var summary = file.contents.toString().split(marker)[0]
        file.page.summary = summary;
        this.push(file);
        cb();
    });
}

function applyTemplate(templateFile) {
    var tpl = swig.compileFile(path.join(__dirname, templateFile));

    return through.obj(function (file, enc, cb) {
        var data = {
            site: site,
            page: file.page,
            content: file.contents.toString()
        };
        file.contents = new Buffer(tpl(data), 'utf8');
        this.push(file);
        cb();
    });
}

gulp.task('assets', function () {
    return gulp.src('./dev/assets/**/*')
        .pipe(gulp.dest('./build/'));
});

gulp.task('media', function () {
    return gulp.src('./content/media/**/*')
          .pipe(gulp.dest('./build/media'));
});

gulp.task('pages', function () {
    return gulp.src('./content/pages/*.md')
        .pipe(frontmatter({property: 'page', remove: true}))
        .pipe(md({
          options: {
            html: true,
            linkify: true},
          plugins: ['markdown-it-emoji']
         }))
        .pipe(applyTemplate('./dev/templates/page.html'))
        .pipe(rename({extname: '/index.html'}))
        .pipe(gulp.dest('./build'));
});

gulp.task('posts', function () {
    return gulp.src('./content/posts/*.md')
        .pipe(frontmatter({property: 'page', remove: true}))
        .pipe(md({
          options: {
            html: true,
            linkify: true},
          plugins: ['markdown-it-emoji']
         }))
        .pipe(summarize('<!--more-->'))
        .pipe(filename2date())
        .pipe(collectPosts())
        .pipe(applyTemplate('./dev/templates/post.html'))
        .pipe(rename(function (path) {
            path.extname = ".html";
            var match = repostname.exec(path.basename);
            if (match)
            {
                var year = match[1];
                var month = match[2];
                var day = match[3];

                path.dirname = year + '/' + month + '/' + day;
                path.basename = match[4];
            }
        }))
        .pipe(gulp.dest('./build'));
});

function dummy(file) {
  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});

  if (site)
  {
    var file = new gutil.File({
      path: file,
      contents: new Buffer('')
    });
    file.page = {}
    stream.write(file);
  }

  stream.end();
  stream.emit('end');

  return stream;
}

gulp.task('index', ['posts'], function () {
    return dummy('index.html')
        .pipe(applyTemplate('./dev/templates/index.html'))
        .pipe(gulp.dest('./build/'));
});

function posts(basename, count) {
  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});

  if (site.posts)
  {
    var c     = 0;
    var page  = 0;
    var posts = [];
    site.posts.forEach(function (post) {
      posts.push(post);
      c++;
      if (c == count) {
        var file = new gutil.File({
          path: basename + (page == 0 ? '' : page),
          contents: new Buffer('')
        });
        console.log('page=' + page + ' c=' + c + ' posts.length=' + site.posts.length);
        file.page = {
          posts: posts,
          prev: page != 0 ? basename + ((page-1) == 0 ? '' : page-1) + '.html' : null,
          next: (page+1) * count < site.posts.length ? basename + (page+1) + '.html' : null,
          };
        stream.write(file);

        c = 0;
        posts = [];
        page++;
      }
    });

    if (posts.length != 0) {
      var file = new gutil.File({
        path: basename + (page == 0 ? '' : page) + '.html',
        contents: new Buffer('')
      });
      file.page = {
        posts: posts,
        prev: page != 0 ? basename + ((page-1) == 0 ? '' : page) + '.html' : null,
        next: null,
        };
      stream.write(file);
    }
  }

  stream.end();
  stream.emit('end');

  return stream;
}

gulp.task('updates', ['posts'], function () {
    return posts('updates', 10)
        .pipe(applyTemplate('./dev/templates/updates.html'))
        .pipe(rename('/updates/index.html'))
        .pipe(gulp.dest('./build'));
});

function tags() {
  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});

  if (site.tags)
  {
    site.tags.forEach(function (tag) {
      var file = new gutil.File({
        path: tag + '.html',
        contents: new Buffer('')
      });
      file.page = {title: tag, tag: tag}

      stream.write(file);
    });
  }

  stream.end();
  stream.emit('end');

  return stream;
}

// --- Compass ---
gulp.task('compass', function() {
  gulp.src('./dev/sass/*.scss')
  .pipe(plumber())
  .pipe(compass({
    config_file: './config.rb',
    css: './build/css',
    sass: './dev/sass',
    image: './build/img'
  }))
  .on('error', notify.onError({
    title: 'Fail',
    message: 'Compass error'
  }))
  .on('error', function (err) {
    return console.log(err);
  })
  .pipe(gulp.dest('./build/css'))
  .pipe(notify({
    title: 'Sucess',
    message: 'Compass compiled'
  }))
});

// --- Scripts ---
gulp.task('js', function() {
  return gulp.src('./dev/scripts/*.coffee')
  .pipe(coffee().on('error', gutil.log))
  .pipe(gulp.dest('./build/js'))
  .pipe(notify({
    title: 'Success',
    message: 'Coffeescript compiled'
  }))
});

// --- Vendor ---
gulp.task('vendor', function() {
  gulp.src('./dev/scripts/*.js')
  .pipe(uglify())
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('./build/js'))
});

// --- Tags ---
gulp.task('tags', ['posts'], function () {
    return tags()
        .pipe(applyTemplate('./dev/templates/tag.html'))
        .pipe(gulp.dest('./build/tag'));
});

// --- Posts ---
gulp.task('feed', ['posts'], function () {
  return dummy('atom.xml')
    .pipe(applyTemplate('./dev/templates/atom.xml'))
    .pipe(gulp.dest('./build/'));
});

// --- Scripts ---
gulp.task('cname', function() {
  return gulp.src('./dev/CNAME')
  .pipe(gulp.dest('./build/'))
});

// --- Server ---
gulp.task('server', function() {
  browsersync.init({
    server: {
      baseDir: './build'
    }
  });
});

// --- Build ---
gulp.task('build', ['posts', 'index', 'updates', 'tags', 'feed']);

// --- Watch --
gulp.task('watch', function () {
  gulp.watch(['./dev/assets/**/*'], ['assets']);
  gulp.watch(['./content/media'], ['media']);
  gulp.watch(['./dev/templates/page.html','content/pages/*.md'], ['pages']);
  gulp.watch(['./dev/templates/post.html', './dev/templates/index.html', './dev/templates/updates.html','./content/posts/*.md'], ['build']);
  gulp.watch('./dev/sass/*.scss',['compass']);
  gulp.watch('./dev/scripts/*.coffee',['js']);
});

// --- Default ---
gulp.task('default', ['compass', 'js', 'vendor', 'assets', 'pages', 'media', 'posts', 'index', 'updates', 'tags', 'feed', 'watch', 'server']);

// --- Clean ---
gulp.task('clean', function() {
  return gulp.src('./build', {read: false})
  .pipe(clean());
});

// --- Deploy ---
gulp.task('deploy', function () {
  return gulp.src('./build/**/*')
  .pipe(deploy());
});

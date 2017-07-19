var gulp = require('gulp');
var typescript = require('gulp-tsc');
var ava = require('gulp-ava');
var del = require('del');
var dest_test = "output/test";
var fs = require('fs');
var run = require('gulp-run');
var path = require('path');
require('dotenv').config();

gulp.task('watcher', function () {

})

gulp.task('test', ["compile:tests"], function () {
  return gulp.src(dest_test + '/runTests/*.js')
    .pipe(ava({ verbose: true }));
});

gulp.task('compile:tests', ["clean:test"], function () {
  var tsconfig = JSON.parse(fs.readFileSync('tests/tsconfig.json', 'utf8'));

  tsconfig.compilerOptions.outDir = dest_test;

  return gulp.src(['tests/**/*.ts'])
    .pipe(typescript(tsconfig.compilerOptions))
    .pipe(gulp.dest(dest_test));
});


gulp.task('clean:test', function () {
  return del([
    dest_test + '/**/*'
  ]);
});

// update generator
gulp.task('updategenerator', function () {


  var env = process.env;
  if (env === null ||
    env.GeneratorBotboilerPath === null ||
    env.GeneratorBotboilerPath === undefined ||
    env.GeneratorBotboilerPath === '') {
    console.error('Error: Please clone https://github.com/MSFTAuDX/generator-botboiler and then set the value GeneratorBotboilerPath in your .env')
    return;
  }

  var destinationfolder = path.join(env.GeneratorBotboilerPath, '/generators\/app\/templates\/');
  var gulpRanInThisFolder = process.cwd();
  var srcsource = path.join(gulpRanInThisFolder, '/src');
  var srcdestination = path.join(destinationfolder, '/src');

  copy(srcsource, srcdestination, (r, err) => {

    if (!r) {
      return console.error(err);
    }

  });

  var testssource = path.join(gulpRanInThisFolder, '/tests');
  var testsdestination = path.join(destinationfolder, '/tests');

  copy(testssource, testsdestination, (r, err) => {

    if (!r) {
      return console.error(err);
    }
  });


  var packagesource = path.join(gulpRanInThisFolder, 'package.json');


  copy(packagesource, path.join(destinationfolder, 'package.json'), (r, err) => {

    if (!r) {
      return console.error(err);
    }


    //rename
    fs.rename(path.join(destinationfolder, "package.json"), path.join(destinationfolder, "_package.json"), function (err) {
      if (err) {
        console.log('ERROR: ' + err);
        return;
      }
      //update file
      var replace = require("replace");
      replace({
        regex: '"name": "funkynode",',
        replacement: '"name": "<%= name %>",',
        paths: [path.join(destinationfolder, "_package.json")],
        recursive: true,
        silent: true,
      });
    });

  });

});


function copy(source, destination, callback) {
  var ncp = require('ncp').ncp;
  ncp.limit = 16;
  ncp(source, destination, function (err) {
    if (err) {
      callback(false, err);
    }
    console.log('all files and folders in ' + source + ' copied to ' + destination);
    callback(true);
  });
}
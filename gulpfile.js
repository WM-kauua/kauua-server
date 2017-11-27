'use strict'

const gulp = require('gulp');
const gulp_mocha = require('gulp-mocha');
const modelDir_unitTests = __dirname+'/./tests/units/models';
let mocha_reporter;

mocha_reporter = 'list';
if(process.env.MOCHA_REPORTER === 'nyan'){
  mocha_reporter = 'nyan';
}

gulp.task('default', () => {
  return gulp.src([
      './tests/units/models/*.js', '!./tests/units/models/index.js',
      './tests/units/controllers/*.js', '!./tests/units/controllers/index.js',
      './tests/integrations/routes/*.js','!./tests/integrations/routes/index.js'
    ], { read: false })
    .pipe(gulp_mocha({ reporter: mocha_reporter }))
    .on('error', () => {
      console.log("snap an error occured");
    });  
});

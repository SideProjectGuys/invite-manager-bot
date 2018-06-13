const gulp = require('gulp');
const gulp_ts = require('gulp-typescript');
const gulp_tslint = require('gulp-tslint');
const gulp_sourcemaps = require('gulp-sourcemaps');
const tslint = require('tslint');
const del = require('del');
const path = require('path');

const project = gulp_ts.createProject('tsconfig.json');
const linter = tslint.Linter.createProgram('tsconfig.json');

gulp.task('default', ['build']);

gulp.task('lint', () => {
	gulp.src('./src/**/*.ts')
		.pipe(gulp_tslint({
			configuration: 'tslint.json',
			formatter: 'prose',
			program: linter
		}))
		.pipe(gulp_tslint.report());
})

gulp.task('build', () => {
	del.sync(['./bin/**/*.*']);
	const tsCompile = gulp.src('./src/**/*.ts')
		.pipe(gulp_sourcemaps.init())
		.pipe(project());

	tsCompile.pipe(gulp.dest('bin/'));

	gulp.src('./src/**/*.js')
		.pipe(gulp.dest('bin/'));

	gulp.src('./src/**/*.json')
		.pipe(gulp.dest('bin/'));

	gulp.src('./src/**/*.lang')
		.pipe(gulp.dest('bin/'));

	return tsCompile.js
		.pipe(gulp_sourcemaps.write({
			sourceRoot: file => path.relative(path.join(file.cwd, file.path), file.base)
		}))
		.pipe(gulp.dest('bin/'));
});
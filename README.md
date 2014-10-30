Gulp Task Loader
================

Make it easy to organize gulp-tasks in separate files

# Install

```sh
npm install gulp-task-loader --save-dev
```

# How

1. Add a task in the folder of your choice
2. Require this module [with options]

Given

```js
// gulp-tasks/copy.js
module.exports = function() {
	return gulp.src(src)
		.pipe(gulp.dest(dist));
};
```

Load all tasks from `gulp-task`
```js
require('gulp-task-loader')();

gulp.watch(someFiles, ['copy']);
```

Another folder name? No probs broah!
```js
require('gulp-task-loader')('gulp');
```

## Options

### dir
Type `String` Default `gulp-tasks`

Path to folder with gulp tasks

## Test

If mocha is not installed do:
```sh
npm i mocha -g
```
and then
```sh
npm test
```

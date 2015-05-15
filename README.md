Gulp Task Loader
================

[![Dependency Status](https://david-dm.org/hontas/gulp-task-loader.svg)](https://david-dm.org/hontas/gulp-task-loader)

Organize your gulp-tasks in separate files

# Install

```shell
npm i gulp-task-loader -D
# -D is the same as --save-dev
```

# Use

1. Create one file / task
2. Place the task-files in a folder named 'gulp-tasks' (or whatever you like)
3. Require this module [optionally with options]
4. Gulp-tasks now exist (named after task file name)

## Examples

### Simple task file
```js
// gulp-tasks/copy.js
module.exports = function() {
	return gulp.src("src/**/*")
		.pipe(gulp.dest("dist/**/*"));
};
```

```js
// gulpfile.js
// Load all tasks from folder `gulp-tasks`
require('gulp-task-loader')();

// use it!
gulp.watch(someFiles, ['copy']);
```

### With dependencies
```js
// gulp-tasks/task-with-deps.js
module.exports = function() {
    return gulp.src("src/**/*")
        .pipe(gulp.dest("dist/**/*"));
};
module.exports.dependencies = ['copy'];
```

### Load tasks from another folder
```js
require('gulp-task-loader')('le-tasks-de-gulp');
```

### Load tasks in CoffeeScript
```js
require('coffee-script/register');
require('gulp-task-loader')({ coffee: true });
```

## Options

### dir
Type `String` Default `gulp-tasks`

Path to folder with gulp tasks

### coffee
Type `Boolean` Default `false`

If your task-files are written in coffee-script

## Test

```sh
npm test
```

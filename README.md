Gulp Task Loader
================

> Organize your gulp-tasks in separate files

[![Dependency Status](https://david-dm.org/hontas/gulp-task-loader.svg)](https://david-dm.org/hontas/gulp-task-loader)
[![Build Status](https://travis-ci.org/hontas/gulp-task-loader.svg?branch=master)](https://travis-ci.org/hontas/gulp-task-loader)

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
require('gulp-task-loader')({ exts: ['.coffee'] });
```

### Load tasks in other extensions
```js
require('gulp-task-loader')({ exts: ['.jscript'] });
```

### Load tasks along with custom data (New feature in v1.2.4)

In v1.2.4, `gulp-task-loader` can pass the `gulp` object and its configurations to every loaded task.
It means that we share any custom data or configurations between tasks from now on. 
For example, we can pass package.json to every single task as below:

In `gulpfile.js`,

```js
var pkg ＝ require('./package.json');
require('gulp-task-loader')({pkg: pkg});
```
In gulp-tasks/xxx.js, we can access pkg as below:

```js
module.exports = function() {
    console.log( this );
    //access to the package.json
    console.log( this.opts.pkg );
    // reuse gulp object
    console.log( this.gulp );
};
```

### Subtasks

```js
// gulp-tasks/copy/all.js
// gulp-tasks/copy/fonts.js

// gulpfile.js
gulp.watch(allFiles, ['copy:all']);
gulp.watch(someFiles, ['copy:fonts']);
```

Given the files in folder *copy* - two tasks have been created. `copy:all` & `copy:fonts` 

## Options

### dir
Type `String` Default `gulp-tasks`

Path to folder with gulp tasks

### extensions
Type `Array` Default to keys of `require.extensions`

List of extensions to filter tasks by. Example: `['.js', '.coffee']`

## Test

```sh
npm test
```

## Changelog

#### 1.2.1
* Load tasks relative to project. Thanks to [@archr](https://github.com/archr)

#### 1.2.0

* tasks in subfolder will be named `folderName:taskName`. Thanks to [@evanshortiss](https://github.com/evanshortiss).

#### 1.1.0

* added support for other sources than .js. Thanks to [@blvz](https://github.com/blvz).

#### pre 1.1.0

* the dark ages of not documenting version bumps..

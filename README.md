Gulp Task Loader
================

> Organize your gulp-tasks in separate files

[![Dependency Status](https://david-dm.org/hontas/gulp-task-loader.svg)](https://david-dm.org/hontas/gulp-task-loader)
[![DevDependency Status](https://david-dm.org/hontas/gulp-task-loader/dev-status.svg)](https://david-dm.org/hontas/gulp-task-loader#info=devDependencies)
[![PeerDependency Status](https://david-dm.org/hontas/gulp-task-loader/peer-status.svg)](https://david-dm.org/hontas/gulp-task-loader#info=peerDependencies)
[![Build Status](https://travis-ci.org/hontas/gulp-task-loader.svg?branch=master)](https://travis-ci.org/hontas/gulp-task-loader)

# Install

```shell
npm install gulp-task-loader --save-dev
```

# Use

1. Create one file / task
2. Place the task-files in a folder named 'gulp-tasks' (or whatever you like)
3. Require this module and invoke it [with or without options]
4. Gulp-tasks now magically exist (named after task file name)

You may create subfolders of tasks as well. Tasks in these folders will have their task name prefixed by the folder name. For example, if you have a task named `coffee` that compiles CoffeeScript files, you could place this task in the `gulp-tasks/browser` folder and it would be invoked using `gulp browser:coffee`. You may nest folders as deep as required, and each folder will be added to the task name.

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

### Task context

Each task is called with a context object containing a reference to `gulp` and `opts` (the options object).
```js
// gulpfile.js
var pkg ＝ require('./package.json');
require('gulp-task-loader')({ pkg: pkg, dest: 'dist' });

// gulp-tasks/xxx.js
module.exports = function() {
    return this.gulp.src(this.opts.pkg.main)
      .pipe(this.gulp.dest(this.opts.dest));
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

### 1.4.4
* Bugfix for options.dir

### 1.4.1
* Fixed bug that caused subtasks to break

#### 1.4.0
* Allow loading of infinitely nested children directories

#### 1.3.0
* Replaced lodash.defaults with object-assign
* Call tasks with context. Thanks to [@mamboer](https://github.com/mamboer)

#### 1.2.1
* Load tasks relative to project. Thanks to [@archr](https://github.com/archr)

#### 1.2.0

* tasks in subfolder will be named `folderName:taskName`. Thanks to [@evanshortiss](https://github.com/evanshortiss).

#### 1.1.0

* added support for other sources than .js. Thanks to [@blvz](https://github.com/blvz).

#### pre 1.1.0

* the dark ages of not documenting version bumps..

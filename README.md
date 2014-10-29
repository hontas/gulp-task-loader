Gulp Task Loader
================

# Why

- Easily include your broken away gulp-tasks

# Install

```sh
npm install gulp-task-loader --save-dev
```
equivalent to
```sh
npm i gulp-task-loader -D
```

# How

Load all files in folder `gulp-tasks` as gulp-tasks

```js
require('gulp-task-loader')();
```

Require all files in folder `gulp` as gulp-tasks

```js
require('gulp-task-loader')('gulp');
```

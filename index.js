'use strict';
var _ = require('lodash');
var fs = require('fs');
var gulp = require('gulp');
var defaults = {
	dir: 'gulp-tasks'
};

module.exports = function(options) {
	options = ("string" === typeof options) ? { dir: options } :
		options ? options : {};

	var opts = _.defaults(options || {}, defaults);

	function stripExtension(fileName) {
		return fileName.replace(/\.[A-z]{2,4}$/, '');
	}

	function loadTask(taskName) {
		var task = require('./' + opts.dir + '/' + taskName),
			dependencies = task.dependencies || [];

		gulp.task(taskName, dependencies, task);
	}

	fs.readdirSync(opts.dir)
		.map(stripExtension)
		.forEach(loadTask);
};

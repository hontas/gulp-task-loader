'use strict';
var _ = require('lodash');
var fs = require('fs');
var gulp = require('gulp');
var defaults = {
	dir: 'gulp-tasks'
};

function isString(str) {
	return "string" === typeof str;
}

module.exports = function(options) {
	if (isString(options)) {
		options = { dir: options };
	} else if (!options) {
		options = {};
	}
	var opts = _.defaults(options, defaults);

	function stripExtension(fileName) {
		return fileName.replace(/\.[A-z]{2,4}$/, '');
	}

	function loadTask(taskName) {
		var task = require([process.cwd(), opts.dir, taskName].join('/')),
			dependencies = task.dependencies || [];

		gulp.task(taskName, dependencies, task);
	}

	fs.readdirSync(opts.dir)
		.map(stripExtension)
		.forEach(loadTask);
};

'use strict';
var fs = require('fs');
var gulp = require('gulp');
var defaults = {
	dir: 'gulp-tasks',
	coffee: false
};

function isString(str) {
	return 'string' === typeof str;
}

function getDefaults(options) {
	return Object
		.keys(defaults)
		.reduce(function(ret, key) {
			ret[key] = options.hasOwnProperty(key) ? options[key] : defaults[key];
			return ret;
		}, {});
}

module.exports = function(options) {
	if (isString(options)) {
		options = { dir: options };
	} else if (!options) {
		options = {};
	}

	var opts = getDefaults(options);
	var isJsFile = /\.js$/i;
	var isCoffeeFile = /\.coffee$/i;
	var fileRegExp = opts.coffee ? isCoffeeFile : isJsFile;

	function byExtension(fileName) {
		return fileRegExp.test(fileName);
	}

	function stripExtension(fileName) {
		return fileName.replace(fileRegExp, '');
	}

	function loadTask(task) {
		var path = [process.cwd(), opts.dir, task].join('/');
		var func = require(path);
		var dependencies = func.dependencies || [];
		var taskName = stripExtension(task);

		gulp.task(taskName, dependencies, func);
	}

	fs.readdirSync(opts.dir)
		.filter(byExtension)
		.forEach(loadTask);
};

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
	var exts = opts.extensions ||
				require.extensions
					? _.keys(require.extensions)
						.map(function(e) { return e.substr(1); })
					: ['js'];

	var isJsFile = new RegExp('\\.(' + exts.join('|') + ')$', 'i');

	function jsFiles(fileName) {
		return isJsFile.test(fileName);
	}

	function stripExtension(fileName) {
		return fileName.replace(isJsFile, '');
	}

	function loadTask(taskName) {
		var task = require([process.cwd(), opts.dir, taskName].join('/')),
			dependencies = task.dependencies || [];

		gulp.task(taskName, dependencies, task);
	}

	fs.readdirSync(opts.dir)
		.filter(jsFiles)
		.map(stripExtension)
		.forEach(loadTask);
};

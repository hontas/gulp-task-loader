'use strict';
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var extensions = Object.keys(require.extensions).map(getExtension);
var defaults = {
	dir: 'gulp-tasks',
	exts: extensions || ['js'] // fallback to .js
};

function isString(str) {
	return 'string' === typeof str;
}

function getExtension(ext) {
	return ext.substr(1);
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
	var fileRegExp = new RegExp('\\.(' + opts.exts.join('|') + ')$', 'i');

	function byExtension(fileName) {
		return fileRegExp.test(fileName);
	}

	function stripExtension(fileName) {
		return fileName.replace(fileRegExp, '');
	}

	function loadTask(parent, task) {
		var modulePath = path.join(process.cwd(), opts.dir, parent || '', task);
		var func = require(modulePath);
		var dependencies = func.dependencies || [];
		var taskName = stripExtension(task);

		// If this task was in a subdirectory then namespace it like so:
		// "parent:child"
		if (parent) {
			taskName = parent.concat(':').concat(taskName);
		}

		gulp.task(taskName, dependencies, func);
	}

	function loadTasks (dir) {
		var stat = fs.lstatSync(path.join(opts.dir, dir));

		if (stat.isFile() && byExtension(dir)) {
			loadTask(null, dir);
		} else if (!stat.isFile()) {
			// If the entry is not a file then we know it's a folder to read
			fs.readdirSync(
				path.join(opts.dir, dir)
			)
			.filter(byExtension)
			.forEach(loadTask.bind(opts.dir, dir));
		}
	}

	fs.readdirSync(opts.dir)
		.forEach(loadTasks);
};

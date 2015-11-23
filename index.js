'use strict';
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var assign = require('object-assign');

function isString(str) {
	return 'string' === typeof str;
}

function getExtensions() {
	return Object.keys(require.extensions);
}

function getDefaults() {
	return {
		dir: 'gulp-tasks',
		exts: getExtensions() || ['.js'] // fallback
	};
}

module.exports = function(options) {
	if (isString(options)) {
		options = { dir: options };
	}

	var opts = assign(getDefaults(), options);

	function byExtension(fileName) {
		var extension = path.extname(fileName);
		return ~opts.exts.indexOf(extension);
	}

	function stripExtension(fileName) {
		var extension = path.extname(fileName);
		return path.basename(fileName, extension);
	}

	function loadTask(parent, task) {
		var modulePath = path.join(process.cwd(), opts.dir, parent || '', task);
		var func = require(modulePath);
		var dependencies = func.dependencies || [];
		var taskName = stripExtension(task);

		// If subtask -> namespace: "parent:child"
		if (parent) {
			taskName = parent + ':' + taskName;
		}

		gulp.task(taskName, dependencies, func);
	}

	function resolvePath(dir) {
		return path.join(opts.dir, dir);
	}

	function loadTasks(currentPath) {
		var file = path.basename(currentPath);
		var stats = fs.lstatSync(currentPath);

		if (stats.isFile() && byExtension(file)) {
			loadTask(null, file);
		}

		if (stats.isDirectory()) {
			fs.readdirSync(currentPath)
				.filter(byExtension)
				.forEach(loadTask.bind(null, file));
		}
	}

	fs.readdirSync(opts.dir)
		.map(resolvePath)
		.forEach(loadTasks);
};

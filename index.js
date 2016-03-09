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
		exts: getExtensions() || ['.js']
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

	function loadTask(parents, task) {
		var modulePath = path.join(process.cwd(), opts.dir, parents.join('/') || '', task);
		var func = require(modulePath);
		var dependencies = func.dependencies || [];
		var taskName = stripExtension(task);
		var context = {
			gulp: gulp,
			opts: opts
		};

		// If subtask -> namespace: "parent:child"
		if (parents.length) {
			taskName = parents.join(':') + ':' + taskName;
		}

		gulp.task(taskName, dependencies, func.bind(context));
	}

	function resolvePath(dir) {
		return path.join(opts.dir, dir);
	}

	function loadTasks(currentPath) {
		var file = path.basename(currentPath);
		var stats = fs.lstatSync(currentPath);
		
		if (stats.isFile() && byExtension(file)) {
			loadTask(currentPath.split('/').slice(opts.dir.split('/').length, -1), file);
		}
		else if (stats.isDirectory()) {
			fs.readdirSync(currentPath)
				.forEach(function(subPath){
					loadTasks(path.join(currentPath, subPath));
				});
		}
	}
	
	loadTasks(opts.dir);
};

var gulp = require('gulp');
var chalk = require('chalk');

var tasks = require('../index.js')({
	dir: 'test/gulp'
});

function runTask(task, idx, self) {
	var testNum = [idx + 1, self.length].join('/');

	if (gulp.tasks[task].fn() === true) {
		console.log(chalk.green('Test ' + testNum + ' is ok'));
	} else {
		console.log(chalk.red('Test ' + testNum + ' failed'));
	}
}

Object.keys(gulp.tasks).forEach(runTask);

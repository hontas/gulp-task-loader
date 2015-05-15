/*eslint no-unused-expressions: 0 */
'use strict';

var gulp = require('gulp');
var expect = require('chai').expect;

function getTask(taskName) {
	return gulp.tasks[taskName];
}

describe('gulp-task-loader', function() {
	describe('without any supplied options', function() {
		var task;

		before(function() {
			require('../index.js')();
			task = getTask('task');
		});

		it('should use default options', function() {
			expect(task.fn()).to.equal('default');
		});
	});

	describe('without dependencies', function() {
		var task;

		before(function() {
			require('../index.js')('test/noDeps');
			task = getTask('task');
		});

		it('should return true', function() {
			expect(task.fn()).to.equal('no dependencies');
		});

		it('should not have any dependencies', function() {
			expect(task.dep).to.be.empty;
		});
	});

	describe('with dependencies', function() {
		var task;

		before(function() {
			require('../index.js')('test/withDeps');
			task = getTask('task');
		});

		it('should return true', function() {
			expect(task.fn()).to.equal('with deps');
		});

		it('should have dependencies', function() {
			expect(task.dep).to.not.be.empty;
		});
	});

	describe('filter non js files', function() {
		it('should filter .jshintrc', function() {
			expect(require('../index.js').bind(null, 'test/filterOutFiles')).to.not.throw();
		});
	});

	describe('coffeescript', function() {
		var options = {
				dir: 'test/coffeeScript',
				coffee: true
			},
			task;

		before(function() {
			require('coffee-script/register');
			require('../index.js')(options);
			task = getTask('coffee');
		});

		it('should return true', function() {
			expect(task.fn()).to.be.true;
		});

		it('should have dependencies', function() {
			expect(task.dep).to.eql(['dep']);
		});
	});
});

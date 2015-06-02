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

	describe('load subtasks in nested folders', function () {

		it('Should load tasks in a subfolder and namespace them', function () {
			require('../index.js')('test/subtasks');

			expect(getTask('annotate:add')).to.be.defined;
			expect(getTask('annotate:remove')).to.be.defined;
		});

	});

	describe('filter non js files', function() {
		it('should filter .jshintrc', function() {
			expect(require('../index.js').bind(null, 'test/filterOutFiles')).to.not.throw();
		});
	});

	describe('include extensions in require.extensions', function() {
		describe('coffeescript', function() {
			var options = {
					dir: 'test/coffeeScript',
					exts: ['coffee']
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

		describe('jscript and js', function() {
			var options = {
					dir: 'test/includeRequireExtensions',
					exts: ['jscript', 'js']
				},
				task, task2;

			before(function() {
				require('../index.js')(options);
				task = getTask('task');
				task2 = getTask('task2');
			});

			it('task.js should return true', function() {
				expect(task.fn()).to.equal('.js');
			});

			it('task2.jscript should also return true', function() {
				expect(task2.fn()).to.equal('.jscript');
			});
		});
	});
});

/*eslint no-unused-expressions: 0 */
'use strict';

var gulp = require('gulp');
var expect = require('chai').expect;

function getTask(taskName) {
	return gulp.tasks[taskName];
}

function callTask(taskName) {
	return getTask(taskName).fn();
}

function resetTasks() {
	gulp.tasks = {};
}

describe('gulp-task-loader', function() {
	afterEach(function() {
		resetTasks();
	});

	describe('without any supplied options', function() {
		beforeEach(function() {
			require('../index.js')();
		});

		it('should use default options', function() {
			expect(callTask('default')).to.equal('default');
		});
	});

	describe('can pass gulp and options to tasks', function() {
		var options = {
			dir: 'test/passingGulpAndOptionsToTasks',
			foo: 'bar'
		};

		beforeEach(function() {
			require('../index.js')(options);
		});

		it('should be invoked with reference to gulp', function() {
			var self = callTask('test');
			expect(self).to.have.property('gulp');
			expect(self.gulp).to.equal(gulp);
		});

		it('should contain options as opts', function() {
			var self = callTask('test');
			expect(self).to.have.property('opts');
			expect(self.opts).to.have.keys(['dir', 'exts', 'foo']);
		});
	});

	describe('without dependencies', function() {
		beforeEach(function() {
			require('../index.js')('test/noDeps');
		});

		it('should return true', function() {
			expect(callTask('noDeps')).to.equal('no dependencies');
		});

		it('should not have any dependencies', function() {
			expect(getTask('noDeps').dep).to.be.empty;
		});
	});

	describe('with dependencies', function() {
		beforeEach(function() {
			require('../index.js')('test/withDeps');
		});

		it('should return true', function() {
			expect(callTask('withDeps')).to.equal('with deps');
		});

		it('should have dependencies', function() {
			expect(getTask('withDeps').dep).to.not.be.empty;
		});
	});

	describe('load subtasks in nested folders', function () {
		beforeEach(function() {
			require('../index.js')('test/subtasks');
		});

		it('Should load tasks in a subfolder and namespace them', function () {
			expect(getTask('annotate:add')).to.be.defined;
			expect(getTask('annotate:remove')).to.be.defined;
			expect(getTask('annotate:docs:comment')).to.be.defined;
		});

	});

	describe('filter non js files', function() {
		it('should filter .jshintrc', function() {
			expect(require('../index.js').bind(null, 'test/filterOutFiles')).to.not.throw();
		});
	});

	describe('include extensions in require.extensions', function() {
		describe('coffeescript', function() {
			beforeEach(function() {
				require('coffee-script/register');
				require('../index.js')({ dir: 'test/coffeeScript' });
			});

			it('should return true', function() {
				expect(callTask('coffee')).to.be.true;
			});

			it('should have dependencies', function() {
				expect(getTask('coffee').dep).to.eql(['dep']);
			});
		});

		describe('jscript and js', function() {
			var options = {
					dir: 'test/includeRequireExtensions',
					exts: ['.jscript', '.js']
				};

			beforeEach(function() {
				require('../index.js')(options);
			});

			it('task.js should return true', function() {
				expect(callTask('task')).to.equal('.js');
			});

			it('task2.jscript should also return true', function() {
				expect(callTask('task2')).to.equal('.jscript');
			});
		});
	});

	describe('subfolder tasks referenced by ./', function () {
		beforeEach(function() {
			require('../index.js')('./test/subtasks');
		});

		it('Should load tasks in a subfolder and namespace them as before', function () {
			expect(getTask('annotate:add')).to.be.defined;
			expect(getTask('annotate:remove')).to.be.defined;
			expect(getTask('annotate:docs:comment')).to.be.defined;
		});
	});

	describe('subfolder tasks referenced with trailing /', function () {
		beforeEach(function() {
			require('../index.js')('./test/subtasks/');
		});

		it('Should load tasks in a subfolder and namespace them as before', function () {
			expect(getTask('annotate:add')).to.be.defined;
			expect(getTask('annotate:remove')).to.be.defined;
			expect(getTask('annotate:docs:comment')).to.be.defined;
		});
	});
});

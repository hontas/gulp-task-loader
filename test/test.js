var gulp = require('gulp');
var expect = require('chai').expect;

describe("gulp-task-loader", function() {
	describe("without dependencies", function() {
		var task;

		before(function() {
			require('../index.js')('test/noDeps');
			task = gulp.tasks['task'];
		});

		it("should return true", function() {
			expect(task.fn()).to.be.true;
		});

		it("should not have any dependencies", function() {
			expect(task.dep).to.be.empty;
		});
	});

	describe("with dependencies", function() {
		var task;

		before(function() {
			require('../index.js')('test/withDeps');
			task = gulp.tasks['task'];
		});

		it("should return true", function() {
			expect(task.fn()).to.be.true;
		});

		it("should have dependencies", function() {
			expect(task.dep).to.not.be.empty;
		});
	});

	describe("filter non js files", function() {
		it("should filter .jshintrc", function() {
			require('../index.js')('test/filterOutFiles');
		});
	});

	describe("include extensions in require.extensions", function() {
		var task, task2;

		before(function() {
			require.extensions['.jscript'] = require.extensions['.js'];
			require('../index.js')('test/includeRequireExtensions');
			task = gulp.tasks['task'];
			task2 = gulp.tasks['task2'];
		});

		it("task.js should return true", function() {
			expect(task.fn()).to.be.true;
		});

		it("task2.jscript should also return true", function() {
			expect(task2.fn()).to.be.true;
		});
	});
});

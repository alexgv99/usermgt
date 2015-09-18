module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			myFiles: ['scripts/**/*.js', 'tests/**/*.js']
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-karma');
	grunt.registerTask('default', ['jshint', 'karma']);
};

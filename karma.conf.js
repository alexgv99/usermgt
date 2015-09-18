module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [      
      'node_modules/angular/angular.js',
      "node_modules/angular-i18n/angular-locale_pt-br.js",
      'node_modules/angular-route/angular-route.js',
      'libs/keycloak/1.3.1/keycloak.js',
      'node_modules/jquery/dist/jquery.js',
      'node_modules/bootstrap/dist/js/bootstrap.js',
      "node_modules/angular-ui-bootstrap/ui-bootstrap.js",
      "node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js",
      "node_modules/ngstorage/ngStorage.js",
      'node_modules/angular-mocks/angular-mocks.js',
      'scripts/config.js',
      'scripts/**/*.js',
      'tests/**/*.js'
    ],
    exclude: [],
    preprocessors: {
      'scripts/**/*.js': ['coverage']
    },
    reporters: ['dots', 'coverage'],
    coverageReporter: {
        instrumenterOptions: {
            istanbul: { noCompact: true }
        },        	
    	reporters: [{ type: 'html', subdir: 'report-html' }]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};

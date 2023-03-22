module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage'),
			require('@angular-devkit/build-angular/plugins/karma')
		],
		client: {
			jasmine: {
			},
			clearContext: false
		},
		jasmineHtmlReporter: {
			suppressAll: true
		},
		coverageReporter: {
			dir: require('path').join(__dirname, '../../coverage/my-lib'),
			subdir: '.',
			reporters: [
				{ type: 'html' },
				{ type: 'text-summary' }
			]
		},
		reporters: ['progress', 'kjhtml'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['ChromeHeadless'],
		restartOnFileChange: true
	});
};

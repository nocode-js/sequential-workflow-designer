module.exports = config => {
	config.set({
		frameworks: [
			'jasmine',
			'karma-typescript'
		],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-spec-reporter'),
			require('karma-typescript')
		],
		files: [
			{ pattern: 'src/**/*.ts' }
		],
		preprocessors: {
			'src/**/*.ts': 'karma-typescript'
		},
		reporters: [
			'progress',
			'karma-typescript'
		],
		browsers: [
			'ChromeHeadless'
		],
		karmaTypescriptConfig: {
			compilerOptions: {
				skipLibCheck: true
			},
			bundlerOptions: {
				transforms: [
					require("karma-typescript-es6-transform")()
				]
			}
		}
	});
};

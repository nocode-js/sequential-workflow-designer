module.exports = config => {
	config.set({
		frameworks: [
			'jasmine',
			'karma-typescript'
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
			}
		}
	});
};

const path = require('path');

module.exports = {
	entry: './src/app.ts',
	target: 'web',
	mode: 'production',
	// mode: 'development',
	output: {
		path: path.resolve(__dirname),
		filename: 'designer.js'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				loader: 'ts-loader',
				test: /\.ts?$/,
				options: {
					configFile: 'tsconfig.json'
				}
			}
		]
	}
};

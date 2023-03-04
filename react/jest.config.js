const path = require('path');

module.exports = {
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	transform: {
		'^.+\\.(ts|js)x?$': 'ts-jest',
	},
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'^sequential-workflow-designer': path.join(__dirname, '../designer/src'),
	},
	transformIgnorePatterns: [
		'node_modules/(?!sequential-workflow-model)'
	],
};

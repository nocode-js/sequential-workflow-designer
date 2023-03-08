import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const external = [
	...Object.keys(packageJson.peerDependencies),
	'react-dom/client',
	'react/jsx-runtime'
];

export default [
	{
		input: './src/index.ts',
		plugins: [
			typescript({
				useTsconfigDeclarationDir: true
			})
		],
		cache: false,
		external,
		output: [
			{
				file: './lib/esm/index.js',
				format: 'es'
			},
			{
				file: './lib/cjs/index.cjs',
				format: 'cjs'
			}
		]
	},
	{
		input: './build/index.d.ts',
		output: [
			{
				file: './lib/index.d.ts',
				format: 'es'
			}
		],
		plugins: [dts()],
		cache: false,
	}
];

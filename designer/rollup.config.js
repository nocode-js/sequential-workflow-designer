import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';

const ts = typescript({
	useTsconfigDeclarationDir: true
});

export default [
	{
		input: './src/index.ts',
		plugins: [ts],
		output: [
			{
				file: './lib/index.mjs',
				format: 'es'
			}
		]
	},
	{
		input: './src/index.ts',
		plugins: [ts],
		output: [
			{
				file: './dist/index.umd.js',
				format: 'umd',
				name: 'sequentialWorkflowDesigner'
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
	}
];

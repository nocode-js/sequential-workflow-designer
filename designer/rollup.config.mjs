import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const ts = typescript({
	useTsconfigDeclarationDir: true
});

const external = ['sequential-workflow-model'];

export default [
	{
		input: './src/index.ts',
		plugins: [ts],
		cache: false,
		external,
		output: [
			{
				file: './lib/index.mjs',
				format: 'es'
			}
		]
	},
	{
		input: './src/index.ts',
		plugins: [
			ts,
			nodeResolve({ browser: true })
		],
		cache: false,
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

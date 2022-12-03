import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';

export default [
	{
		input: './src/designer.ts',
		plugins: [
			typescript({
				useTsconfigDeclarationDir: true
			})
		],
		output: [
			{
				file: './lib/designer.js',
				format: 'umd',
				name: 'sequentialWorkflowDesigner'
			}
		]
	},
	{
		input: './build/designer.d.ts',
		output: [
			{
				file: './lib/designer.d.ts',
				format: 'es'
			}
		],
		plugins: [dts()],
	}
];

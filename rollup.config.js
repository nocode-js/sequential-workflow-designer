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
				file: './designer.js',
				format: 'umd',
				name: 'sequentialWorkflowDesigner',
				sourcemap: true
			}
		]
	},
	{
		input: './build/designer.d.ts',
		output: [
			{
				file: './designer.d.ts',
				format: 'es'
			}
		],
		plugins: [dts()],
	}
];

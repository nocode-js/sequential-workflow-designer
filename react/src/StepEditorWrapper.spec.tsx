import React from 'react';
import { render, screen } from '@testing-library/react';
import { Definition, Step, StepEditorContext } from 'sequential-workflow-designer';
import { StepEditorWrapperContext, useStepEditor } from './StepEditorWrapper';

describe('StepEditorWrapper', () => {
	const step: Step = {
		componentType: 'x',
		id: 'y',
		name: 'z',
		properties: {},
		type: 'test'
	};
	const definition: Definition = {
		sequence: [step],
		properties: {}
	};
	const context: StepEditorContext = {
		notifyNameChanged() {
			//
		},
		notifyPropertiesChanged() {
			//
		},
		notifyChildrenChanged() {
			//
		}
	};

	it('renders child correctly', () => {
		function TestHook() {
			const editor = useStepEditor();

			expect(editor.id).toBe('y');
			expect(editor.type).toBe('test');
			expect(editor.componentType).toBe('x');
			expect(editor.name).toBe('z');
			expect(editor.step).toBe(step);
			expect(editor.properties).toBe(step.properties);
			expect(editor.definition).toBe(definition);

			return <hr data-testid="hook" />;
		}

		render(
			<StepEditorWrapperContext step={step} definition={definition} context={context} isReadonly={false}>
				<div data-testid="child" />
				<TestHook />
			</StepEditorWrapperContext>
		);

		expect(screen.getByTestId('child').tagName).toBe('DIV');
		expect(screen.getByTestId('hook').tagName).toBe('HR');
	});
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Step, StepEditorContext } from 'sequential-workflow-designer';
import { StepEditorWrapperContext } from './StepEditorWrapper';

describe('StepEditorWrapper', () => {
	const step: Step = {
		componentType: 'x',
		id: 'y',
		name: 'z',
		properties: {},
		type: 'test'
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
		render(
			<StepEditorWrapperContext step={step} context={context}>
				<div data-testid="child" />
			</StepEditorWrapperContext>
		);
		const element = screen.getByTestId('child');
		expect(element.tagName).toBe('DIV');
	});
});

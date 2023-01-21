import React from 'react';
import { render, screen } from '@testing-library/react';
import { Definition, GlobalEditorContext } from 'sequential-workflow-designer';
import { GlobalEditorWrapperContext } from './GlobalEditorWrapper';

describe('GlobalEditorWrapper', () => {
	const definition: Definition = {
		properties: {},
		sequence: []
	};
	const context: GlobalEditorContext = {
		notifyPropertiesChanged() {
			//
		}
	};

	it('renders child correctly', () => {
		render(
			<GlobalEditorWrapperContext definition={definition} context={context}>
				<div data-testid="child" />
			</GlobalEditorWrapperContext>
		);
		const element = screen.getByTestId('child');
		expect(element.tagName).toBe('DIV');
	});
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Definition, GlobalEditorContext } from 'sequential-workflow-designer';
import { GlobalEditorWrapperContext, useGlobalEditor } from './GlobalEditorWrapper';

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
		function TestHook() {
			const editor = useGlobalEditor();

			expect(editor.properties).toBe(definition.properties);
			expect(editor.definition).toBe(definition);

			return <hr data-testid="hook" />;
		}

		render(
			<GlobalEditorWrapperContext definition={definition} context={context}>
				<div data-testid="child" />
				<TestHook />
			</GlobalEditorWrapperContext>
		);

		expect(screen.getByTestId('child').tagName).toBe('DIV');
		expect(screen.getByTestId('hook').tagName).toBe('HR');
	});
});

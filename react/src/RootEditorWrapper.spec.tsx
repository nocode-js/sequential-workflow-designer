import React from 'react';
import { render, screen } from '@testing-library/react';
import { Definition, RootEditorContext } from 'sequential-workflow-designer';
import { RootEditorWrapperContext, useRootEditor } from './RootEditorWrapper';

describe('RootEditorWrapper', () => {
	const definition: Definition = {
		properties: {},
		sequence: []
	};
	const context: RootEditorContext = {
		notifyPropertiesChanged() {
			//
		}
	};

	it('renders child correctly', () => {
		function TestHook() {
			const editor = useRootEditor();

			expect(editor.properties).toBe(definition.properties);
			expect(editor.definition).toBe(definition);
			expect(editor.isReadonly).toBe(false);

			return <hr data-testid="hook" />;
		}

		render(
			<RootEditorWrapperContext definition={definition} context={context} isReadonly={false}>
				<div data-testid="child" />
				<TestHook />
			</RootEditorWrapperContext>
		);

		expect(screen.getByTestId('child').tagName).toBe('DIV');
		expect(screen.getByTestId('hook').tagName).toBe('HR');
	});
});

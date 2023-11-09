import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Definition } from 'sequential-workflow-designer';
import { SequentialWorkflowDesigner } from './SequentialWorkflowDesigner';
import { wrapDefinition, WrappedDefinition } from './WrappedDefinition';
import { SequentialWorkflowDesignerController } from './SequentialWorkflowDesignerController';

describe('SequentialWorkflowDesigner', () => {
	const definition: Definition = {
		properties: {},
		sequence: []
	};

	function expectUiComponents(container: HTMLElement, count: number) {
		expect(container.getElementsByClassName('sqd-smart-editor').length).toBe(count);
		expect(container.getElementsByClassName('sqd-control-bar').length).toBe(count);
		expect(container.getElementsByClassName('sqd-toolbox').length).toBe(count);
	}

	it('renders designer correctly with all components', done => {
		const wrappedDefinition = wrapDefinition(definition);

		const { container, unmount } = render(
			<SequentialWorkflowDesigner
				definition={wrappedDefinition}
				onDefinitionChange={definitionChanged}
				rootEditor={<div />}
				stepEditor={<div />}
				stepsConfiguration={{}}
				toolboxConfiguration={{ groups: [] }}
				controlBar={true}
			/>
		);

		expect(container.getElementsByClassName('sqd-designer').length).toBe(1);
		expectUiComponents(container, 1);

		function definitionChanged(def: WrappedDefinition) {
			expect(def).not.toEqual(wrappedDefinition);
			expect(def.isValid).toBeDefined();
			unmount();
			done();
		}
	});

	it('hides all UI components', () => {
		const wrappedDefinition = wrapDefinition(definition);

		const { container, unmount } = render(
			<SequentialWorkflowDesigner
				definition={wrappedDefinition}
				onDefinitionChange={() => {
					/* nothing */
				}}
				rootEditor={false}
				stepEditor={false}
				stepsConfiguration={{}}
				toolboxConfiguration={false}
				controlBar={false}
			/>
		);

		expect(container.getElementsByClassName('sqd-designer').length).toBe(1);
		expectUiComponents(container, 0);

		unmount();
	});

	it('sets instance of designer to controller and after destroy removes it', async () => {
		const wrappedDefinition = wrapDefinition(definition);
		const controller = SequentialWorkflowDesignerController.create();

		expect(controller.isReady()).toBe(false);

		const { unmount, getByTestId } = render(
			<SequentialWorkflowDesigner
				definition={wrappedDefinition}
				onDefinitionChange={() => {
					/* nothing */
				}}
				rootEditor={false}
				stepEditor={false}
				stepsConfiguration={{}}
				toolboxConfiguration={false}
				controlBar={false}
				controller={controller}
			/>
		);

		await waitFor(() => getByTestId('designer'));

		expect(controller.isReady()).toBe(true);

		unmount();

		expect(controller.isReady()).toBe(false);
	});
});

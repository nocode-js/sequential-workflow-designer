import React from 'react';
import { render } from '@testing-library/react';
import { Definition } from 'sequential-workflow-designer';
import { SequentialWorkflowDesigner } from './SequentialWorkflowDesigner';
import { wrapDefinition, WrappedDefinition } from './WrappedDefinition';

describe('SequentialWorkflowDesigner', () => {
	const definition: Definition = {
		properties: {},
		sequence: []
	};

	it('renders designer correctly', done => {
		const wrappedDefinition = wrapDefinition(definition);

		const { container } = render(
			<SequentialWorkflowDesigner
				definition={wrappedDefinition}
				onDefinitionChange={definitionChanged}
				globalEditor={<div />}
				stepEditor={<div />}
				stepsConfiguration={{}}
				toolboxConfiguration={{ groups: [] }}
			/>
		);

		expect(container.getElementsByClassName('sqd-designer').length).toBe(1);

		function definitionChanged(def: WrappedDefinition) {
			expect(def).not.toEqual(wrappedDefinition);
			expect(def.isValid).toBeDefined();
			done();
		}
	});
});

<script lang="ts">
	import type { Definition, StepsConfiguration, ToolboxConfiguration, ValidatorConfiguration } from 'sequential-workflow-designer';
	import { SequentialWorkflowDesigner } from 'sequential-workflow-designer-svelte';
	import StepEditor from './step-editor.svelte';
	import RootEditor from './root-editor.svelte';
	import './style.css';

	let definition = createDefinition();
	let isReadonly = false;
	let isToolboxCollapsed = false;
	let isEditorCollapsed = false;
	let selectedStepId: string | null = null;
	let isValid: boolean | null = null;
	const steps: StepsConfiguration = {};
	const validator: ValidatorConfiguration = {
		step: step => step.name.length > 0
	};
	const toolbox: ToolboxConfiguration = {
		groups: [
			{
				name: 'Steps',
				steps: [createStep()]
			}
		]
	};

	function randId() {
		return Math.round(Math.random() * 1000000).toString(16);
	}

	function createStep() {
		return {
			id: randId(),
			type: 'step',
			name: 'test',
			componentType: 'task',
			properties: {
				comment: 'Some comment'
			}
		};
	}

	function createDefinition(): Definition {
		return {
			properties: {
				velocity: 20
			},
			sequence: [createStep(), createStep()]
		};
	}

	function onDefinitionChanged({ detail }: { detail: { definition: Definition; isValid: boolean } }) {
		definition = detail.definition;
		isValid = detail.isValid;
	}

	function onSelectedStepIdChanged({ detail }: { detail: { stepId: string | null } }) {
		selectedStepId = detail.stepId;
	}

	function onIsToolboxCollapsedChanged({ detail }: { detail: { isCollapsed: boolean } }) {
		isToolboxCollapsed = detail.isCollapsed;
	}

	function onIsEditorCollapsedChanged({ detail }: { detail: { isCollapsed: boolean } }) {
		isEditorCollapsed = detail.isCollapsed;
	}

	function toggleReadonly() {
		isReadonly = !isReadonly;
	}

	function toggleSelection() {
		if (selectedStepId) {
			selectedStepId = null;
		} else if (definition.sequence.length > 0) {
			selectedStepId = definition.sequence[0].id;
		}
	}

	function toggleEditor() {
		isEditorCollapsed = !isEditorCollapsed;
	}

	function toggleToolbox() {
		isToolboxCollapsed = !isToolboxCollapsed;
	}

	function resetDefinition() {
		definition = createDefinition();
	}
</script>

<SequentialWorkflowDesigner
	undoStackSize={4}
	{definition}
	on:definitionChanged={onDefinitionChanged}
	{steps}
	{validator}
	{toolbox}
	stepEditor={StepEditor}
	rootEditor={RootEditor}
	{selectedStepId}
	on:selectedStepIdChanged={onSelectedStepIdChanged}
	{isToolboxCollapsed}
	on:isToolboxCollapsedChanged={onIsToolboxCollapsedChanged}
	{isEditorCollapsed}
	on:isEditorCollapsedChanged={onIsEditorCollapsedChanged}
	{isReadonly}
/>

<div class="block">
	<button on:click={toggleReadonly}>{isReadonly ? 'Enable editing' : 'Disable editing'}</button>

	<button on:click={toggleSelection}>Toggle selection</button>

	<button on:click={resetDefinition}>Reset definition</button>

	<button on:click={toggleEditor}>Toggle editor</button>

	<button on:click={toggleToolbox}>Toggle toolbox</button>
</div>

<div class="block">
	Is valid: <strong>{isValid}</strong> &nbsp; Selected step: <strong>{selectedStepId}</strong>
</div>

<div class="block">
	This demo uses Svelte and <a href="https://github.com/nocode-js/sequential-workflow-designer/tree/main/svelte"
		>Sequential Workflow Designer for Svelte</a
	>.
</div>

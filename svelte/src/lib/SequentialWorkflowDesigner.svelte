<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import {
		Designer,
		DefinitionWalker,
		type Definition,
		type StepsConfiguration,
		type ToolboxConfiguration,
		type Step,
		type StepEditorContext,
		type GlobalEditorContext,
		type UndoStack,
		type ValidatorConfiguration,
		type UidGenerator,
		type DesignerExtension,
		type EditorsConfiguration,
		type CustomActionHandler
	} from 'sequential-workflow-designer';

	const dispatch = createEventDispatcher()

	export let definition: Definition;
	export let steps: StepsConfiguration;
	export let toolbox: Omit<ToolboxConfiguration, 'isCollapsed'> | false = false;
	export let isToolboxCollapsed = false;
	export let controlBar = true;
	export let theme = 'light';
	export let contextMenu = true;
	export let undoStackSize: number | undefined = undefined;
	export let undoStack: UndoStack | undefined = undefined;
	export let validator: ValidatorConfiguration | undefined = undefined;
	export let uidGenerator: UidGenerator | undefined = undefined;
	export let definitionWalker: DefinitionWalker | undefined = undefined;
	export let extensions: DesignerExtension[] | undefined = undefined;
	export let customActionHandler: CustomActionHandler | undefined = undefined;
	export let stepEditor: ConstructorOfATypedSvelteComponent | null = null;
	export let rootEditor: ConstructorOfATypedSvelteComponent | null = null;
	export let isEditorCollapsed = false;
	export let isReadonly = false;
	export let selectedStepId: string | null = null;

	let isFirstChange = true;
	let designer: Designer | null = null;
	let placeholder: HTMLElement;

	function init() {
		const editors: EditorsConfiguration | false = stepEditor && rootEditor
			? {
				isCollapsed: isEditorCollapsed,
				stepEditorProvider: (step: Step, context: StepEditorContext, def: Definition) => {
					if (!stepEditor) {
						throw new Error('No step editor provided');
					}

					const root = document.createElement('div');
					new stepEditor({
						target: root,
						props: { step, context, definition: def },
					})
					return root;
				},
				globalEditorProvider: (def: Definition, context: GlobalEditorContext) => {
					if (!rootEditor) {
						throw new Error('No root editor provided');
					}

					const root = document.createElement('div');
					new rootEditor({
						target: root,
						props: { definition: def, context },
					});
					return root;
				},
			}
			: false;
		const _toolbox: ToolboxConfiguration | false = toolbox ?
			{
				...toolbox,
				isCollapsed: isToolboxCollapsed,
			}
			: false;

		const d = Designer.create(placeholder, definition, {
			steps,
			controlBar,
			toolbox: _toolbox,
			editors,
			theme,
			contextMenu,
			undoStackSize,
			undoStack,
			validator,
			definitionWalker,
			extensions,
			isReadonly,
			uidGenerator,
			customActionHandler,
		});
		d.onReady.subscribe(() => dispatch('definitionChanged', {
			definition: d.getDefinition(),
			isValid: d.isValid()
		}));
		d.onDefinitionChanged.subscribe((definition) => dispatch('definitionChanged', {
			definition,
			isValid: d.isValid()
		}));
		d.onSelectedStepIdChanged.subscribe((stepId) => dispatch('selectedStepIdChanged', { stepId }));
		d.onIsToolboxCollapsedChanged.subscribe((isCollapsed) => dispatch('isToolboxCollapsedChanged', { isCollapsed }));
		d.onIsEditorCollapsedChanged.subscribe((isCollapsed) => dispatch('isEditorCollapsedChanged', { isCollapsed }));

		if (selectedStepId) {
			d.selectStepById(selectedStepId);
		}
		return d;
	}

	onMount(() => {
		designer = init();
	});

	$: {
		if (designer) {
			const isDefinitionChanged = !isFirstChange && definition !== designer.getDefinition();
			if (isDefinitionChanged) {
				designer.destroy();
				designer = init();
			} else {
				isFirstChange = false;

				if (isReadonly !== designer.isReadonly()) {
					designer.setIsReadonly(isReadonly);
				}
				if (selectedStepId !== designer.getSelectedStepId()) {
					if (selectedStepId) {
						designer.selectStepById(selectedStepId);
					} else {
						designer.clearSelectedStep();
					}
				}
				if (isEditorCollapsed !== designer.isEditorCollapsed()) {
					designer.setIsEditorCollapsed(isEditorCollapsed);
				}
				if (isToolboxCollapsed !== designer.isToolboxCollapsed()) {
					designer.setIsToolboxCollapsed(isToolboxCollapsed);
				}
			}
		}
	}

	onDestroy(() => {
		if (designer) {
			designer.destroy();
			designer = null;
		}
	});
</script>

<div bind:this={placeholder} class="sqd-designer-svelte"></div>

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
		type RootEditorContext,
		type UndoStack,
		type ValidatorConfiguration,
		type PlaceholderConfiguration,
		type UidGenerator,
		type DesignerExtension,
		type EditorsConfiguration,
		type CustomActionHandler,
		type StepEditorProvider,
		type RootEditorProvider,
		type KeyboardConfiguration,
		type I18n,
		type PreferenceStorage
	} from 'sequential-workflow-designer';

	const dispatch = createEventDispatcher<{
		definitionChanged: {
			definition: Definition;
			isValid: boolean;
		};
		selectedStepIdChanged: {
			stepId: string | null;
		};
		stepUnselectionBlocked: {
			targetStepId: string | null;
		};
		isToolboxCollapsedChanged: {
			isCollapsed: boolean;
		};
		isEditorCollapsedChanged: {
			isCollapsed: boolean;
		};
	}>();

	export let definition: Definition;
	export let steps: StepsConfiguration;
	export let toolbox: Omit<ToolboxConfiguration, 'isCollapsed'> | false = false;
	export let isToolboxCollapsed = false;
	export let controlBar = true;
	export let theme = 'light';
	export let contextMenu = true;
	export let keyboard: boolean | KeyboardConfiguration | undefined = undefined;
	export let preferenceStorage: PreferenceStorage | undefined = undefined;
	export let undoStackSize: number | undefined = undefined;
	export let undoStack: UndoStack | undefined = undefined;
	export let validator: ValidatorConfiguration | undefined = undefined;
	export let placeholder: PlaceholderConfiguration | undefined = undefined;
	export let definitionWalker: DefinitionWalker | undefined = undefined;
	export let extensions: DesignerExtension[] | undefined = undefined;
	export let i18n: I18n | undefined = undefined;
	export let uidGenerator: UidGenerator | undefined = undefined;
	export let customActionHandler: CustomActionHandler | undefined = undefined;

	/**
	 * @description Svelte component that will be used to render the step editor. If this property is set, the `nativeStepEditor` property will be ignored.
	 */
	export let stepEditor: ConstructorOfATypedSvelteComponent | null = null;
	/**
	 * @description Function that will be used to render the step editor.
	 */
	export let nativeStepEditor: StepEditorProvider | null = null;
	/**
	 * @description Svelte component that will be used to render the root editor. If this property is set, the `nativeRootEditor` property will be ignored.
	 */
	export let rootEditor: ConstructorOfATypedSvelteComponent | null = null;
	/**
	 * @description Function that will be used to render the root editor.
	 */
	export let nativeRootEditor: RootEditorProvider | null = null;

	export let isEditorCollapsed = false;
	export let isReadonly = false;
	export let selectedStepId: string | null = null;

	let isFirstChange = true;
	let designer: Designer | null = null;
	let root: HTMLElement;

	function init() {
		const editors: EditorsConfiguration | false =
			(stepEditor || nativeStepEditor) && (rootEditor || nativeRootEditor)
				? {
						isCollapsed: isEditorCollapsed,
						stepEditorProvider: (step: Step, context: StepEditorContext, def: Definition, isReadonly: boolean) => {
							if (stepEditor) {
								const root = document.createElement('div');
								new stepEditor({
									target: root,
									props: { step, context, definition: def, isReadonly }
								});
								return root;
							}
							if (nativeStepEditor) {
								return nativeStepEditor(step, context, def, isReadonly);
							}
							throw new Error('No step editor provided');
						},
						rootEditorProvider: (def: Definition, context: RootEditorContext, isReadonly: boolean) => {
							if (rootEditor) {
								const root = document.createElement('div');
								new rootEditor({
									target: root,
									props: { definition: def, context, isReadonly }
								});
								return root;
							}
							if (nativeRootEditor) {
								return nativeRootEditor(def, context, isReadonly);
							}
							throw new Error('No root editor provided');
						}
					}
				: false;
		const _toolbox: ToolboxConfiguration | false = toolbox
			? {
					...toolbox,
					isCollapsed: isToolboxCollapsed
				}
			: false;

		const d = Designer.create(root, definition, {
			steps,
			controlBar,
			toolbox: _toolbox,
			editors,
			theme,
			contextMenu,
			keyboard,
			preferenceStorage,
			undoStackSize,
			undoStack,
			validator,
			placeholder,
			definitionWalker,
			extensions,
			isReadonly,
			i18n,
			uidGenerator,
			customActionHandler
		});
		d.onReady.subscribe(() =>
			dispatch('definitionChanged', {
				definition: d.getDefinition(),
				isValid: d.isValid()
			})
		);
		d.onDefinitionChanged.subscribe(definition =>
			dispatch('definitionChanged', {
				definition,
				isValid: d.isValid()
			})
		);
		d.onSelectedStepIdChanged.subscribe(stepId => dispatch('selectedStepIdChanged', { stepId }));
		d.onStepUnselectionBlocked.subscribe(targetStepId => dispatch('stepUnselectionBlocked', { targetStepId }));
		d.onIsToolboxCollapsedChanged.subscribe(isCollapsed => dispatch('isToolboxCollapsedChanged', { isCollapsed }));
		d.onIsEditorCollapsedChanged.subscribe(isCollapsed => dispatch('isEditorCollapsedChanged', { isCollapsed }));

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

<div bind:this={root} class="sqd-designer-svelte" />

import { DesignerState } from '../designer-state';
import { StateModifier } from '../modifier/state-modifier';
import { DefinitionChangeType, RootEditorContext, StepEditorContext } from '../designer-configuration';
import { EditorRenderer, EditorRendererHandler } from './editor-renderer';
import { Definition, DefinitionWalker } from '../definition';
import { SimpleEvent, SimpleEventListener } from '../core';
import { StateModifierDependency } from '../modifier';

export interface SelectedStepIdProvider {
	onSelectedStepIdChanged: SimpleEvent<string | null>;
	selectedStepId: string | null;
}

export class EditorApi {
	public constructor(
		private readonly state: DesignerState,
		private readonly definitionWalker: DefinitionWalker,
		private readonly stateModifier: StateModifier
	) {}

	public isCollapsed(): boolean {
		return this.state.isEditorCollapsed;
	}

	public isReadonly(): boolean {
		return this.state.isReadonly;
	}

	public toggleIsCollapsed() {
		this.state.setIsEditorCollapsed(!this.state.isEditorCollapsed);
	}

	public subscribeIsCollapsed(listener: SimpleEventListener<boolean>) {
		this.state.onIsEditorCollapsedChanged.subscribe(listener);
	}

	public getDefinition(): Definition {
		return this.state.definition;
	}

	public addDefinitionModifierDependency(dependency: StateModifierDependency) {
		this.stateModifier.addDependency(dependency);
	}

	public runRenderer(
		rendererHandler: EditorRendererHandler,
		customSelectedStepIdProvider: SelectedStepIdProvider | null
	): EditorRenderer {
		const selectedStepIdProvider = customSelectedStepIdProvider || this.state;
		return EditorRenderer.create(this.state, selectedStepIdProvider, this.definitionWalker, rendererHandler);
	}

	public createStepEditorContext(stepId: string): StepEditorContext {
		if (!stepId) {
			throw new Error('Step id is empty');
		}
		return {
			notifyPropertiesChanged: () => {
				this.state.notifyDefinitionChanged(DefinitionChangeType.stepPropertyChanged, stepId);
			},
			notifyNameChanged: () => {
				this.state.notifyDefinitionChanged(DefinitionChangeType.stepNameChanged, stepId);
			},
			notifyChildrenChanged: () => {
				this.state.notifyDefinitionChanged(DefinitionChangeType.stepChildrenChanged, stepId);
				this.stateModifier.updateDependencies();
			}
		};
	}

	public createRootEditorContext(): RootEditorContext {
		return {
			notifyPropertiesChanged: () => {
				this.state.notifyDefinitionChanged(DefinitionChangeType.rootPropertyChanged, null);
			}
		};
	}
}

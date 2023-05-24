import { DefinitionChangeType, DesignerState } from '../designer-state';
import { DefinitionModifier } from '../definition-modifier';
import { GlobalEditorContext, StepEditorContext } from '../designer-configuration';
import { EditorRenderer, EditorRendererHandler } from './editor-renderer';
import { LayoutController } from '../layout-controller';
import { Definition, DefinitionWalker } from '../definition';

export class EditorApi {
	public constructor(
		private readonly state: DesignerState,
		private readonly definitionWalker: DefinitionWalker,
		private readonly layoutController: LayoutController,
		private readonly definitionModifier: DefinitionModifier
	) {}

	public isVisibleAtStart(): boolean {
		return this.layoutController.isMobile();
	}

	public getDefinition(): Definition {
		return this.state.definition;
	}

	public runRenderer(rendererHandler: EditorRendererHandler): EditorRenderer {
		return EditorRenderer.create(this.state, this.definitionWalker, rendererHandler);
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
				this.definitionModifier.updateDependantFields();
			}
		};
	}

	public createGlobalEditorContext(): GlobalEditorContext {
		return {
			notifyPropertiesChanged: () => {
				this.state.notifyDefinitionChanged(DefinitionChangeType.globalPropertyChanged, null);
			}
		};
	}
}

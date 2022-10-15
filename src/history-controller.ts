import { Definition } from './definition';
import { ObjectCloner } from './core/object-cloner';
import { DefinitionChangeType, DesignerState } from './designer-state';
import { DesignerConfiguration } from './designer-configuration';
import { DefinitionModifier } from './definition-modifier';

export class HistoryController {
	public static create(
		state: DesignerState,
		definitionModifier: DefinitionModifier,
		configuration: DesignerConfiguration
	): HistoryController {
		if (!configuration.undoStackSize || configuration.undoStackSize < 1) {
			throw new Error('Invalid undo stack size');
		}

		const controller = new HistoryController(state, definitionModifier, configuration.undoStackSize);
		controller.remember(DefinitionChangeType.rootReplaced, null);

		state.onDefinitionChanged.subscribe(event => {
			if (event.changeType !== DefinitionChangeType.rootReplaced) {
				controller.remember(event.changeType, event.stepId);
			}
		});
		return controller;
	}

	private readonly stack: HistoryItem[] = [];
	private currentIndex = 0;

	public constructor(
		private readonly state: DesignerState,
		private readonly definitionModifier: DefinitionModifier,
		private readonly stackSize: number
	) {}

	public canUndo(): boolean {
		return this.currentIndex > 1;
	}

	public undo() {
		this.currentIndex--;
		this.commit();
	}

	public canRedo(): boolean {
		return this.currentIndex < this.stack.length;
	}

	public redo() {
		this.currentIndex++;
		this.commit();
	}

	private remember(changeType: DefinitionChangeType, stepId: string | null) {
		const definition = ObjectCloner.deepClone(this.state.definition);

		if (this.stack.length > 0 && this.currentIndex === this.stack.length) {
			const lastItem = this.stack[this.stack.length - 1];
			if (areItemsEqual(lastItem, changeType, stepId)) {
				lastItem.definition = definition;
				return;
			}
		}

		this.stack.splice(this.currentIndex);
		this.stack.push({
			definition,
			changeType,
			stepId
		});

		if (this.stack.length > this.stackSize) {
			this.stack.splice(0, this.stack.length - this.stackSize - 1);
		}

		this.currentIndex = this.stack.length;
	}

	private commit() {
		const definition = ObjectCloner.deepClone(this.stack[this.currentIndex - 1].definition);
		this.definitionModifier.replaceDefinition(definition);
	}
}

function areItemsEqual(item: HistoryItem, changeType: DefinitionChangeType, stepId: string | null): boolean {
	return item.changeType === changeType && item.stepId === stepId;
}

interface HistoryItem {
	definition: Definition;
	changeType: DefinitionChangeType;
	stepId: string | null;
}

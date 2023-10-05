import { ObjectCloner } from './core/object-cloner';
import { DesignerState } from './designer-state';
import { DefinitionChangeType, DesignerConfiguration, UndoStack, UndoStackItem } from './designer-configuration';
import { DefinitionModifier } from './definition-modifier';

export class HistoryController {
	public static create(
		initialStack: UndoStack | undefined,
		state: DesignerState,
		definitionModifier: DefinitionModifier,
		configuration: DesignerConfiguration
	): HistoryController {
		if (!configuration.undoStackSize || configuration.undoStackSize < 1) {
			throw new Error('Invalid undo stack size');
		}

		const stack = initialStack || {
			index: 0,
			items: []
		};
		const controller = new HistoryController(stack, state, definitionModifier, configuration.undoStackSize);
		if (!initialStack) {
			controller.remember(DefinitionChangeType.rootReplaced, null);
		}

		state.onDefinitionChanged.subscribe(event => {
			if (event.changeType !== DefinitionChangeType.rootReplaced) {
				controller.remember(event.changeType, event.stepId);
			}
		});
		return controller;
	}

	public constructor(
		private readonly stack: UndoStack,
		private readonly state: DesignerState,
		private readonly definitionModifier: DefinitionModifier,
		private readonly stackSize: number
	) {}

	public canUndo(): boolean {
		return this.stack.index > 1;
	}

	public undo() {
		this.stack.index--;
		this.commit();
	}

	public canRedo(): boolean {
		return this.stack.index < this.stack.items.length;
	}

	public redo() {
		this.stack.index++;
		this.commit();
	}

	public dump(): UndoStack {
		return { ...this.stack };
	}

	private remember(changeType: DefinitionChangeType, stepId: string | null) {
		const definition = ObjectCloner.deepClone(this.state.definition);

		if (this.stack.items.length > 0 && this.stack.index === this.stack.items.length) {
			const lastItem = this.stack.items[this.stack.items.length - 1];
			if (areItemsEqual(lastItem, changeType, stepId)) {
				lastItem.definition = definition;
				return;
			}
		}

		this.stack.items.splice(this.stack.index);
		this.stack.items.push({
			definition,
			changeType,
			stepId
		});

		if (this.stack.items.length > this.stackSize) {
			this.stack.items.splice(0, this.stack.items.length - this.stackSize - 1);
		}

		this.stack.index = this.stack.items.length;
	}

	private commit() {
		const definition = ObjectCloner.deepClone(this.stack.items[this.stack.index - 1].definition);
		this.definitionModifier.replaceDefinition(definition);
	}
}

function areItemsEqual(item: UndoStackItem, changeType: DefinitionChangeType, stepId: string | null): boolean {
	return item.changeType === changeType && item.stepId === stepId;
}

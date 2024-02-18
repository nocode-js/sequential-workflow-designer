import { ObjectCloner } from './core/object-cloner';
import { DesignerState } from './designer-state';
import { DefinitionChangeType, DesignerConfiguration, UndoStack, UndoStackItem } from './designer-configuration';
import { StateModifier } from './modifier/state-modifier';
import { Definition } from './definition';

export class HistoryController {
	public static create(
		initialStack: UndoStack | undefined,
		state: DesignerState,
		stateModifier: StateModifier,
		configuration: DesignerConfiguration
	): HistoryController {
		if (!configuration.undoStackSize || configuration.undoStackSize < 1) {
			throw new Error('Invalid undo stack size');
		}

		const stack = initialStack || {
			index: 0,
			items: []
		};
		const controller = new HistoryController(stack, state, stateModifier, configuration.undoStackSize);
		if (!initialStack) {
			controller.rememberCurrent(DefinitionChangeType.rootReplaced, null);
		}

		state.onDefinitionChanged.subscribe(event => {
			if (event.changeType !== DefinitionChangeType.rootReplaced) {
				controller.rememberCurrent(event.changeType, event.stepId);
			}
		});
		return controller;
	}

	public constructor(
		private readonly stack: UndoStack,
		private readonly state: DesignerState,
		private readonly stateModifier: StateModifier,
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

	public replaceDefinition(definition: Definition) {
		if (definition == this.state.definition) {
			throw new Error('Cannot use the same instance of definition');
		}

		this.remember(definition, DefinitionChangeType.rootReplaced, null);
		this.commit();
	}

	private rememberCurrent(changeType: DefinitionChangeType, stepId: string | null) {
		this.remember(this.state.definition, changeType, stepId);
	}

	private remember(sourceDefinition: Definition, changeType: DefinitionChangeType, stepId: string | null) {
		const definition = ObjectCloner.deepClone(sourceDefinition);

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
		this.stateModifier.replaceDefinition(definition);
	}
}

function areItemsEqual(item: UndoStackItem, changeType: DefinitionChangeType, stepId: string | null): boolean {
	return changeType !== DefinitionChangeType.rootReplaced && item.changeType === changeType && item.stepId === stepId;
}

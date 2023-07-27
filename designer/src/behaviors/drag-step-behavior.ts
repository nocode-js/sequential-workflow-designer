import { Vector } from '../core/vector';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';
import { Placeholder } from '../workspace/component';
import { Behavior } from './behavior';
import { DragStepView } from './drag-step-behavior-view';
import { PlaceholderFinder } from './placeholder-finder';
import { DesignerState } from '../designer-state';
import { DefinitionModifier } from '../definition-modifier';
import { WorkspaceController } from '../workspace/workspace-controller';
import { StepComponent } from '../workspace/step-component';

export class DragStepBehavior implements Behavior {
	public static create(designerContext: DesignerContext, step: Step, draggedStepComponent?: StepComponent): DragStepBehavior {
		const view = DragStepView.create(step, designerContext.theme, designerContext.componentContext);
		return new DragStepBehavior(
			view,
			designerContext.workspaceController,
			designerContext.state,
			step,
			designerContext.definitionModifier,
			draggedStepComponent
		);
	}

	private state?: {
		finder: PlaceholderFinder;
		startPosition: Vector;
		offset: Vector;
	};
	private currentPlaceholder?: Placeholder;

	private constructor(
		private readonly view: DragStepView,
		private readonly workspaceController: WorkspaceController,
		private readonly designerState: DesignerState,
		private readonly step: Step,
		private readonly definitionModifier: DefinitionModifier,
		private readonly draggedStepComponent?: StepComponent
	) {}

	public onStart(position: Vector) {
		let offset: Vector | null = null;

		if (this.draggedStepComponent) {
			this.draggedStepComponent.setIsDisabled(true);

			const hasSameSize =
				this.draggedStepComponent.view.width === this.view.component.width &&
				this.draggedStepComponent.view.height === this.view.component.height;
			if (hasSameSize) {
				const scroll = new Vector(window.scrollX, window.scrollY);
				// Mouse cursor will be positioned on the same place as the source component.
				const pagePosition = this.draggedStepComponent.view.getClientPosition().add(scroll);
				offset = position.subtract(pagePosition);
			}
		}
		if (!offset) {
			// Mouse cursor will be positioned in the center of the component.
			offset = new Vector(this.view.component.width, this.view.component.height).divideByScalar(2);
		}

		this.view.setPosition(position.subtract(offset));
		this.designerState.setIsDragging(true);

		const placeholders = this.workspaceController.getPlaceholders();
		this.state = {
			startPosition: position,
			finder: PlaceholderFinder.create(placeholders, this.designerState),
			offset
		};
	}

	public onMove(delta: Vector) {
		if (this.state) {
			const newPosition = this.state.startPosition.subtract(delta).subtract(this.state.offset);
			this.view.setPosition(newPosition);

			const placeholder = this.state.finder.find(newPosition, this.view.component.width, this.view.component.height);

			if (this.currentPlaceholder !== placeholder) {
				if (this.currentPlaceholder) {
					this.currentPlaceholder.setIsHover(false);
				}
				if (placeholder) {
					placeholder.setIsHover(true);
				}
				this.currentPlaceholder = placeholder;
			}
		}
	}

	public onEnd(interrupt: boolean) {
		if (!this.state) {
			throw new Error('Invalid state');
		}

		this.state.finder.destroy();
		this.state = undefined;

		this.view.remove();
		this.designerState.setIsDragging(false);

		let modified = false;

		if (!interrupt && this.currentPlaceholder) {
			if (this.draggedStepComponent) {
				modified = this.definitionModifier.tryMove(
					this.draggedStepComponent.parentSequence,
					this.draggedStepComponent.step,
					this.currentPlaceholder.parentSequence,
					this.currentPlaceholder.index
				);
			} else {
				modified = this.definitionModifier.tryInsert(
					this.step,
					this.currentPlaceholder.parentSequence,
					this.currentPlaceholder.index
				);
			}
		}
		if (!modified) {
			if (this.draggedStepComponent) {
				this.draggedStepComponent.setIsDisabled(false);
			}
			if (this.currentPlaceholder) {
				this.currentPlaceholder.setIsHover(false);
			}
		}
		this.currentPlaceholder = undefined;
	}
}

import { Vector } from '../core/vector';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';
import { FoundPlaceholders, Placeholder } from '../workspace/component';
import { Behavior } from './behavior';
import { DragStepView } from './drag-step-behavior-view';
import { PlaceholderFinder } from './placeholder-finder';
import { DesignerState } from '../designer-state';
import { StateModifier } from '../modifier/state-modifier';
import { WorkspaceController } from '../workspace/workspace-controller';
import { StepComponent } from '../workspace/step-component';
import { PlaceholderController } from '../workspace/placeholder/placeholder-controller';

export class DragStepBehavior implements Behavior {
	public static create(designerContext: DesignerContext, step: Step, draggedStepComponent?: StepComponent): DragStepBehavior {
		const view = DragStepView.create(step, designerContext.theme, designerContext.componentContext);
		return new DragStepBehavior(
			view,
			designerContext.workspaceController,
			designerContext.placeholderController,
			designerContext.state,
			step,
			designerContext.stateModifier,
			draggedStepComponent
		);
	}

	private state?: {
		finder: PlaceholderFinder;
		startPosition: Vector;
		offset: Vector;
	} & FoundPlaceholders;
	private currentPlaceholder?: Placeholder;

	private constructor(
		private readonly view: DragStepView,
		private readonly workspaceController: WorkspaceController,
		private readonly placeholderController: PlaceholderController,
		private readonly designerState: DesignerState,
		private readonly step: Step,
		private readonly stateModifier: StateModifier,
		private readonly draggedStepComponent?: StepComponent
	) {}

	public onStart(position: Vector) {
		let offset: Vector | null = null;

		if (this.draggedStepComponent) {
			this.draggedStepComponent.setIsDisabled(true);
			this.draggedStepComponent.setIsDragging(true);

			const hasSameSize =
				this.draggedStepComponent.view.width === this.view.component.width &&
				this.draggedStepComponent.view.height === this.view.component.height;
			if (hasSameSize) {
				// Mouse cursor will be positioned on the same place as the source component.
				const pagePosition = this.draggedStepComponent.view.getClientPosition();
				offset = position.subtract(pagePosition);
			}
		}
		if (!offset) {
			// Mouse cursor will be positioned in the center of the component.
			offset = new Vector(this.view.component.width, this.view.component.height).divideByScalar(2);
		}

		this.view.setPosition(position.subtract(offset));
		this.designerState.setIsDragging(true);

		const { placeholders, components } = this.resolvePlaceholders(this.draggedStepComponent);
		this.state = {
			placeholders,
			components,
			startPosition: position,
			finder: PlaceholderFinder.create(placeholders, this.designerState),
			offset
		};

		placeholders.forEach(placeholder => placeholder.setIsVisible(true));
		components.forEach(component => component.setIsDragging(true));
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

		this.state.placeholders.forEach(placeholder => placeholder.setIsVisible(false));
		this.state.components.forEach(component => component.setIsDragging(false));
		this.state.finder.destroy();
		this.state = undefined;

		this.view.remove();
		this.designerState.setIsDragging(false);

		let modified = false;

		if (!interrupt && this.currentPlaceholder) {
			if (this.draggedStepComponent) {
				modified = this.stateModifier.tryMove(
					this.draggedStepComponent.parentSequence,
					this.draggedStepComponent.step,
					this.currentPlaceholder.parentSequence,
					this.currentPlaceholder.index
				);
			} else {
				modified = this.stateModifier.tryInsert(this.step, this.currentPlaceholder.parentSequence, this.currentPlaceholder.index);
			}
		}
		if (!modified) {
			if (this.draggedStepComponent) {
				this.draggedStepComponent.setIsDisabled(false);
				this.draggedStepComponent.setIsDragging(false);
			}
			if (this.currentPlaceholder) {
				this.currentPlaceholder.setIsHover(false);
			}
		}
		this.currentPlaceholder = undefined;
	}

	private resolvePlaceholders(skipComponent: StepComponent | undefined): FoundPlaceholders {
		const result = this.workspaceController.resolvePlaceholders(skipComponent);
		if (this.placeholderController.canShow) {
			const canShow = this.placeholderController.canShow;
			result.placeholders = result.placeholders.filter(placeholder =>
				canShow(placeholder.parentSequence, placeholder.index, this.step.componentType, this.step.type)
			);
		}
		return result;
	}
}

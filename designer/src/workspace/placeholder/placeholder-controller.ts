import { Sequence } from 'sequential-workflow-model';
import { PlaceholderConfiguration } from '../../designer-configuration';
import { DesignerState } from '../../designer-state';

export class PlaceholderController {
	public static create(state: DesignerState, configuration: PlaceholderConfiguration | undefined): PlaceholderController {
		return new PlaceholderController(state, configuration);
	}

	public readonly canCreate: (sequence: Sequence, index: number) => boolean;
	public readonly canShow: (sequence: Sequence, index: number, draggingStepComponentType: string, draggingStepType: string) => boolean;

	private constructor(
		state: DesignerState,
		private readonly configuration: PlaceholderConfiguration | undefined
	) {
		const canCreate = this.configuration?.canCreate;
		const canShow = this.configuration?.canShow;

		this.canCreate = canCreate ? (sequence, index) => canCreate(sequence, index, state.definition) : () => true;
		this.canShow = canShow
			? (sequence, index, draggingStepComponentType, draggingStepType) =>
					canShow(sequence, index, draggingStepComponentType, draggingStepType, state.definition)
			: () => true;
	}
}

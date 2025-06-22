import { Sequence } from 'sequential-workflow-model';
import { PlaceholderConfiguration } from '../../designer-configuration';

export class PlaceholderController {
	public static create(configuration: PlaceholderConfiguration | undefined): PlaceholderController {
		return new PlaceholderController(configuration);
	}

	private constructor(private readonly configuration: PlaceholderConfiguration | undefined) {}

	public readonly canCreate: (sequence: Sequence, index: number) => boolean = this.configuration?.canCreate ?? (() => true);

	public readonly canShow: (sequence: Sequence, index: number, draggingStepComponentType: string, draggingStepType: string) => boolean =
		this.configuration?.canShow ?? (() => true);
}

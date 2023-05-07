import { SequenceComponentExtension } from '../../designer-extension';
import { DefaultSequenceComponent } from './default-sequence-component';

export class DefaultSequenceComponentExtension implements SequenceComponentExtension {
	public readonly create = DefaultSequenceComponent.create;
}

import { StepOrName, StepsTraverser } from './core/steps-traverser';
import { Uid } from './core/uid';
import { Definition, Sequence, Step } from './definition';

export class Utils {
	public static readonly nextId: () => string = Uid.next;
	public static readonly getParents: (definition: Definition, needle: Sequence | Step) => StepOrName[] = StepsTraverser.getParents;
}

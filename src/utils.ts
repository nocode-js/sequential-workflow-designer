import { StepsTranverser } from './core/steps-traverser';
import { Uid } from './core/uid';

export class Utils {
	public static readonly nextId = Uid.next;
	public static readonly getParents = StepsTranverser.getParents;
}

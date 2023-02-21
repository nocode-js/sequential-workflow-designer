import { Sequence } from '../../definition';

export interface SequenceContext {
	sequence: Sequence;
	depth: number;
	isInputConnected: boolean;
	isOutputConnected: boolean;
}

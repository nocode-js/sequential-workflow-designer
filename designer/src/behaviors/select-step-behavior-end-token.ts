import { BehaviorEndToken } from './behavior';

export const TYPE = 'selectStep';

export class SelectStepBehaviorEndToken implements BehaviorEndToken {
	public static is(token: BehaviorEndToken | null): token is SelectStepBehaviorEndToken {
		return Boolean(token) && (token as SelectStepBehaviorEndToken).type === TYPE;
	}

	public readonly type = TYPE;

	public constructor(
		public readonly stepId: string,
		public readonly time: number
	) {}
}

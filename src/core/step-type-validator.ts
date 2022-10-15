const regexp = /^[a-zA-Z][a-zA-Z0-9_-]+$/;

export class StepTypeValidator {
	public static validate(type: string) {
		if (!regexp.test(type)) {
			throw new Error(`Step type "${type}" contains not allowed characters`);
		}
	}
}

import { Step } from '../definition';
import { StepComponent } from './component';
import { DesignerExtension, StepExtension } from '../designer-configuration';
import { StepExtensionResolver } from './step-extension-resolver';

class OwnTaskStepExtension implements StepExtension<Step> {
	public readonly componentType = 'task';

	public createComponent(): StepComponent {
		throw new Error('Not implemented');
	}
	public getChildren() {
		return null;
	}
}

const ownTaskStepExtension = new OwnTaskStepExtension();

class OwnTaskDesignerExtension implements DesignerExtension {
	public readonly name: string = 'test';
	public steps: StepExtension<Step>[] = [ownTaskStepExtension];
}

describe('StepExtensionsResolver', () => {
	describe('default resolver', () => {
		const resolver = StepExtensionResolver.create([]);

		it('resolves task', () => {
			expect(resolver.resolve('task')).toBeDefined();
		});

		it('resolves switch', () => {
			expect(resolver.resolve('switch')).toBeDefined();
		});

		it('resolves container', () => {
			expect(resolver.resolve('container')).toBeDefined();
		});
	});

	it('can replace default extension', () => {
		const resolver = StepExtensionResolver.create([new OwnTaskDesignerExtension()]);

		expect(resolver.resolve('task')).toEqual(ownTaskStepExtension);
	});
});

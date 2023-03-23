import { Step } from '../definition';
import { StepExtension } from '../designer-extension';
import { ServicesResolver } from '../services';
import { createDesignerConfigurationStub } from '../test-tools/stubs';
import { StepComponentView } from './component';
import { StepExtensionResolver } from './step-extension-resolver';

class OwnTaskStepExtension implements StepExtension<Step> {
	public readonly componentType = 'task';

	public createComponentView(): StepComponentView {
		throw new Error('Not implemented');
	}
	public getChildren() {
		return null;
	}
}

const ownTaskStepExtension = new OwnTaskStepExtension();

describe('StepExtensionResolver', () => {
	describe('default resolver', () => {
		const configuration = createDesignerConfigurationStub();
		const services = ServicesResolver.resolve([], configuration);
		const resolver = StepExtensionResolver.create(services);

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
		const configuration = createDesignerConfigurationStub();
		const services = ServicesResolver.resolve(
			[
				{
					steps: [ownTaskStepExtension]
				}
			],
			configuration
		);
		const resolver = StepExtensionResolver.create(services);

		expect(resolver.resolve('task')).toEqual(ownTaskStepExtension);
	});
});

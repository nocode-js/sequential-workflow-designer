import {
	createDefinitionStub,
	createDesignerConfigurationStub,
	createDesignerContextStub,
	createComponentContextStub,
	createStepStub
} from './stubs';

describe('stubs', () => {
	it('createDesignerConfigurationStub() returns an instance', () => {
		const context = createDesignerConfigurationStub();
		expect(context).toBeDefined();
	});

	it('createStepStub() returns an instance', () => {
		const context = createStepStub();
		expect(context).toBeDefined();
	});

	it('createDefinitionStub() returns an instance', () => {
		const context = createDefinitionStub();
		expect(context).toBeDefined();
	});

	it('createDesignerContextStub() returns an instance', () => {
		const context = createDesignerContextStub();
		expect(context).toBeDefined();
	});

	it('createComponentContextStub() returns an instance', () => {
		const context = createComponentContextStub();
		expect(context).toBeDefined();
	});
});

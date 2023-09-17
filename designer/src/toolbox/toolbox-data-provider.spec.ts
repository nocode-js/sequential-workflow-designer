import { ToolboxDataProvider } from './toolbox-data-provider';
import { IconProvider } from '../core/icon-provider';
import { StepDefinition } from '../designer-configuration';

describe('ToolboxDataProvider', () => {
	const iconProvider = new IconProvider({
		iconUrlProvider: (_, type) => `${type}.jpg`
	});

	const sendEmailStep = {
		componentType: 'task',
		name: 'Send email',
		properties: {},
		type: 'sendEmail'
	};
	const writeFileStep = {
		componentType: 'task',
		name: 'Write file',
		properties: {},
		type: 'writeFile'
	};
	const groups = [
		{
			name: 'Foo',
			steps: [sendEmailStep, writeFileStep]
		}
	];

	describe('getAllGroups()', () => {
		it('return empty array if configuration is false', () => {
			const dataProvider = new ToolboxDataProvider(iconProvider, false);

			expect(dataProvider.getAllGroups()).toEqual([]);
		});

		it('returns groups with correct labels and descriptions', () => {
			const dataProvider = new ToolboxDataProvider(iconProvider, {
				groups
			});

			const data = dataProvider.getAllGroups();
			const group1 = data[0];

			expect(group1.name).toEqual('Foo');
			expect(group1.items.length).toEqual(2);
			const g1i1 = group1.items[0];
			expect(g1i1.iconUrl).toEqual('sendEmail.jpg');
			expect(g1i1.label).toEqual('Send email');
			expect(g1i1.lowerCaseLabel).toEqual('send email');
			expect(g1i1.description).toEqual('Send email');
			expect(g1i1.step).toEqual(groups[0].steps[0]);
		});

		it('returns groups with correct labels and descriptions when custom providers are provided', () => {
			const dataProvider = new ToolboxDataProvider(iconProvider, {
				groups,
				labelProvider: reverseStepName,
				descriptionProvider: step => `Description of ${step.name}`
			});

			const data = dataProvider.getAllGroups();
			const group1 = data[0];

			expect(group1.name).toEqual('Foo');
			expect(group1.items.length).toEqual(2);
			const g1i1 = group1.items[0];
			expect(g1i1.iconUrl).toEqual('sendEmail.jpg');
			expect(g1i1.label).toEqual('liame dneS');
			expect(g1i1.lowerCaseLabel).toEqual('liame dnes');
			expect(g1i1.description).toEqual('Description of Send email');
			expect(g1i1.step).toEqual(groups[0].steps[0]);
		});
	});

	describe('applyFilter()', () => {
		it('filters by label', () => {
			const dataProvider = new ToolboxDataProvider(iconProvider, {
				groups
			});

			const allGroups = dataProvider.getAllGroups();
			expect(allGroups[0].items.length).toBe(2);

			const r1 = dataProvider.applyFilter(allGroups, 'not existing label');
			expect(r1.length).toBe(0);

			const r2 = dataProvider.applyFilter(allGroups, 'liame');
			expect(r2.length).toBe(0);

			const r3 = dataProvider.applyFilter(allGroups, 'fil');
			expect(r3[0].items.length).toBe(1);
			expect(r3[0].items[0].step).toBe(writeFileStep);

			const r4 = dataProvider.applyFilter(allGroups, 'Send email');
			expect(r4[0].items.length).toBe(1);
			expect(r4[0].items[0].step).toBe(sendEmailStep);
		});

		it('filters by custom label', () => {
			const dataProvider = new ToolboxDataProvider(iconProvider, {
				groups,
				labelProvider: reverseStepName
			});

			const allGroups = dataProvider.getAllGroups();
			expect(allGroups[0].items.length).toBe(2);

			const r1 = dataProvider.applyFilter(allGroups, 'not existing label');
			expect(r1.length).toBe(0);

			const r2 = dataProvider.applyFilter(allGroups, 'liame');
			expect(r2[0].items.length).toBe(1);

			const r3 = dataProvider.applyFilter(allGroups, 'ELIF');
			expect(r3[0].items.length).toBe(1);
			expect(r3[0].items[0].step).toBe(writeFileStep);

			const r4 = dataProvider.applyFilter(allGroups, 'Send email');
			expect(r4.length).toBe(0);
		});
	});
});

function reverseStepName(step: StepDefinition): string {
	return step.name.split('').reverse().join('');
}

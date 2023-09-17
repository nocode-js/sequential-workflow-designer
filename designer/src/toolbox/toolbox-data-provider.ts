import { IconProvider } from '../core/icon-provider';
import { StepTypeValidator } from '../core/step-type-validator';
import { StepDefinition, ToolboxConfiguration } from '../designer-configuration';

export class ToolboxDataProvider {
	public constructor(private readonly iconProvider: IconProvider, private readonly configuration: ToolboxConfiguration | false) {}

	public getAllGroups(): ToolboxGroupData[] {
		if (!this.configuration) {
			return [];
		}
		return this.configuration.groups.map(group => {
			return {
				name: group.name,
				items: group.steps.map(this.createItemData)
			};
		});
	}

	private readonly createItemData = (step: StepDefinition): ToolboxItemData => {
		StepTypeValidator.validate(step.type);

		const iconUrl = this.iconProvider.getIconUrl(step);
		const label = this.configuration && this.configuration.labelProvider ? this.configuration.labelProvider(step) : step.name;
		const description =
			this.configuration && this.configuration.descriptionProvider ? this.configuration.descriptionProvider(step) : label;
		const lowerCaseLabel = label.toLowerCase();
		return {
			iconUrl,
			label,
			description,
			lowerCaseLabel,
			step
		};
	};

	public applyFilter(allGroups: ToolboxGroupData[], filter: string | undefined): ToolboxGroupData[] {
		if (!filter) {
			return allGroups;
		}
		const lowerCaseFilter = filter.toLowerCase();
		return allGroups
			.map(group => {
				return {
					name: group.name,
					items: group.items.filter(s => {
						return s.lowerCaseLabel.includes(lowerCaseFilter);
					})
				};
			})
			.filter(group => group.items.length > 0);
	}
}

export interface ToolboxGroupData {
	name: string;
	items: ToolboxItemData[];
}

export interface ToolboxItemData {
	iconUrl: string | null;
	label: string;
	lowerCaseLabel: string;
	description: string;
	step: StepDefinition;
}

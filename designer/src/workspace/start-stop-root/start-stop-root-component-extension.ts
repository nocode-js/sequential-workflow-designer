import { Sequence } from 'sequential-workflow-model';
import { ComponentContext } from '../../component-context';
import { Icons } from '../../core';
import { RootComponentExtension, SequencePlaceIndicator } from '../../designer-extension';
import { StartStopRootComponent } from './start-stop-root-component';
import { StartStopRootComponentExtensionConfiguration } from './start-stop-root-component-extension-configuration';
import { Component } from '../component';
import { StartStopRootComponentViewConfiguration } from './start-stop-root-component-view-configuration';

const defaultViewConfiguration: StartStopRootComponentViewConfiguration = {
	size: 30,
	defaultIconSize: 22,
	folderIconSize: 18,
	start: {
		iconD: Icons.play
	},
	stopIconD: Icons.stop,
	folderIconD: Icons.folder
};

export class StartStopRootComponentExtension implements RootComponentExtension {
	public static create(configuration?: StartStopRootComponentExtensionConfiguration) {
		return new StartStopRootComponentExtension(configuration);
	}

	private constructor(private readonly configuration: StartStopRootComponentExtensionConfiguration | undefined) {}

	public create(
		parentElement: SVGElement,
		sequence: Sequence,
		parentPlaceIndicator: SequencePlaceIndicator | null,
		context: ComponentContext
	): Component {
		const view = this.configuration?.view ? { ...defaultViewConfiguration, ...this.configuration.view } : defaultViewConfiguration;
		return StartStopRootComponent.create(parentElement, sequence, parentPlaceIndicator, context, view);
	}
}

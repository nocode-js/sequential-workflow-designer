import { Sequence } from 'sequential-workflow-model';
import { ComponentContext } from '../../component-context';
import { Icons } from '../../core';
import { RootComponentExtension, SequencePlaceIndicator } from '../../designer-extension';
import { StartStopRootComponent } from './start-stop-root-component';
import { StartStopRootComponentExtensionConfiguration } from './start-stop-root-component-extension-configuration';
import { Component } from '../component';

const defaultConfiguration: StartStopRootComponentExtensionConfiguration = {
	view: {
		size: 30,
		defaultIconSize: 22,
		folderIconSize: 18,
		startIconD: Icons.play,
		stopIconD: Icons.stop,
		folderIconD: Icons.folder
	}
};

export class StartStopRootComponentExtension implements RootComponentExtension {
	public static create(configuration?: StartStopRootComponentExtensionConfiguration) {
		return new StartStopRootComponentExtension(configuration ?? defaultConfiguration);
	}

	private constructor(private readonly configuration: StartStopRootComponentExtensionConfiguration) {}

	public create(
		parentElement: SVGElement,
		sequence: Sequence,
		parentPlaceIndicator: SequencePlaceIndicator | null,
		context: ComponentContext
	): Component {
		return StartStopRootComponent.create(parentElement, sequence, parentPlaceIndicator, context, this.configuration.view);
	}
}

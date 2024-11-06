import { WorkspaceApi } from '../../api';
import { Vector } from '../../core';
import { NextScale, Viewport, ViewportController } from '../../designer-extension';
import { CenteredViewportCalculator } from './centered-viewport-calculator';
import { DefaultViewportControllerConfiguration } from './default-viewport-controller-configuration';
import { NextQuantifiedNumber } from './next-quantified-number';

const defaultConfiguration: DefaultViewportControllerConfiguration = {
	scales: [0.06, 0.08, 0.1, 0.12, 0.16, 0.2, 0.26, 0.32, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
	smoothDeltaYLimit: 16,
	padding: 10
};

export class DefaultViewportController implements ViewportController {
	public static create(api: WorkspaceApi, configuration?: DefaultViewportControllerConfiguration): DefaultViewportController {
		const config = configuration ?? defaultConfiguration;
		const nqn = new NextQuantifiedNumber(config.scales);
		return new DefaultViewportController(config.smoothDeltaYLimit, nqn, api, config.padding);
	}

	private constructor(
		public readonly smoothDeltaYLimit: number,
		private readonly nqn: NextQuantifiedNumber,
		private readonly api: WorkspaceApi,
		private readonly padding: number
	) {}

	public getDefault(): Viewport {
		const rootComponentSize = this.api.getRootComponentSize();
		const canvasSize = this.api.getCanvasSize();

		return CenteredViewportCalculator.center(this.padding, canvasSize, rootComponentSize);
	}

	public getZoomed(direction: boolean): Viewport | null {
		const current = this.api.getViewport();
		const nextScale = this.nqn.next(current.scale, direction);
		if (nextScale) {
			return {
				position: current.position,
				scale: nextScale.next
			};
		}
		return null;
	}

	public getFocusedOnComponent(componentPosition: Vector, componentSize: Vector): Viewport {
		const viewport = this.api.getViewport();
		const canvasSize = this.api.getCanvasSize();

		return CenteredViewportCalculator.getFocusedOnComponent(canvasSize, viewport, componentPosition, componentSize);
	}

	public getNextScale(scale: number, direction: boolean): NextScale {
		return this.nqn.next(scale, direction);
	}

	public limitScale(scale: number): number {
		return this.nqn.limit(scale);
	}
}

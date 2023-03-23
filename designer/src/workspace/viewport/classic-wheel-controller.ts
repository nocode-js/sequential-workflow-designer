import { WorkspaceApi } from '../../api/workspace-api';
import { WheelController } from '../../designer-extension';
import { QuantifiedScaleViewportCalculator } from './quantified-scale-viewport-calculator';

export class ClassicWheelController implements WheelController {
	public static create(api: WorkspaceApi) {
		return new ClassicWheelController(api);
	}

	private constructor(private readonly api: WorkspaceApi) {}

	public onWheel(e: WheelEvent) {
		const viewport = this.api.getViewport();
		const canvasPosition = this.api.getCanvasPosition();
		const newViewport = QuantifiedScaleViewportCalculator.zoomByWheel(viewport, e, canvasPosition);
		if (newViewport) {
			this.api.setViewport(newViewport);
		}
	}
}

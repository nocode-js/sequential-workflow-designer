import { WorkspaceApi } from '../../api/workspace-api';
import { WheelController } from '../../designer-extension';
import { QuantifiedScaleViewPortCalculator } from './quantified-scale-view-port-calculator';

export class ClassicWheelController implements WheelController {
	public static create(api: WorkspaceApi) {
		return new ClassicWheelController(api);
	}

	private constructor(private readonly api: WorkspaceApi) {}

	public onWheel(e: WheelEvent) {
		const viewPort = this.api.getViewPort();
		const canvasPosition = this.api.getCanvasPosition();
		const newViewPort = QuantifiedScaleViewPortCalculator.zoomByWheel(viewPort, e, canvasPosition);
		if (newViewPort) {
			this.api.setViewPort(newViewPort);
		}
	}
}

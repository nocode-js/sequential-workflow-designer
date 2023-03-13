import { DesignerApi } from '../../api/designer-api';
import { WorkspaceApi } from '../../api/workspace-api';
import { WheelController } from '../../designer-extension';
import { QuantifiedScaleViewPortCalculator } from './quantified-scale-view-port-calculator';

export class ClassicWheelController implements WheelController {
	public static create(api: DesignerApi) {
		return new ClassicWheelController(api.workspace);
	}

	private constructor(private readonly api: WorkspaceApi) {}

	public onWheel(e: WheelEvent) {
		const newViewPort = QuantifiedScaleViewPortCalculator.zoomByWheel(this.api.getViewPort(), e, this.api.getClientPosition());
		if (newViewPort) {
			this.api.setViewPort(newViewPort);
		}
	}

	public destroy() {
		//
	}
}

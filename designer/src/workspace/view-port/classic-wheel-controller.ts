import { DesignerContext } from '../../designer-context';
import { WheelController, WorkspaceClientPositionSource } from '../../designer-extension';
import { DesignerState } from '../../designer-state';
import { QuantifiedScaleViewPortCalculator } from './quantified-scale-view-port-calculator';

export class ClassicWheelController implements WheelController {
	public static create(context: DesignerContext, positionSource: WorkspaceClientPositionSource) {
		return new ClassicWheelController(context.state, positionSource);
	}

	private constructor(private readonly state: DesignerState, private readonly positionSource: WorkspaceClientPositionSource) {}

	public onWheel(e: WheelEvent) {
		const newViewPort = QuantifiedScaleViewPortCalculator.zoomByWheel(this.state.viewPort, e, this.positionSource.getClientPosition());
		if (newViewPort) {
			this.state.setViewPort(newViewPort);
		}
	}

	public destroy() {
		//
	}
}

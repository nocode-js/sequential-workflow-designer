import { ViewportApi } from '../../api/viewport-api';
import { WheelController } from '../../designer-extension';

export class ClassicWheelController implements WheelController {
	public static create(api: ViewportApi) {
		return new ClassicWheelController(api);
	}

	private constructor(private readonly api: ViewportApi) {}

	public onWheel(e: WheelEvent) {
		this.api.handleWheelEvent(e);
	}
}

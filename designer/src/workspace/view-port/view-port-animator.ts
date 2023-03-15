import { WorkspaceApi } from '../../api';
import { animate, Animation } from '../../core/animation';
import { ViewPort } from '../../designer-extension';

export class ViewPortAnimator {
	private animation?: Animation;

	public constructor(private readonly api: WorkspaceApi) {}

	public execute(target: ViewPort) {
		if (this.animation && this.animation.isAlive) {
			this.animation.stop();
		}

		const viewPort = this.api.getViewPort();
		const startPosition = viewPort.position;
		const startScale = viewPort.scale;
		const deltaPosition = startPosition.subtract(target.position);
		const deltaScale = startScale - target.scale;

		this.animation = animate(150, progress => {
			const newScale = startScale - deltaScale * progress;
			this.api.setViewPort({
				position: startPosition.subtract(deltaPosition.multiplyByScalar(progress)),
				scale: newScale
			});
		});
	}
}

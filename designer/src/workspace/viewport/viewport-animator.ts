import { WorkspaceApi } from '../../api';
import { animate, Animation } from '../../core/animation';
import { Viewport } from '../../designer-extension';

export class ViewportAnimator {
	private animation?: Animation;

	public constructor(private readonly api: WorkspaceApi) {}

	public execute(target: Viewport) {
		if (this.animation && this.animation.isAlive) {
			this.animation.stop();
		}

		const viewport = this.api.getViewport();
		const startPosition = viewport.position;
		const startScale = viewport.scale;
		const deltaPosition = startPosition.subtract(target.position);
		const deltaScale = startScale - target.scale;

		this.animation = animate(150, progress => {
			const newScale = startScale - deltaScale * progress;
			this.api.setViewport({
				position: startPosition.subtract(deltaPosition.multiplyByScalar(progress)),
				scale: newScale
			});
		});
	}
}

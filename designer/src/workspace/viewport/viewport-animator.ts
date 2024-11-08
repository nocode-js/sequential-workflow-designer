import { animate, Animation } from '../../core/animation';
import { Viewport } from '../../designer-extension';
import { DesignerState } from '../../designer-state';

export class ViewportAnimator {
	private animation?: Animation;

	public constructor(private readonly state: DesignerState) {}

	public execute(target: Viewport) {
		if (this.animation && this.animation.isAlive) {
			this.animation.stop();
		}

		const startPosition = this.state.viewport.position;
		const startScale = this.state.viewport.scale;
		const deltaPosition = startPosition.subtract(target.position);
		const deltaScale = startScale - target.scale;

		this.animation = animate(150, progress => {
			const newScale = startScale - deltaScale * progress;
			this.state.setViewport({
				position: startPosition.subtract(deltaPosition.multiplyByScalar(progress)),
				scale: newScale
			});
		});
	}
}

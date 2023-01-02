import { animate, Animation } from '../core/animation';
import { Vector } from '../core/vector';
import { DesignerState } from '../designer-state';

export class ViewPortAnimator {
	private animation?: Animation;

	public constructor(private readonly state: DesignerState) {}

	public execute(position: Vector, scale: number) {
		if (this.animation && this.animation.isAlive) {
			this.animation.stop();
		}

		const startPosition = this.state.viewPort.position;
		const startScale = this.state.viewPort.scale;
		const deltaPosition = startPosition.subtract(position);
		const deltaScale = startScale - scale;

		this.animation = animate(150, progress => {
			const newScale = startScale - deltaScale * progress;
			this.state.setViewPort({
				position: startPosition.subtract(deltaPosition.multiplyByScalar(progress)),
				scale: newScale
			});
		});
	}
}

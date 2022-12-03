export interface Animation {
	isAlive: boolean;
	stop(): void;
}

export function animate(interval: number, handler: (progress: number) => void): Animation {
	const iv = setInterval(tick, 15);
	const startTime = Date.now();
	const anim: Animation = {
		isAlive: true,
		stop: () => {
			anim.isAlive = false;
			clearInterval(iv);
		}
	};
	function tick() {
		const progress = Math.min((Date.now() - startTime) / interval, 1);
		handler(progress);
		if (progress === 1) {
			anim.stop();
		}
	}
	return anim;
}

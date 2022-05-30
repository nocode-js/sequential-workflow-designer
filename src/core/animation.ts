
export interface Animation {
	isAlive: boolean;
	stop(): void;
}

export function animate(interval: number, tick: (progress: number) => void): Animation {
	let iv: ReturnType<typeof setInterval>;
	const startTime = Date.now();
	const a: Animation = {
		isAlive: true,
		stop: () => {
			a.isAlive = false;
			clearInterval(iv);
		}
	};
	iv = setInterval(() => {
		const progress = Math.min((Date.now() - startTime) / interval, 1);
		tick(progress);
		if (progress === 1) {
			a.stop();
		}
	}, 15);
	return a;
}

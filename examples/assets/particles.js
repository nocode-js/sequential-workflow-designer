/* global window, screen, document, console, requestAnimationFrame, StateMachine, StateMachineSteps, sequentialWorkflowDesigner */

class Renderer {
	static create(width, height, context, particles) {
		const renderer = new Renderer(width, height, context, particles);

		let lastTime = 0;
		function tick() {
			const now = Date.now();
			const dt = Math.min((now - lastTime) / 1000, 0.04);
			lastTime = now;

			particles.forEach(p => p.tick(dt));
			renderer.draw();
			requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
		return renderer;
	}

	constructor(width, height, context, particles) {
		this.width = width;
		this.height = height;
		this.context = context;
		this.particles = particles;
	}

	draw() {
		this.context.clearRect(0, 0, this.width, this.height);
		const r = 30;
		for (const p of this.particles) {
			p.x = (p.x + this.width) % this.width;
			p.y = (p.y + this.height) % this.height;

			const gradient = this.context.createLinearGradient(p.x, p.y - r / 2, p.x, p.y + r / 2);
			gradient.addColorStop(0, p.colorA);
			gradient.addColorStop(1, p.colorB);

			this.context.beginPath();
			this.context.arc(p.x, p.y, r, 0, 2 * Math.PI, false);
			this.context.fillStyle = gradient;
			this.context.fill();
			this.context.beginPath();
			this.context.moveTo(p.x, p.y);
			this.context.lineWidth = 3;
			this.context.lineTo(p.x + Math.cos(p.rotation) * r, p.y + Math.sin(p.rotation) * r);
			this.context.stroke();
		}
	}
}

class Particle {
	constructor(x, y, colorA, colorB, definition) {
		this.colorA = colorA;
		this.colorB = colorB;
		this.x = x;
		this.y = y;
		this.rotation = 0;
		this.targetRotation = 0;
		this.definition = definition;
		this.reset();
	}

	reset() {
		this.velocityX = 0;
		this.velocityY = 0;
		this.rotation = this.targetRotation;
		this.angularVelocity = 0;
	}

	tick(dt) {
		this.x += this.velocityX * dt;
		this.y += this.velocityY * dt;
		this.rotation = (this.rotation + this.angularVelocity * dt) % (Math.PI * 2);
	}

	executeMoveStep(step) {
		const speed = step.properties['speed'];
		this.velocityX = speed * Math.cos(this.rotation);
		this.velocityY = speed * Math.sin(this.rotation);
	}

	executeRotateStep(step) {
		const interval = this.definition.properties['interval'];
		const angle = step.properties['angle'] * (Math.PI / 180);
		this.targetRotation = this.rotation + angle;
		this.angularVelocity = angle / (interval / 1000);
	}

	run() {
		const interval = this.definition.properties['interval'];
		this.sm = new StateMachine(this.definition, interval, {
			beforeStepExecution: () => {
				this.reset();
			},

			executeStep: step => {
				switch (step.type) {
					case 'move':
						this.executeMoveStep(step);
						break;
					case 'rotate':
						this.executeRotateStep(step);
						break;
					case 'wait':
						break;
				}
			},

			executeIf: () => {
				throw new Error('Not implemented');
			},

			initLoopStep: () => {
				throw new Error('Not implemented');
			},

			canReplyLoopStep: () => {
				throw new Error('Not implemented');
			},

			onFinished: () => {
				this.reset();
				this.sm.start();
			},

			onInterrupted: () => {
				console.log('interrupted ' + this.colorA);
			}
		});
		this.sm.start();
	}

	setDefinition(definition) {
		this.definition = definition;
		this.sm.interrupt();
		this.reset();
		this.run();
	}
}

function createEditor(titleText, properties) {
	const root = document.createElement('div');
	const title = document.createElement('h3');
	title.innerText = titleText;
	root.appendChild(title);

	for (let propName of Object.keys(properties)) {
		const item = document.createElement('p');
		item.innerHTML = '<div><label></label> <input type="number" /></div>';
		item.querySelector('label').innerText = propName;
		const input = item.querySelector('input');
		input.value = properties[propName];
		input.addEventListener('input', () => {
			properties[propName] = parseInt(input.value, 10);
		});
		root.appendChild(item);
	}
	return root;
}

class Steps {
	static createMove(speed, name) {
		return StateMachineSteps.createTaskStep(name, 'move', { speed });
	}

	static createRotate(angle, name) {
		return StateMachineSteps.createTaskStep(name, 'rotate', { angle });
	}

	static createWait() {
		return StateMachineSteps.createTaskStep('wait', 'wait', {});
	}
}

class Popup {
	static create(particle) {
		const popup = document.getElementById('popup');
		popup.classList.remove('hidden');
		const popupPlaceholder = document.getElementById('popup-placeholder');
		const popupCloseButton = document.getElementById('popup-close');
		popupCloseButton.innerText = 'Save ' + particle.colorA;

		const designer = sequentialWorkflowDesigner.Designer.create(popupPlaceholder, particle.definition, {
			toolbox: {
				groups: [
					{
						name: 'Actions',
						steps: [
							Steps.createMove(100, 'move slow'),
							Steps.createMove(300, 'move fast'),
							Steps.createRotate(-90, 'turn left'),
							Steps.createRotate(90, 'turn right'),
							Steps.createRotate(180, 'turn back'),
							Steps.createWait()
						]
					}
				]
			},
			steps: {
				iconUrlProvider: () => {
					return `./assets/icon-task.svg`;
				}
			},
			editors: {
				rootEditorProvider: definition => {
					return createEditor('Edit start state', definition.properties);
				},
				stepEditorProvider: step => {
					return createEditor('Edit step ' + step.name, step.properties);
				}
			},
			controlBar: true
		});

		popupCloseButton.addEventListener('click', () => {
			const newDefinition = designer.getDefinition();
			if (newDefinition.sequence.length === 0) {
				window.alert('The sequence must have minimum one step.');
				return;
			}
			particle.setDefinition(newDefinition);

			popup.classList.add('hidden');
			designer.destroy();
		});
	}
}

class ControlPanel {
	static create(particles) {
		const placeholder = document.getElementById('control-panel');
		for (const p of particles) {
			const button = document.createElement('button');
			button.innerText = 'Edit ' + p.colorA;
			button.addEventListener('click', () => Popup.create(p));
			placeholder.appendChild(button);
		}
	}
}

window.addEventListener('load', () => {
	const width = Math.min(600, screen.width);
	const height = Math.min(600, screen.height);

	const canvas = document.getElementById('canvas');
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext('2d');

	const redDefinition = {
		sequence: [Steps.createMove(100, 'move slow'), Steps.createRotate(90, 'turn right')],
		properties: {
			interval: 400
		}
	};

	const blueDefinition = {
		sequence: [Steps.createWait()],
		properties: {
			interval: 400
		}
	};

	const greenDefinition = {
		sequence: [Steps.createWait()],
		properties: {
			interval: 400
		}
	};

	const red = new Particle(width * 0.2, height * 0.2, 'red', '#FF5827', redDefinition);
	const green = new Particle(width * 0.5, height * 0.5, 'green', '#00A77E', blueDefinition);
	const blue = new Particle(width * 0.8, height * 0.8, 'blue', '#1A7EFF', greenDefinition);
	const particles = [red, green, blue];

	particles.forEach(p => p.run());

	Renderer.create(canvas.width, canvas.height, context, particles);
	ControlPanel.create(particles);
});

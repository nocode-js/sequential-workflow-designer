import {
	AfterViewInit,
	ApplicationRef,
	Component,
	ElementRef,
	EmbeddedViewRef,
	EventEmitter,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	TemplateRef,
	ViewChild
} from '@angular/core';
import {
	Definition,
	Designer,
	DesignerExtension,
	GlobalEditorContext,
	Step,
	StepEditorContext,
	StepsConfiguration,
	ToolboxConfiguration,
	ValidatorConfiguration
} from 'sequential-workflow-designer';

export interface GlobalEditorWrapper {
	definition: Definition;
	context: GlobalEditorContext;
}

export interface StepEditorWrapper {
	step: Step;
	definition: Definition;
	context: StepEditorContext;
}

export type AngularToolboxConfiguration = Omit<ToolboxConfiguration, 'isCollapsed'>;

@Component({
	selector: 'sqd-designer',
	templateUrl: './designer.component.html'
})
export class DesignerComponent implements AfterViewInit, OnChanges, OnDestroy {
	private designer?: Designer;
	private lastEmbeddedView?: EmbeddedViewRef<unknown>;

	@ViewChild('placeholder', { static: true })
	private placeholder?: ElementRef<HTMLElement>;

	@Input('theme')
	public theme?: string;
	@Input('undoStackSize')
	public undoStackSize?: number;
	@Input('definition')
	public definition?: Definition;
	@Input('stepsConfiguration')
	public stepsConfiguration?: StepsConfiguration;
	@Input('validatorConfiguration')
	public validatorConfiguration?: ValidatorConfiguration;
	@Input('toolboxConfiguration')
	public toolboxConfiguration?: AngularToolboxConfiguration | false;
	@Input('controlBar')
	public controlBar?: boolean;
	@Input('extensions')
	public extensions?: DesignerExtension[];
	@Input('areEditorsHidden')
	public areEditorsHidden?: boolean;
	@Input('globalEditor')
	public globalEditor?: TemplateRef<unknown>;
	@Input('stepEditor')
	public stepEditor?: TemplateRef<unknown>;

	@Output()
	public readonly onReady = new EventEmitter<Designer>();
	@Output()
	public readonly onDefinitionChanged = new EventEmitter<Definition>();

	public constructor(private readonly ngZone: NgZone, private readonly applicationRef: ApplicationRef) {}

	public ngAfterViewInit() {
		this.attach();
	}

	public ngOnChanges(changes: SimpleChanges) {
		const isFirstChange = Object.keys(changes).every(key => changes[key].firstChange);
		if (isFirstChange) {
			return;
		}
		if (this.designer && changes['definition'] && changes['definition'].currentValue === this.designer.getDefinition()) {
			// The same reference = no change.
			return;
		}

		this.attach();
	}

	public ngOnDestroy(): void {
		if (this.lastEmbeddedView) {
			this.applicationRef.detachView(this.lastEmbeddedView);
			this.lastEmbeddedView.destroy();
		}
	}

	private attach() {
		this.ngZone.runOutsideAngular(() => {
			if (!this.placeholder) {
				return;
			}
			if (!this.definition) {
				throw new Error('Input "definition" is not set');
			}
			if (!this.stepsConfiguration) {
				throw new Error('Input "stepsConfiguration" is not set');
			}
			if (this.toolboxConfiguration === undefined) {
				throw new Error('Input "toolboxConfiguration" is not set');
			}
			if (this.controlBar === undefined) {
				throw new Error('Input "controlBar" is not set');
			}

			if (this.designer) {
				this.designer.destroy();
				this.designer = undefined;
			}

			const designer = Designer.create(this.placeholder.nativeElement, this.definition, {
				theme: this.theme,
				undoStackSize: this.undoStackSize,
				editors: this.areEditorsHidden
					? false
					: {
							globalEditorProvider: this.globalEditorProvider,
							stepEditorProvider: this.stepEditorProvider
					  },
				steps: this.stepsConfiguration,
				validator: this.validatorConfiguration,
				toolbox: this.toolboxConfiguration,
				controlBar: this.controlBar,
				extensions: this.extensions
			});
			designer.onReady.subscribe(() => {
				this.ngZone.run(() => {
					this.onReady.emit(designer);
				});
			});
			designer.onDefinitionChanged.subscribe(() => {
				this.ngZone.run(() => {
					this.onDefinitionChanged.emit(designer.getDefinition());
				});
			});
			this.designer = designer;
		});
	}

	private readonly globalEditorProvider = (definition: Definition, context: GlobalEditorContext) => {
		if (!this.globalEditor) {
			throw new Error('Input "globalEditor" is not set');
		}
		return this.editorProvider<GlobalEditorWrapper>(this.globalEditor, {
			definition,
			context
		});
	};

	private readonly stepEditorProvider = (step: Step, context: StepEditorContext, definition: Definition) => {
		if (!this.stepEditor) {
			throw new Error('Input "stepEditor" is not set');
		}
		return this.editorProvider<StepEditorWrapper>(this.stepEditor, {
			step,
			definition,
			context
		});
	};

	private editorProvider<E>(templateRef: TemplateRef<unknown>, editor: E) {
		return this.ngZone.run(() => {
			if (this.lastEmbeddedView) {
				this.applicationRef.detachView(this.lastEmbeddedView);
				this.lastEmbeddedView.destroy();
				this.lastEmbeddedView = undefined;
			}

			this.lastEmbeddedView = templateRef.createEmbeddedView({
				$implicit: editor
			});
			this.applicationRef.attachView(this.lastEmbeddedView);

			const container = document.createElement('div');
			container.className = 'sqd-editor-angular';
			for (const node of this.lastEmbeddedView.rootNodes) {
				container.appendChild(node);
			}
			return container;
		});
	}
}

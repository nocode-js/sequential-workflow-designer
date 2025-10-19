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
	CustomActionHandler,
	Definition,
	Designer,
	DesignerExtension,
	RootEditorContext,
	RootEditorProvider,
	KeyboardConfiguration,
	Step,
	StepEditorContext,
	StepEditorProvider,
	StepsConfiguration,
	ToolboxConfiguration,
	UidGenerator,
	ValidatorConfiguration,
	PlaceholderConfiguration,
	I18n,
	PreferenceStorage
} from 'sequential-workflow-designer';

export interface RootEditorWrapper {
	definition: Definition;
	context: RootEditorContext;
	isReadonly: boolean;
}

export interface StepEditorWrapper {
	step: Step;
	definition: Definition;
	context: StepEditorContext;
	isReadonly: boolean;
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
	@Input('placeholderConfiguration')
	public placeholderConfiguration?: PlaceholderConfiguration;
	@Input('toolboxConfiguration')
	public toolboxConfiguration?: AngularToolboxConfiguration | false;
	@Input('controlBar')
	public controlBar?: boolean;
	@Input('contextMenu')
	public contextMenu?: boolean;
	@Input('keyboard')
	public keyboard?: boolean | KeyboardConfiguration;
	@Input('preferenceStorage')
	public preferenceStorage?: PreferenceStorage;
	@Input('extensions')
	public extensions?: DesignerExtension[];
	@Input('i18n')
	public i18n?: I18n;
	@Input('customActionHandler')
	public customActionHandler?: CustomActionHandler;
	@Input('isReadonly')
	public isReadonly?: boolean;
	@Input('selectedStepId')
	public selectedStepId?: string | null;
	@Input('uidGenerator')
	public uidGenerator?: UidGenerator;
	@Input('isToolboxCollapsed')
	public isToolboxCollapsed?: boolean;
	@Input('isEditorCollapsed')
	public isEditorCollapsed?: boolean;

	@Input('areEditorsHidden')
	public areEditorsHidden?: boolean;
	@Input('rootEditor')
	public rootEditor?: TemplateRef<unknown> | RootEditorProvider;
	@Input('stepEditor')
	public stepEditor?: TemplateRef<unknown> | StepEditorProvider;

	@Output()
	public readonly onReady = new EventEmitter<Designer>();
	@Output()
	public readonly onDefinitionChanged = new EventEmitter<Definition>();
	@Output()
	public readonly onSelectedStepIdChanged = new EventEmitter<string | null>();
	@Output()
	public readonly onStepUnselectionBlocked = new EventEmitter<string | null>();
	@Output()
	public readonly onIsToolboxCollapsedChanged = new EventEmitter<boolean>();
	@Output()
	public readonly onIsEditorCollapsedChanged = new EventEmitter<boolean>();

	public constructor(
		private readonly ngZone: NgZone,
		private readonly applicationRef: ApplicationRef
	) {}

	public ngAfterViewInit() {
		this.attach();
	}

	public ngOnChanges(changes: SimpleChanges) {
		const isFirstChange = Object.keys(changes).every(key => changes[key].firstChange);
		if (isFirstChange) {
			return;
		}

		if (this.designer) {
			const isSameDefinition = !changes['definition'] || changes['definition'].currentValue === this.designer.getDefinition();
			if (isSameDefinition) {
				const isReadonlyChange = changes['isReadonly'];
				if (isReadonlyChange && isReadonlyChange.currentValue !== this.designer.isReadonly()) {
					this.designer.setIsReadonly(isReadonlyChange.currentValue);
				}

				const selectedStepIdChange = changes['selectedStepId'];
				if (selectedStepIdChange && selectedStepIdChange.currentValue !== this.designer.getSelectedStepId()) {
					if (selectedStepIdChange.currentValue) {
						this.designer.selectStepById(selectedStepIdChange.currentValue);
					} else {
						this.designer.clearSelectedStep();
					}
				}

				const isToolboxCollapsedChange = changes['isToolboxCollapsed'];
				if (isToolboxCollapsedChange && isToolboxCollapsedChange.currentValue !== this.designer.isToolboxCollapsed()) {
					this.designer.setIsToolboxCollapsed(isToolboxCollapsedChange.currentValue);
				}

				const isEditorCollapsedChange = changes['isEditorCollapsed'];
				if (isEditorCollapsedChange && isEditorCollapsedChange.currentValue !== this.designer.isEditorCollapsed()) {
					this.designer.setIsEditorCollapsed(isEditorCollapsedChange.currentValue);
				}

				// The same reference of the definition = no change.
				return;
			}
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

			let customActionHandler = this.customActionHandler;
			if (customActionHandler) {
				const cah = customActionHandler;
				customActionHandler = (action, step, sequence, context) => {
					this.ngZone.run(() => cah(action, step, sequence, context));
				};
			}

			const designer = Designer.create(this.placeholder.nativeElement, this.definition, {
				theme: this.theme,
				undoStackSize: this.undoStackSize,
				editors: this.areEditorsHidden
					? false
					: {
							isCollapsed: this.isEditorCollapsed,
							rootEditorProvider: this.rootEditorProvider,
							stepEditorProvider: this.stepEditorProvider
						},
				steps: this.stepsConfiguration,
				validator: this.validatorConfiguration,
				placeholder: this.placeholderConfiguration,
				toolbox: this.toolboxConfiguration
					? {
							isCollapsed: this.isToolboxCollapsed,
							...this.toolboxConfiguration
						}
					: false,
				controlBar: this.controlBar,
				contextMenu: this.contextMenu,
				keyboard: this.keyboard,
				preferenceStorage: this.preferenceStorage,
				extensions: this.extensions,
				isReadonly: this.isReadonly,
				i18n: this.i18n,
				uidGenerator: this.uidGenerator,
				customActionHandler
			});
			designer.onReady.subscribe(() => {
				this.ngZone.run(() => this.onReady.emit(designer));
			});
			designer.onDefinitionChanged.subscribe(definition => {
				this.ngZone.run(() => this.onDefinitionChanged.emit(definition));
			});
			designer.onSelectedStepIdChanged.subscribe(stepId => {
				this.ngZone.run(() => this.onSelectedStepIdChanged.emit(stepId));
			});
			designer.onStepUnselectionBlocked.subscribe(targetStepId => {
				this.ngZone.run(() => this.onStepUnselectionBlocked.emit(targetStepId));
			});
			designer.onIsToolboxCollapsedChanged.subscribe(isCollapsed => {
				this.ngZone.run(() => this.onIsToolboxCollapsedChanged.emit(isCollapsed));
			});
			designer.onIsEditorCollapsedChanged.subscribe(isCollapsed => {
				this.ngZone.run(() => this.onIsEditorCollapsedChanged.emit(isCollapsed));
			});
			this.designer = designer;

			if (this.selectedStepId) {
				this.designer.selectStepById(this.selectedStepId);
			}
		});
	}

	private readonly rootEditorProvider = (definition: Definition, context: RootEditorContext, isReadonly: boolean) => {
		if (!this.rootEditor) {
			throw new Error('Input "rootEditor" is not set');
		}
		if (typeof this.rootEditor === 'function') {
			return this.rootEditor(definition, context, isReadonly);
		}
		return this.editorProvider<RootEditorWrapper>(this.rootEditor, {
			definition,
			context,
			isReadonly
		});
	};

	private readonly stepEditorProvider = (step: Step, context: StepEditorContext, definition: Definition, isReadonly: boolean) => {
		if (!this.stepEditor) {
			throw new Error('Input "stepEditor" is not set');
		}
		if (typeof this.stepEditor === 'function') {
			return this.stepEditor(step, context, definition, isReadonly);
		}
		return this.editorProvider<StepEditorWrapper>(this.stepEditor, {
			step,
			context,
			definition,
			isReadonly
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

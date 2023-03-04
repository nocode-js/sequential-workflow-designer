import { TestBed } from '@angular/core/testing';
import { SequentialWorkflowDesignerModule } from 'sequential-workflow-designer-angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AppComponent],
			imports: [SequentialWorkflowDesignerModule]
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});

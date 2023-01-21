import { TestBed } from '@angular/core/testing';
import { DesignerComponent } from './designer.component';

describe('DesignerComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DesignerComponent]
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(DesignerComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});

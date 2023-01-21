import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DesignerComponent } from './designer.component';

@NgModule({
	declarations: [DesignerComponent],
	imports: [CommonModule],
	exports: [DesignerComponent]
})
export class SequentialWorkflowDesignerModule {}

import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SourcePriorityComponent } from './list/source-priority.component';
import { SourcePriorityDetailComponent } from './detail/source-priority-detail.component';
import { SourcePriorityUpdateComponent } from './update/source-priority-update.component';
import { SourcePriorityDeleteDialogComponent } from './delete/source-priority-delete-dialog.component';
import { SourcePriorityRoutingModule } from './route/source-priority-routing.module';

@NgModule({
  imports: [SharedModule, SourcePriorityRoutingModule],
  declarations: [
    SourcePriorityComponent,
    SourcePriorityDetailComponent,
    SourcePriorityUpdateComponent,
    SourcePriorityDeleteDialogComponent,
  ],
  entryComponents: [SourcePriorityDeleteDialogComponent],
})
export class SourcePriorityModule {}

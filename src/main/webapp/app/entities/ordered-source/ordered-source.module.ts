import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { OrderedSourceComponent } from './list/ordered-source.component';
import { OrderedSourceDetailComponent } from './detail/ordered-source-detail.component';
import { OrderedSourceUpdateComponent } from './update/ordered-source-update.component';
import { OrderedSourceDeleteDialogComponent } from './delete/ordered-source-delete-dialog.component';
import { OrderedSourceRoutingModule } from './route/ordered-source-routing.module';

@NgModule({
  imports: [SharedModule, OrderedSourceRoutingModule],
  declarations: [OrderedSourceComponent, OrderedSourceDetailComponent, OrderedSourceUpdateComponent, OrderedSourceDeleteDialogComponent],
  entryComponents: [OrderedSourceDeleteDialogComponent],
})
export class OrderedSourceModule {}

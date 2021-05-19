import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { DataServiceComponent } from './list/data-service.component';
import { DataServiceDetailComponent } from './detail/data-service-detail.component';
import { DataServiceUpdateComponent } from './update/data-service-update.component';
import { DataServiceDeleteDialogComponent } from './delete/data-service-delete-dialog.component';
import { DataServiceRoutingModule } from './route/data-service-routing.module';

@NgModule({
  imports: [SharedModule, DataServiceRoutingModule],
  declarations: [DataServiceComponent, DataServiceDetailComponent, DataServiceUpdateComponent, DataServiceDeleteDialogComponent],
  entryComponents: [DataServiceDeleteDialogComponent],
})
export class DataServiceModule {}

import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BusinessObjectComponent } from './list/business-object.component';
import { BusinessObjectDetailComponent } from './detail/business-object-detail.component';
import { BusinessObjectUpdateComponent } from './update/business-object-update.component';
import { BusinessObjectDeleteDialogComponent } from './delete/business-object-delete-dialog.component';
import { BusinessObjectRoutingModule } from './route/business-object-routing.module';

@NgModule({
  imports: [SharedModule, BusinessObjectRoutingModule],
  declarations: [
    BusinessObjectComponent,
    BusinessObjectDetailComponent,
    BusinessObjectUpdateComponent,
    BusinessObjectDeleteDialogComponent,
  ],
  entryComponents: [BusinessObjectDeleteDialogComponent],
})
export class BusinessObjectModule {}

import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { DataRoleComponent } from './list/data-role.component';
import { DataRoleDetailComponent } from './detail/data-role-detail.component';
import { DataRoleUpdateComponent } from './update/data-role-update.component';
import { DataRoleDeleteDialogComponent } from './delete/data-role-delete-dialog.component';
import { DataRoleRoutingModule } from './route/data-role-routing.module';

@NgModule({
  imports: [SharedModule, DataRoleRoutingModule],
  declarations: [DataRoleComponent, DataRoleDetailComponent, DataRoleUpdateComponent, DataRoleDeleteDialogComponent],
  entryComponents: [DataRoleDeleteDialogComponent],
})
export class DataRoleModule {}

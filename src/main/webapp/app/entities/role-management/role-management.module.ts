import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { RoleManagementComponent } from './list/role-management.component';
import { RoleManagementDetailComponent } from './detail/role-management-detail.component';
import { RoleManagementUpdateComponent } from './update/role-management-update.component';
import { RoleManagementDeleteDialogComponent } from './delete/role-management-delete-dialog.component';
import { RoleManagementRoutingModule } from './route/role-management-routing.module';

@NgModule({
  imports: [SharedModule, RoleManagementRoutingModule],
  declarations: [
    RoleManagementComponent,
    RoleManagementDetailComponent,
    RoleManagementUpdateComponent,
    RoleManagementDeleteDialogComponent,
  ],
  entryComponents: [RoleManagementDeleteDialogComponent],
})
export class RoleManagementModule {}

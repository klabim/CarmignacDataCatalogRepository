import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RoleManagementComponent } from '../list/role-management.component';
import { RoleManagementDetailComponent } from '../detail/role-management-detail.component';
import { RoleManagementUpdateComponent } from '../update/role-management-update.component';
import { RoleManagementRoutingResolveService } from './role-management-routing-resolve.service';

const roleManagementRoute: Routes = [
  {
    path: '',
    component: RoleManagementComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoleManagementDetailComponent,
    resolve: {
      roleManagement: RoleManagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoleManagementUpdateComponent,
    resolve: {
      roleManagement: RoleManagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoleManagementUpdateComponent,
    resolve: {
      roleManagement: RoleManagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(roleManagementRoute)],
  exports: [RouterModule],
})
export class RoleManagementRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DataRoleComponent } from '../list/data-role.component';
import { DataRoleDetailComponent } from '../detail/data-role-detail.component';
import { DataRoleUpdateComponent } from '../update/data-role-update.component';
import { DataRoleRoutingResolveService } from './data-role-routing-resolve.service';

const dataRoleRoute: Routes = [
  {
    path: '',
    component: DataRoleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DataRoleDetailComponent,
    resolve: {
      dataRole: DataRoleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DataRoleUpdateComponent,
    resolve: {
      dataRole: DataRoleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DataRoleUpdateComponent,
    resolve: {
      dataRole: DataRoleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dataRoleRoute)],
  exports: [RouterModule],
})
export class DataRoleRoutingModule {}

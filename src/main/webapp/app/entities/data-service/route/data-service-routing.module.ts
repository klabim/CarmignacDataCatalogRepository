import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DataServiceComponent } from '../list/data-service.component';
import { DataServiceDetailComponent } from '../detail/data-service-detail.component';
import { DataServiceUpdateComponent } from '../update/data-service-update.component';
import { DataServiceRoutingResolveService } from './data-service-routing-resolve.service';

const dataServiceRoute: Routes = [
  {
    path: '',
    component: DataServiceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DataServiceDetailComponent,
    resolve: {
      dataService: DataServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DataServiceUpdateComponent,
    resolve: {
      dataService: DataServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DataServiceUpdateComponent,
    resolve: {
      dataService: DataServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dataServiceRoute)],
  exports: [RouterModule],
})
export class DataServiceRoutingModule {}

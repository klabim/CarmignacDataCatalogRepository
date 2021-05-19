import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BusinessObjectComponent } from '../list/business-object.component';
import { BusinessObjectDetailComponent } from '../detail/business-object-detail.component';
import { BusinessObjectUpdateComponent } from '../update/business-object-update.component';
import { BusinessObjectRoutingResolveService } from './business-object-routing-resolve.service';

const businessObjectRoute: Routes = [
  {
    path: '',
    component: BusinessObjectComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BusinessObjectDetailComponent,
    resolve: {
      businessObject: BusinessObjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BusinessObjectUpdateComponent,
    resolve: {
      businessObject: BusinessObjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BusinessObjectUpdateComponent,
    resolve: {
      businessObject: BusinessObjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(businessObjectRoute)],
  exports: [RouterModule],
})
export class BusinessObjectRoutingModule {}

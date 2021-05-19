import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrderedSourceComponent } from '../list/ordered-source.component';
import { OrderedSourceDetailComponent } from '../detail/ordered-source-detail.component';
import { OrderedSourceUpdateComponent } from '../update/ordered-source-update.component';
import { OrderedSourceRoutingResolveService } from './ordered-source-routing-resolve.service';

const orderedSourceRoute: Routes = [
  {
    path: '',
    component: OrderedSourceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderedSourceDetailComponent,
    resolve: {
      orderedSource: OrderedSourceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderedSourceUpdateComponent,
    resolve: {
      orderedSource: OrderedSourceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderedSourceUpdateComponent,
    resolve: {
      orderedSource: OrderedSourceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(orderedSourceRoute)],
  exports: [RouterModule],
})
export class OrderedSourceRoutingModule {}

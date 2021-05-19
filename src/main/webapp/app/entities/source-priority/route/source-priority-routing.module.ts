import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SourcePriorityComponent } from '../list/source-priority.component';
import { SourcePriorityDetailComponent } from '../detail/source-priority-detail.component';
import { SourcePriorityUpdateComponent } from '../update/source-priority-update.component';
import { SourcePriorityRoutingResolveService } from './source-priority-routing-resolve.service';

const sourcePriorityRoute: Routes = [
  {
    path: '',
    component: SourcePriorityComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SourcePriorityDetailComponent,
    resolve: {
      sourcePriority: SourcePriorityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SourcePriorityUpdateComponent,
    resolve: {
      sourcePriority: SourcePriorityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SourcePriorityUpdateComponent,
    resolve: {
      sourcePriority: SourcePriorityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sourcePriorityRoute)],
  exports: [RouterModule],
})
export class SourcePriorityRoutingModule {}

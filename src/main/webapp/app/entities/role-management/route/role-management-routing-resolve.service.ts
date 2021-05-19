import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRoleManagement, RoleManagement } from '../role-management.model';
import { RoleManagementService } from '../service/role-management.service';

@Injectable({ providedIn: 'root' })
export class RoleManagementRoutingResolveService implements Resolve<IRoleManagement> {
  constructor(protected service: RoleManagementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRoleManagement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((roleManagement: HttpResponse<RoleManagement>) => {
          if (roleManagement.body) {
            return of(roleManagement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RoleManagement());
  }
}

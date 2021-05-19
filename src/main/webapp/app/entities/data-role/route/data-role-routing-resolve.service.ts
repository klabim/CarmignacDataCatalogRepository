import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDataRole, DataRole } from '../data-role.model';
import { DataRoleService } from '../service/data-role.service';

@Injectable({ providedIn: 'root' })
export class DataRoleRoutingResolveService implements Resolve<IDataRole> {
  constructor(protected service: DataRoleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDataRole> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((dataRole: HttpResponse<DataRole>) => {
          if (dataRole.body) {
            return of(dataRole.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DataRole());
  }
}

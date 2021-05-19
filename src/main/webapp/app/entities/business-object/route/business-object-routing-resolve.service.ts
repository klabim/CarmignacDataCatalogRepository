import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBusinessObject, BusinessObject } from '../business-object.model';
import { BusinessObjectService } from '../service/business-object.service';

@Injectable({ providedIn: 'root' })
export class BusinessObjectRoutingResolveService implements Resolve<IBusinessObject> {
  constructor(protected service: BusinessObjectService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBusinessObject> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((businessObject: HttpResponse<BusinessObject>) => {
          if (businessObject.body) {
            return of(businessObject.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BusinessObject());
  }
}

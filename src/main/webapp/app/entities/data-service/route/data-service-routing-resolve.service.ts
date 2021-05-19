import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDataService, DataService } from '../data-service.model';
import { DataServiceService } from '../service/data-service.service';

@Injectable({ providedIn: 'root' })
export class DataServiceRoutingResolveService implements Resolve<IDataService> {
  constructor(protected service: DataServiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDataService> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((dataService: HttpResponse<DataService>) => {
          if (dataService.body) {
            return of(dataService.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DataService());
  }
}

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrderedSource, OrderedSource } from '../ordered-source.model';
import { OrderedSourceService } from '../service/ordered-source.service';

@Injectable({ providedIn: 'root' })
export class OrderedSourceRoutingResolveService implements Resolve<IOrderedSource> {
  constructor(protected service: OrderedSourceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrderedSource> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((orderedSource: HttpResponse<OrderedSource>) => {
          if (orderedSource.body) {
            return of(orderedSource.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrderedSource());
  }
}

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISourcePriority, SourcePriority } from '../source-priority.model';
import { SourcePriorityService } from '../service/source-priority.service';

@Injectable({ providedIn: 'root' })
export class SourcePriorityRoutingResolveService implements Resolve<ISourcePriority> {
  constructor(protected service: SourcePriorityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISourcePriority> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sourcePriority: HttpResponse<SourcePriority>) => {
          if (sourcePriority.body) {
            return of(sourcePriority.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SourcePriority());
  }
}

jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISourcePriority, SourcePriority } from '../source-priority.model';
import { SourcePriorityService } from '../service/source-priority.service';

import { SourcePriorityRoutingResolveService } from './source-priority-routing-resolve.service';

describe('Service Tests', () => {
  describe('SourcePriority routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SourcePriorityRoutingResolveService;
    let service: SourcePriorityService;
    let resultSourcePriority: ISourcePriority | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SourcePriorityRoutingResolveService);
      service = TestBed.inject(SourcePriorityService);
      resultSourcePriority = undefined;
    });

    describe('resolve', () => {
      it('should return ISourcePriority returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSourcePriority = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSourcePriority).toEqual({ id: 123 });
      });

      it('should return new ISourcePriority if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSourcePriority = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSourcePriority).toEqual(new SourcePriority());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSourcePriority = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSourcePriority).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

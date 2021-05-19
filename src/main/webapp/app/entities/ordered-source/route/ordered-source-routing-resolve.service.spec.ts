jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IOrderedSource, OrderedSource } from '../ordered-source.model';
import { OrderedSourceService } from '../service/ordered-source.service';

import { OrderedSourceRoutingResolveService } from './ordered-source-routing-resolve.service';

describe('Service Tests', () => {
  describe('OrderedSource routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: OrderedSourceRoutingResolveService;
    let service: OrderedSourceService;
    let resultOrderedSource: IOrderedSource | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(OrderedSourceRoutingResolveService);
      service = TestBed.inject(OrderedSourceService);
      resultOrderedSource = undefined;
    });

    describe('resolve', () => {
      it('should return IOrderedSource returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOrderedSource = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultOrderedSource).toEqual({ id: 123 });
      });

      it('should return new IOrderedSource if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOrderedSource = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultOrderedSource).toEqual(new OrderedSource());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOrderedSource = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultOrderedSource).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

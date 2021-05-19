jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDataService, DataService } from '../data-service.model';
import { DataServiceService } from '../service/data-service.service';

import { DataServiceRoutingResolveService } from './data-service-routing-resolve.service';

describe('Service Tests', () => {
  describe('DataService routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DataServiceRoutingResolveService;
    let service: DataServiceService;
    let resultDataService: IDataService | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DataServiceRoutingResolveService);
      service = TestBed.inject(DataServiceService);
      resultDataService = undefined;
    });

    describe('resolve', () => {
      it('should return IDataService returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDataService = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDataService).toEqual({ id: 123 });
      });

      it('should return new IDataService if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDataService = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDataService).toEqual(new DataService());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDataService = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDataService).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

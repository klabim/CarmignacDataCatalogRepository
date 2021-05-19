jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRoleManagement, RoleManagement } from '../role-management.model';
import { RoleManagementService } from '../service/role-management.service';

import { RoleManagementRoutingResolveService } from './role-management-routing-resolve.service';

describe('Service Tests', () => {
  describe('RoleManagement routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RoleManagementRoutingResolveService;
    let service: RoleManagementService;
    let resultRoleManagement: IRoleManagement | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RoleManagementRoutingResolveService);
      service = TestBed.inject(RoleManagementService);
      resultRoleManagement = undefined;
    });

    describe('resolve', () => {
      it('should return IRoleManagement returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRoleManagement = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRoleManagement).toEqual({ id: 123 });
      });

      it('should return new IRoleManagement if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRoleManagement = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRoleManagement).toEqual(new RoleManagement());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRoleManagement = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRoleManagement).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

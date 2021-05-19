import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IRoleManagement, RoleManagement } from '../role-management.model';

import { RoleManagementService } from './role-management.service';

describe('Service Tests', () => {
  describe('RoleManagement Service', () => {
    let service: RoleManagementService;
    let httpMock: HttpTestingController;
    let elemDefault: IRoleManagement;
    let expectedResult: IRoleManagement | IRoleManagement[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RoleManagementService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        idDataRole: 'AAAAAAA',
        updateDate: currentDate,
        creationDate: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            updateDate: currentDate.format(DATE_FORMAT),
            creationDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a RoleManagement', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            updateDate: currentDate.format(DATE_FORMAT),
            creationDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            updateDate: currentDate,
            creationDate: currentDate,
          },
          returnedFromService
        );

        service.create(new RoleManagement()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a RoleManagement', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idDataRole: 'BBBBBB',
            updateDate: currentDate.format(DATE_FORMAT),
            creationDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            updateDate: currentDate,
            creationDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a RoleManagement', () => {
        const patchObject = Object.assign({}, new RoleManagement());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            updateDate: currentDate,
            creationDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of RoleManagement', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idDataRole: 'BBBBBB',
            updateDate: currentDate.format(DATE_FORMAT),
            creationDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            updateDate: currentDate,
            creationDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a RoleManagement', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRoleManagementToCollectionIfMissing', () => {
        it('should add a RoleManagement to an empty array', () => {
          const roleManagement: IRoleManagement = { id: 123 };
          expectedResult = service.addRoleManagementToCollectionIfMissing([], roleManagement);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(roleManagement);
        });

        it('should not add a RoleManagement to an array that contains it', () => {
          const roleManagement: IRoleManagement = { id: 123 };
          const roleManagementCollection: IRoleManagement[] = [
            {
              ...roleManagement,
            },
            { id: 456 },
          ];
          expectedResult = service.addRoleManagementToCollectionIfMissing(roleManagementCollection, roleManagement);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a RoleManagement to an array that doesn't contain it", () => {
          const roleManagement: IRoleManagement = { id: 123 };
          const roleManagementCollection: IRoleManagement[] = [{ id: 456 }];
          expectedResult = service.addRoleManagementToCollectionIfMissing(roleManagementCollection, roleManagement);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(roleManagement);
        });

        it('should add only unique RoleManagement to an array', () => {
          const roleManagementArray: IRoleManagement[] = [{ id: 123 }, { id: 456 }, { id: 55251 }];
          const roleManagementCollection: IRoleManagement[] = [{ id: 123 }];
          expectedResult = service.addRoleManagementToCollectionIfMissing(roleManagementCollection, ...roleManagementArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const roleManagement: IRoleManagement = { id: 123 };
          const roleManagement2: IRoleManagement = { id: 456 };
          expectedResult = service.addRoleManagementToCollectionIfMissing([], roleManagement, roleManagement2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(roleManagement);
          expect(expectedResult).toContain(roleManagement2);
        });

        it('should accept null and undefined values', () => {
          const roleManagement: IRoleManagement = { id: 123 };
          expectedResult = service.addRoleManagementToCollectionIfMissing([], null, roleManagement, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(roleManagement);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

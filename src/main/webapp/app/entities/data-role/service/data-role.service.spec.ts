import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IDataRole, DataRole } from '../data-role.model';

import { DataRoleService } from './data-role.service';

describe('Service Tests', () => {
  describe('DataRole Service', () => {
    let service: DataRoleService;
    let httpMock: HttpTestingController;
    let elemDefault: IDataRole;
    let expectedResult: IDataRole | IDataRole[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DataRoleService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        idDataRole: 'AAAAAAA',
        name: 'AAAAAAA',
        description: 'AAAAAAA',
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

      it('should create a DataRole', () => {
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

        service.create(new DataRole()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a DataRole', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idDataRole: 'BBBBBB',
            name: 'BBBBBB',
            description: 'BBBBBB',
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

      it('should partial update a DataRole', () => {
        const patchObject = Object.assign(
          {
            idDataRole: 'BBBBBB',
            name: 'BBBBBB',
            description: 'BBBBBB',
            updateDate: currentDate.format(DATE_FORMAT),
            creationDate: currentDate.format(DATE_FORMAT),
          },
          new DataRole()
        );

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

      it('should return a list of DataRole', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idDataRole: 'BBBBBB',
            name: 'BBBBBB',
            description: 'BBBBBB',
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

      it('should delete a DataRole', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDataRoleToCollectionIfMissing', () => {
        it('should add a DataRole to an empty array', () => {
          const dataRole: IDataRole = { id: 123 };
          expectedResult = service.addDataRoleToCollectionIfMissing([], dataRole);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(dataRole);
        });

        it('should not add a DataRole to an array that contains it', () => {
          const dataRole: IDataRole = { id: 123 };
          const dataRoleCollection: IDataRole[] = [
            {
              ...dataRole,
            },
            { id: 456 },
          ];
          expectedResult = service.addDataRoleToCollectionIfMissing(dataRoleCollection, dataRole);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a DataRole to an array that doesn't contain it", () => {
          const dataRole: IDataRole = { id: 123 };
          const dataRoleCollection: IDataRole[] = [{ id: 456 }];
          expectedResult = service.addDataRoleToCollectionIfMissing(dataRoleCollection, dataRole);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(dataRole);
        });

        it('should add only unique DataRole to an array', () => {
          const dataRoleArray: IDataRole[] = [{ id: 123 }, { id: 456 }, { id: 95986 }];
          const dataRoleCollection: IDataRole[] = [{ id: 123 }];
          expectedResult = service.addDataRoleToCollectionIfMissing(dataRoleCollection, ...dataRoleArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const dataRole: IDataRole = { id: 123 };
          const dataRole2: IDataRole = { id: 456 };
          expectedResult = service.addDataRoleToCollectionIfMissing([], dataRole, dataRole2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(dataRole);
          expect(expectedResult).toContain(dataRole2);
        });

        it('should accept null and undefined values', () => {
          const dataRole: IDataRole = { id: 123 };
          expectedResult = service.addDataRoleToCollectionIfMissing([], null, dataRole, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(dataRole);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

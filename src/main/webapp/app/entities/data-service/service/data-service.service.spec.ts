import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IDataService, DataService } from '../data-service.model';

import { DataServiceService } from './data-service.service';

describe('Service Tests', () => {
  describe('DataService Service', () => {
    let service: DataServiceService;
    let httpMock: HttpTestingController;
    let elemDefault: IDataService;
    let expectedResult: IDataService | IDataService[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DataServiceService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        idService: 'AAAAAAA',
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

      it('should create a DataService', () => {
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

        service.create(new DataService()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a DataService', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idService: 'BBBBBB',
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

      it('should partial update a DataService', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            updateDate: currentDate.format(DATE_FORMAT),
          },
          new DataService()
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

      it('should return a list of DataService', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idService: 'BBBBBB',
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

      it('should delete a DataService', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDataServiceToCollectionIfMissing', () => {
        it('should add a DataService to an empty array', () => {
          const dataService: IDataService = { id: 123 };
          expectedResult = service.addDataServiceToCollectionIfMissing([], dataService);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(dataService);
        });

        it('should not add a DataService to an array that contains it', () => {
          const dataService: IDataService = { id: 123 };
          const dataServiceCollection: IDataService[] = [
            {
              ...dataService,
            },
            { id: 456 },
          ];
          expectedResult = service.addDataServiceToCollectionIfMissing(dataServiceCollection, dataService);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a DataService to an array that doesn't contain it", () => {
          const dataService: IDataService = { id: 123 };
          const dataServiceCollection: IDataService[] = [{ id: 456 }];
          expectedResult = service.addDataServiceToCollectionIfMissing(dataServiceCollection, dataService);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(dataService);
        });

        it('should add only unique DataService to an array', () => {
          const dataServiceArray: IDataService[] = [{ id: 123 }, { id: 456 }, { id: 37431 }];
          const dataServiceCollection: IDataService[] = [{ id: 123 }];
          expectedResult = service.addDataServiceToCollectionIfMissing(dataServiceCollection, ...dataServiceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const dataService: IDataService = { id: 123 };
          const dataService2: IDataService = { id: 456 };
          expectedResult = service.addDataServiceToCollectionIfMissing([], dataService, dataService2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(dataService);
          expect(expectedResult).toContain(dataService2);
        });

        it('should accept null and undefined values', () => {
          const dataService: IDataService = { id: 123 };
          expectedResult = service.addDataServiceToCollectionIfMissing([], null, dataService, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(dataService);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

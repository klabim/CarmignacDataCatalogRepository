import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IOrderedSource, OrderedSource } from '../ordered-source.model';

import { OrderedSourceService } from './ordered-source.service';

describe('Service Tests', () => {
  describe('OrderedSource Service', () => {
    let service: OrderedSourceService;
    let httpMock: HttpTestingController;
    let elemDefault: IOrderedSource;
    let expectedResult: IOrderedSource | IOrderedSource[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(OrderedSourceService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        orderSource: 0,
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

      it('should create a OrderedSource', () => {
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

        service.create(new OrderedSource()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a OrderedSource', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            orderSource: 1,
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

      it('should partial update a OrderedSource', () => {
        const patchObject = Object.assign({}, new OrderedSource());

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

      it('should return a list of OrderedSource', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            orderSource: 1,
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

      it('should delete a OrderedSource', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addOrderedSourceToCollectionIfMissing', () => {
        it('should add a OrderedSource to an empty array', () => {
          const orderedSource: IOrderedSource = { id: 123 };
          expectedResult = service.addOrderedSourceToCollectionIfMissing([], orderedSource);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(orderedSource);
        });

        it('should not add a OrderedSource to an array that contains it', () => {
          const orderedSource: IOrderedSource = { id: 123 };
          const orderedSourceCollection: IOrderedSource[] = [
            {
              ...orderedSource,
            },
            { id: 456 },
          ];
          expectedResult = service.addOrderedSourceToCollectionIfMissing(orderedSourceCollection, orderedSource);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a OrderedSource to an array that doesn't contain it", () => {
          const orderedSource: IOrderedSource = { id: 123 };
          const orderedSourceCollection: IOrderedSource[] = [{ id: 456 }];
          expectedResult = service.addOrderedSourceToCollectionIfMissing(orderedSourceCollection, orderedSource);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(orderedSource);
        });

        it('should add only unique OrderedSource to an array', () => {
          const orderedSourceArray: IOrderedSource[] = [{ id: 123 }, { id: 456 }, { id: 41083 }];
          const orderedSourceCollection: IOrderedSource[] = [{ id: 123 }];
          expectedResult = service.addOrderedSourceToCollectionIfMissing(orderedSourceCollection, ...orderedSourceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const orderedSource: IOrderedSource = { id: 123 };
          const orderedSource2: IOrderedSource = { id: 456 };
          expectedResult = service.addOrderedSourceToCollectionIfMissing([], orderedSource, orderedSource2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(orderedSource);
          expect(expectedResult).toContain(orderedSource2);
        });

        it('should accept null and undefined values', () => {
          const orderedSource: IOrderedSource = { id: 123 };
          expectedResult = service.addOrderedSourceToCollectionIfMissing([], null, orderedSource, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(orderedSource);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

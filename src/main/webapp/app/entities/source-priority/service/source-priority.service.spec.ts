import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ISourcePriority, SourcePriority } from '../source-priority.model';

import { SourcePriorityService } from './source-priority.service';

describe('Service Tests', () => {
  describe('SourcePriority Service', () => {
    let service: SourcePriorityService;
    let httpMock: HttpTestingController;
    let elemDefault: ISourcePriority;
    let expectedResult: ISourcePriority | ISourcePriority[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SourcePriorityService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        idSourcePriority: 'AAAAAAA',
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

      it('should create a SourcePriority', () => {
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

        service.create(new SourcePriority()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SourcePriority', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idSourcePriority: 'BBBBBB',
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

      it('should partial update a SourcePriority', () => {
        const patchObject = Object.assign(
          {
            description: 'BBBBBB',
          },
          new SourcePriority()
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

      it('should return a list of SourcePriority', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idSourcePriority: 'BBBBBB',
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

      it('should delete a SourcePriority', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSourcePriorityToCollectionIfMissing', () => {
        it('should add a SourcePriority to an empty array', () => {
          const sourcePriority: ISourcePriority = { id: 123 };
          expectedResult = service.addSourcePriorityToCollectionIfMissing([], sourcePriority);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sourcePriority);
        });

        it('should not add a SourcePriority to an array that contains it', () => {
          const sourcePriority: ISourcePriority = { id: 123 };
          const sourcePriorityCollection: ISourcePriority[] = [
            {
              ...sourcePriority,
            },
            { id: 456 },
          ];
          expectedResult = service.addSourcePriorityToCollectionIfMissing(sourcePriorityCollection, sourcePriority);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SourcePriority to an array that doesn't contain it", () => {
          const sourcePriority: ISourcePriority = { id: 123 };
          const sourcePriorityCollection: ISourcePriority[] = [{ id: 456 }];
          expectedResult = service.addSourcePriorityToCollectionIfMissing(sourcePriorityCollection, sourcePriority);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sourcePriority);
        });

        it('should add only unique SourcePriority to an array', () => {
          const sourcePriorityArray: ISourcePriority[] = [{ id: 123 }, { id: 456 }, { id: 11150 }];
          const sourcePriorityCollection: ISourcePriority[] = [{ id: 123 }];
          expectedResult = service.addSourcePriorityToCollectionIfMissing(sourcePriorityCollection, ...sourcePriorityArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const sourcePriority: ISourcePriority = { id: 123 };
          const sourcePriority2: ISourcePriority = { id: 456 };
          expectedResult = service.addSourcePriorityToCollectionIfMissing([], sourcePriority, sourcePriority2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sourcePriority);
          expect(expectedResult).toContain(sourcePriority2);
        });

        it('should accept null and undefined values', () => {
          const sourcePriority: ISourcePriority = { id: 123 };
          expectedResult = service.addSourcePriorityToCollectionIfMissing([], null, sourcePriority, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sourcePriority);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

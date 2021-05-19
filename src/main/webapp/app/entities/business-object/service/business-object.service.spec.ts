import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBusinessObject, BusinessObject } from '../business-object.model';

import { BusinessObjectService } from './business-object.service';

describe('Service Tests', () => {
  describe('BusinessObject Service', () => {
    let service: BusinessObjectService;
    let httpMock: HttpTestingController;
    let elemDefault: IBusinessObject;
    let expectedResult: IBusinessObject | IBusinessObject[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BusinessObjectService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        idBo: 'AAAAAAA',
        name: 'AAAAAAA',
        definition: 'AAAAAAA',
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

      it('should create a BusinessObject', () => {
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

        service.create(new BusinessObject()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BusinessObject', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idBo: 'BBBBBB',
            name: 'BBBBBB',
            definition: 'BBBBBB',
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

      it('should partial update a BusinessObject', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            definition: 'BBBBBB',
          },
          new BusinessObject()
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

      it('should return a list of BusinessObject', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idBo: 'BBBBBB',
            name: 'BBBBBB',
            definition: 'BBBBBB',
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

      it('should delete a BusinessObject', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBusinessObjectToCollectionIfMissing', () => {
        it('should add a BusinessObject to an empty array', () => {
          const businessObject: IBusinessObject = { id: 123 };
          expectedResult = service.addBusinessObjectToCollectionIfMissing([], businessObject);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(businessObject);
        });

        it('should not add a BusinessObject to an array that contains it', () => {
          const businessObject: IBusinessObject = { id: 123 };
          const businessObjectCollection: IBusinessObject[] = [
            {
              ...businessObject,
            },
            { id: 456 },
          ];
          expectedResult = service.addBusinessObjectToCollectionIfMissing(businessObjectCollection, businessObject);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BusinessObject to an array that doesn't contain it", () => {
          const businessObject: IBusinessObject = { id: 123 };
          const businessObjectCollection: IBusinessObject[] = [{ id: 456 }];
          expectedResult = service.addBusinessObjectToCollectionIfMissing(businessObjectCollection, businessObject);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(businessObject);
        });

        it('should add only unique BusinessObject to an array', () => {
          const businessObjectArray: IBusinessObject[] = [{ id: 123 }, { id: 456 }, { id: 891 }];
          const businessObjectCollection: IBusinessObject[] = [{ id: 123 }];
          expectedResult = service.addBusinessObjectToCollectionIfMissing(businessObjectCollection, ...businessObjectArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const businessObject: IBusinessObject = { id: 123 };
          const businessObject2: IBusinessObject = { id: 456 };
          expectedResult = service.addBusinessObjectToCollectionIfMissing([], businessObject, businessObject2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(businessObject);
          expect(expectedResult).toContain(businessObject2);
        });

        it('should accept null and undefined values', () => {
          const businessObject: IBusinessObject = { id: 123 };
          expectedResult = service.addBusinessObjectToCollectionIfMissing([], null, businessObject, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(businessObject);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

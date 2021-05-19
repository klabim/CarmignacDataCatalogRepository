import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAttribute, Attribute } from '../attribute.model';

import { AttributeService } from './attribute.service';

describe('Service Tests', () => {
  describe('Attribute Service', () => {
    let service: AttributeService;
    let httpMock: HttpTestingController;
    let elemDefault: IAttribute;
    let expectedResult: IAttribute | IAttribute[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AttributeService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        name: 'AAAAAAA',
        internalExternal: 'AAAAAAA',
        cardinality: 'AAAAAAA',
        enumeration: 'AAAAAAA',
        lPattern: 'AAAAAAA',
        longName: 'AAAAAAA',
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

        service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Attribute', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
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

        service.create(new Attribute()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Attribute', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
            internalExternal: 'BBBBBB',
            cardinality: 'BBBBBB',
            enumeration: 'BBBBBB',
            lPattern: 'BBBBBB',
            longName: 'BBBBBB',
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

      it('should partial update a Attribute', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            internalExternal: 'BBBBBB',
            creationDate: currentDate.format(DATE_FORMAT),
          },
          new Attribute()
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

      it('should return a list of Attribute', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
            internalExternal: 'BBBBBB',
            cardinality: 'BBBBBB',
            enumeration: 'BBBBBB',
            lPattern: 'BBBBBB',
            longName: 'BBBBBB',
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

      it('should delete a Attribute', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAttributeToCollectionIfMissing', () => {
        it('should add a Attribute to an empty array', () => {
          const attribute: IAttribute = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addAttributeToCollectionIfMissing([], attribute);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(attribute);
        });

        it('should not add a Attribute to an array that contains it', () => {
          const attribute: IAttribute = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const attributeCollection: IAttribute[] = [
            {
              ...attribute,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, attribute);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Attribute to an array that doesn't contain it", () => {
          const attribute: IAttribute = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const attributeCollection: IAttribute[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, attribute);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(attribute);
        });

        it('should add only unique Attribute to an array', () => {
          const attributeArray: IAttribute[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: 'bbb8247d-4236-4a45-b7d4-55193d1021bf' },
          ];
          const attributeCollection: IAttribute[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addAttributeToCollectionIfMissing(attributeCollection, ...attributeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const attribute: IAttribute = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const attribute2: IAttribute = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addAttributeToCollectionIfMissing([], attribute, attribute2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(attribute);
          expect(expectedResult).toContain(attribute2);
        });

        it('should accept null and undefined values', () => {
          const attribute: IAttribute = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addAttributeToCollectionIfMissing([], null, attribute, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(attribute);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

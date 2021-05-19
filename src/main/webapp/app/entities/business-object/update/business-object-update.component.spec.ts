jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BusinessObjectService } from '../service/business-object.service';
import { IBusinessObject, BusinessObject } from '../business-object.model';
import { IAttribute } from 'app/entities/attribute/attribute.model';
import { AttributeService } from 'app/entities/attribute/service/attribute.service';

import { BusinessObjectUpdateComponent } from './business-object-update.component';

describe('Component Tests', () => {
  describe('BusinessObject Management Update Component', () => {
    let comp: BusinessObjectUpdateComponent;
    let fixture: ComponentFixture<BusinessObjectUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let businessObjectService: BusinessObjectService;
    let attributeService: AttributeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BusinessObjectUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BusinessObjectUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BusinessObjectUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      businessObjectService = TestBed.inject(BusinessObjectService);
      attributeService = TestBed.inject(AttributeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Attribute query and add missing value', () => {
        const businessObject: IBusinessObject = { id: 456 };
        const attributeList: IAttribute = { id: 'd8061744-68bc-422d-87cd-1a543c227259' };
        businessObject.attributeList = attributeList;

        const attributeCollection: IAttribute[] = [{ id: '102eac29-75c5-44be-9d1d-443fb41c3b1b' }];
        spyOn(attributeService, 'query').and.returnValue(of(new HttpResponse({ body: attributeCollection })));
        const additionalAttributes = [attributeList];
        const expectedCollection: IAttribute[] = [...additionalAttributes, ...attributeCollection];
        spyOn(attributeService, 'addAttributeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ businessObject });
        comp.ngOnInit();

        expect(attributeService.query).toHaveBeenCalled();
        expect(attributeService.addAttributeToCollectionIfMissing).toHaveBeenCalledWith(attributeCollection, ...additionalAttributes);
        expect(comp.attributesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const businessObject: IBusinessObject = { id: 456 };
        const attributeList: IAttribute = { id: 'aef15188-06da-4aef-9030-a658a67eebfd' };
        businessObject.attributeList = attributeList;

        activatedRoute.data = of({ businessObject });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(businessObject));
        expect(comp.attributesSharedCollection).toContain(attributeList);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const businessObject = { id: 123 };
        spyOn(businessObjectService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ businessObject });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: businessObject }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(businessObjectService.update).toHaveBeenCalledWith(businessObject);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const businessObject = new BusinessObject();
        spyOn(businessObjectService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ businessObject });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: businessObject }));
        saveSubject.complete();

        // THEN
        expect(businessObjectService.create).toHaveBeenCalledWith(businessObject);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const businessObject = { id: 123 };
        spyOn(businessObjectService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ businessObject });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(businessObjectService.update).toHaveBeenCalledWith(businessObject);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAttributeById', () => {
        it('Should return tracked Attribute primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackAttributeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

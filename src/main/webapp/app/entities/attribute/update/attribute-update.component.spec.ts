jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AttributeService } from '../service/attribute.service';
import { IAttribute, Attribute } from '../attribute.model';
import { ISourcePriority } from 'app/entities/source-priority/source-priority.model';
import { SourcePriorityService } from 'app/entities/source-priority/service/source-priority.service';
import { IBusinessObject } from 'app/entities/business-object/business-object.model';
import { BusinessObjectService } from 'app/entities/business-object/service/business-object.service';

import { AttributeUpdateComponent } from './attribute-update.component';

describe('Component Tests', () => {
  describe('Attribute Management Update Component', () => {
    let comp: AttributeUpdateComponent;
    let fixture: ComponentFixture<AttributeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let attributeService: AttributeService;
    let sourcePriorityService: SourcePriorityService;
    let businessObjectService: BusinessObjectService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AttributeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AttributeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AttributeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      attributeService = TestBed.inject(AttributeService);
      sourcePriorityService = TestBed.inject(SourcePriorityService);
      businessObjectService = TestBed.inject(BusinessObjectService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call goldenSourcePriority query and add missing value', () => {
        const attribute: IAttribute = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const goldenSourcePriority: ISourcePriority = { id: 11143 };
        attribute.goldenSourcePriority = goldenSourcePriority;

        const goldenSourcePriorityCollection: ISourcePriority[] = [{ id: 69892 }];
        spyOn(sourcePriorityService, 'query').and.returnValue(of(new HttpResponse({ body: goldenSourcePriorityCollection })));
        const expectedCollection: ISourcePriority[] = [goldenSourcePriority, ...goldenSourcePriorityCollection];
        spyOn(sourcePriorityService, 'addSourcePriorityToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ attribute });
        comp.ngOnInit();

        expect(sourcePriorityService.query).toHaveBeenCalled();
        expect(sourcePriorityService.addSourcePriorityToCollectionIfMissing).toHaveBeenCalledWith(
          goldenSourcePriorityCollection,
          goldenSourcePriority
        );
        expect(comp.goldenSourcePrioritiesCollection).toEqual(expectedCollection);
      });

      it('Should call linkedType query and add missing value', () => {
        const attribute: IAttribute = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const linkedType: IBusinessObject = { id: 70923 };
        attribute.linkedType = linkedType;

        const linkedTypeCollection: IBusinessObject[] = [{ id: 92476 }];
        spyOn(businessObjectService, 'query').and.returnValue(of(new HttpResponse({ body: linkedTypeCollection })));
        const expectedCollection: IBusinessObject[] = [linkedType, ...linkedTypeCollection];
        spyOn(businessObjectService, 'addBusinessObjectToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ attribute });
        comp.ngOnInit();

        expect(businessObjectService.query).toHaveBeenCalled();
        expect(businessObjectService.addBusinessObjectToCollectionIfMissing).toHaveBeenCalledWith(linkedTypeCollection, linkedType);
        expect(comp.linkedTypesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const attribute: IAttribute = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const goldenSourcePriority: ISourcePriority = { id: 14957 };
        attribute.goldenSourcePriority = goldenSourcePriority;
        const linkedType: IBusinessObject = { id: 13903 };
        attribute.linkedType = linkedType;

        activatedRoute.data = of({ attribute });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(attribute));
        expect(comp.goldenSourcePrioritiesCollection).toContain(goldenSourcePriority);
        expect(comp.linkedTypesCollection).toContain(linkedType);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const attribute = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(attributeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ attribute });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: attribute }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(attributeService.update).toHaveBeenCalledWith(attribute);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const attribute = new Attribute();
        spyOn(attributeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ attribute });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: attribute }));
        saveSubject.complete();

        // THEN
        expect(attributeService.create).toHaveBeenCalledWith(attribute);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const attribute = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(attributeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ attribute });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(attributeService.update).toHaveBeenCalledWith(attribute);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSourcePriorityById', () => {
        it('Should return tracked SourcePriority primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSourcePriorityById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackBusinessObjectById', () => {
        it('Should return tracked BusinessObject primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBusinessObjectById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrderedSourceService } from '../service/ordered-source.service';
import { IOrderedSource, OrderedSource } from '../ordered-source.model';
import { ISource } from 'app/entities/source/source.model';
import { SourceService } from 'app/entities/source/service/source.service';
import { ISourcePriority } from 'app/entities/source-priority/source-priority.model';
import { SourcePriorityService } from 'app/entities/source-priority/service/source-priority.service';

import { OrderedSourceUpdateComponent } from './ordered-source-update.component';

describe('Component Tests', () => {
  describe('OrderedSource Management Update Component', () => {
    let comp: OrderedSourceUpdateComponent;
    let fixture: ComponentFixture<OrderedSourceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let orderedSourceService: OrderedSourceService;
    let sourceService: SourceService;
    let sourcePriorityService: SourcePriorityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrderedSourceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OrderedSourceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderedSourceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      orderedSourceService = TestBed.inject(OrderedSourceService);
      sourceService = TestBed.inject(SourceService);
      sourcePriorityService = TestBed.inject(SourcePriorityService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call type query and add missing value', () => {
        const orderedSource: IOrderedSource = { id: 456 };
        const type: ISource = { id: 51799 };
        orderedSource.type = type;

        const typeCollection: ISource[] = [{ id: 27031 }];
        spyOn(sourceService, 'query').and.returnValue(of(new HttpResponse({ body: typeCollection })));
        const expectedCollection: ISource[] = [type, ...typeCollection];
        spyOn(sourceService, 'addSourceToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ orderedSource });
        comp.ngOnInit();

        expect(sourceService.query).toHaveBeenCalled();
        expect(sourceService.addSourceToCollectionIfMissing).toHaveBeenCalledWith(typeCollection, type);
        expect(comp.typesCollection).toEqual(expectedCollection);
      });

      it('Should call SourcePriority query and add missing value', () => {
        const orderedSource: IOrderedSource = { id: 456 };
        const sourcePriority: ISourcePriority = { id: 40858 };
        orderedSource.sourcePriority = sourcePriority;

        const sourcePriorityCollection: ISourcePriority[] = [{ id: 68147 }];
        spyOn(sourcePriorityService, 'query').and.returnValue(of(new HttpResponse({ body: sourcePriorityCollection })));
        const additionalSourcePriorities = [sourcePriority];
        const expectedCollection: ISourcePriority[] = [...additionalSourcePriorities, ...sourcePriorityCollection];
        spyOn(sourcePriorityService, 'addSourcePriorityToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ orderedSource });
        comp.ngOnInit();

        expect(sourcePriorityService.query).toHaveBeenCalled();
        expect(sourcePriorityService.addSourcePriorityToCollectionIfMissing).toHaveBeenCalledWith(
          sourcePriorityCollection,
          ...additionalSourcePriorities
        );
        expect(comp.sourcePrioritiesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const orderedSource: IOrderedSource = { id: 456 };
        const type: ISource = { id: 7058 };
        orderedSource.type = type;
        const sourcePriority: ISourcePriority = { id: 61505 };
        orderedSource.sourcePriority = sourcePriority;

        activatedRoute.data = of({ orderedSource });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(orderedSource));
        expect(comp.typesCollection).toContain(type);
        expect(comp.sourcePrioritiesSharedCollection).toContain(sourcePriority);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const orderedSource = { id: 123 };
        spyOn(orderedSourceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderedSource });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: orderedSource }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(orderedSourceService.update).toHaveBeenCalledWith(orderedSource);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const orderedSource = new OrderedSource();
        spyOn(orderedSourceService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderedSource });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: orderedSource }));
        saveSubject.complete();

        // THEN
        expect(orderedSourceService.create).toHaveBeenCalledWith(orderedSource);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const orderedSource = { id: 123 };
        spyOn(orderedSourceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderedSource });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(orderedSourceService.update).toHaveBeenCalledWith(orderedSource);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSourceById', () => {
        it('Should return tracked Source primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSourceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackSourcePriorityById', () => {
        it('Should return tracked SourcePriority primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSourcePriorityById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

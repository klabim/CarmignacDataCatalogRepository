jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SourcePriorityService } from '../service/source-priority.service';
import { ISourcePriority, SourcePriority } from '../source-priority.model';

import { SourcePriorityUpdateComponent } from './source-priority-update.component';

describe('Component Tests', () => {
  describe('SourcePriority Management Update Component', () => {
    let comp: SourcePriorityUpdateComponent;
    let fixture: ComponentFixture<SourcePriorityUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let sourcePriorityService: SourcePriorityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SourcePriorityUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SourcePriorityUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SourcePriorityUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      sourcePriorityService = TestBed.inject(SourcePriorityService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const sourcePriority: ISourcePriority = { id: 456 };

        activatedRoute.data = of({ sourcePriority });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(sourcePriority));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sourcePriority = { id: 123 };
        spyOn(sourcePriorityService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sourcePriority });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sourcePriority }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(sourcePriorityService.update).toHaveBeenCalledWith(sourcePriority);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sourcePriority = new SourcePriority();
        spyOn(sourcePriorityService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sourcePriority });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sourcePriority }));
        saveSubject.complete();

        // THEN
        expect(sourcePriorityService.create).toHaveBeenCalledWith(sourcePriority);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sourcePriority = { id: 123 };
        spyOn(sourcePriorityService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sourcePriority });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(sourcePriorityService.update).toHaveBeenCalledWith(sourcePriority);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

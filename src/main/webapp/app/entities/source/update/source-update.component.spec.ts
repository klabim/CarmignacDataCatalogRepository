jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SourceService } from '../service/source.service';
import { ISource, Source } from '../source.model';

import { SourceUpdateComponent } from './source-update.component';

describe('Component Tests', () => {
  describe('Source Management Update Component', () => {
    let comp: SourceUpdateComponent;
    let fixture: ComponentFixture<SourceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let sourceService: SourceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SourceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SourceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SourceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      sourceService = TestBed.inject(SourceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const source: ISource = { id: 456 };

        activatedRoute.data = of({ source });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(source));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const source = { id: 123 };
        spyOn(sourceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ source });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: source }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(sourceService.update).toHaveBeenCalledWith(source);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const source = new Source();
        spyOn(sourceService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ source });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: source }));
        saveSubject.complete();

        // THEN
        expect(sourceService.create).toHaveBeenCalledWith(source);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const source = { id: 123 };
        spyOn(sourceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ source });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(sourceService.update).toHaveBeenCalledWith(source);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

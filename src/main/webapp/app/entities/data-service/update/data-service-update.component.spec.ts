jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DataServiceService } from '../service/data-service.service';
import { IDataService, DataService } from '../data-service.model';

import { DataServiceUpdateComponent } from './data-service-update.component';

describe('Component Tests', () => {
  describe('DataService Management Update Component', () => {
    let comp: DataServiceUpdateComponent;
    let fixture: ComponentFixture<DataServiceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let dataServiceService: DataServiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DataServiceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DataServiceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DataServiceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      dataServiceService = TestBed.inject(DataServiceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const dataService: IDataService = { id: 456 };

        activatedRoute.data = of({ dataService });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(dataService));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const dataService = { id: 123 };
        spyOn(dataServiceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ dataService });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: dataService }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(dataServiceService.update).toHaveBeenCalledWith(dataService);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const dataService = new DataService();
        spyOn(dataServiceService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ dataService });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: dataService }));
        saveSubject.complete();

        // THEN
        expect(dataServiceService.create).toHaveBeenCalledWith(dataService);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const dataService = { id: 123 };
        spyOn(dataServiceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ dataService });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(dataServiceService.update).toHaveBeenCalledWith(dataService);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

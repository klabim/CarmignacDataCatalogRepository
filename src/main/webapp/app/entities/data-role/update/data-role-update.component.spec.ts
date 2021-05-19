jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DataRoleService } from '../service/data-role.service';
import { IDataRole, DataRole } from '../data-role.model';

import { DataRoleUpdateComponent } from './data-role-update.component';

describe('Component Tests', () => {
  describe('DataRole Management Update Component', () => {
    let comp: DataRoleUpdateComponent;
    let fixture: ComponentFixture<DataRoleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let dataRoleService: DataRoleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DataRoleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DataRoleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DataRoleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      dataRoleService = TestBed.inject(DataRoleService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const dataRole: IDataRole = { id: 456 };

        activatedRoute.data = of({ dataRole });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(dataRole));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const dataRole = { id: 123 };
        spyOn(dataRoleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ dataRole });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: dataRole }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(dataRoleService.update).toHaveBeenCalledWith(dataRole);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const dataRole = new DataRole();
        spyOn(dataRoleService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ dataRole });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: dataRole }));
        saveSubject.complete();

        // THEN
        expect(dataRoleService.create).toHaveBeenCalledWith(dataRole);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const dataRole = { id: 123 };
        spyOn(dataRoleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ dataRole });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(dataRoleService.update).toHaveBeenCalledWith(dataRole);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

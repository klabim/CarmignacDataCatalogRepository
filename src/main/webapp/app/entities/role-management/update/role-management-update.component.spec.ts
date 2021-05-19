jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RoleManagementService } from '../service/role-management.service';
import { IRoleManagement, RoleManagement } from '../role-management.model';
import { IAttribute } from 'app/entities/attribute/attribute.model';
import { AttributeService } from 'app/entities/attribute/service/attribute.service';
import { IBusinessObject } from 'app/entities/business-object/business-object.model';
import { BusinessObjectService } from 'app/entities/business-object/service/business-object.service';
import { IDataRole } from 'app/entities/data-role/data-role.model';
import { DataRoleService } from 'app/entities/data-role/service/data-role.service';
import { IDataService } from 'app/entities/data-service/data-service.model';
import { DataServiceService } from 'app/entities/data-service/service/data-service.service';

import { RoleManagementUpdateComponent } from './role-management-update.component';

describe('Component Tests', () => {
  describe('RoleManagement Management Update Component', () => {
    let comp: RoleManagementUpdateComponent;
    let fixture: ComponentFixture<RoleManagementUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let roleManagementService: RoleManagementService;
    let attributeService: AttributeService;
    let businessObjectService: BusinessObjectService;
    let dataRoleService: DataRoleService;
    let dataServiceService: DataServiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RoleManagementUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RoleManagementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RoleManagementUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      roleManagementService = TestBed.inject(RoleManagementService);
      attributeService = TestBed.inject(AttributeService);
      businessObjectService = TestBed.inject(BusinessObjectService);
      dataRoleService = TestBed.inject(DataRoleService);
      dataServiceService = TestBed.inject(DataServiceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call respByException query and add missing value', () => {
        const roleManagement: IRoleManagement = { id: 456 };
        const respByException: IAttribute = { id: 'b7424db5-7b26-44f4-a573-fd4820ee8fd5' };
        roleManagement.respByException = respByException;

        const respByExceptionCollection: IAttribute[] = [{ id: '1e317ab3-fc12-46c4-bc9e-28027016552c' }];
        spyOn(attributeService, 'query').and.returnValue(of(new HttpResponse({ body: respByExceptionCollection })));
        const expectedCollection: IAttribute[] = [respByException, ...respByExceptionCollection];
        spyOn(attributeService, 'addAttributeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ roleManagement });
        comp.ngOnInit();

        expect(attributeService.query).toHaveBeenCalled();
        expect(attributeService.addAttributeToCollectionIfMissing).toHaveBeenCalledWith(respByExceptionCollection, respByException);
        expect(comp.respByExceptionsCollection).toEqual(expectedCollection);
      });

      it('Should call responsible query and add missing value', () => {
        const roleManagement: IRoleManagement = { id: 456 };
        const responsible: IBusinessObject = { id: 8252 };
        roleManagement.responsible = responsible;

        const responsibleCollection: IBusinessObject[] = [{ id: 32500 }];
        spyOn(businessObjectService, 'query').and.returnValue(of(new HttpResponse({ body: responsibleCollection })));
        const expectedCollection: IBusinessObject[] = [responsible, ...responsibleCollection];
        spyOn(businessObjectService, 'addBusinessObjectToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ roleManagement });
        comp.ngOnInit();

        expect(businessObjectService.query).toHaveBeenCalled();
        expect(businessObjectService.addBusinessObjectToCollectionIfMissing).toHaveBeenCalledWith(responsibleCollection, responsible);
        expect(comp.responsiblesCollection).toEqual(expectedCollection);
      });

      it('Should call dataRole query and add missing value', () => {
        const roleManagement: IRoleManagement = { id: 456 };
        const dataRole: IDataRole = { id: 81909 };
        roleManagement.dataRole = dataRole;

        const dataRoleCollection: IDataRole[] = [{ id: 72161 }];
        spyOn(dataRoleService, 'query').and.returnValue(of(new HttpResponse({ body: dataRoleCollection })));
        const expectedCollection: IDataRole[] = [dataRole, ...dataRoleCollection];
        spyOn(dataRoleService, 'addDataRoleToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ roleManagement });
        comp.ngOnInit();

        expect(dataRoleService.query).toHaveBeenCalled();
        expect(dataRoleService.addDataRoleToCollectionIfMissing).toHaveBeenCalledWith(dataRoleCollection, dataRole);
        expect(comp.dataRolesCollection).toEqual(expectedCollection);
      });

      it('Should call dataService query and add missing value', () => {
        const roleManagement: IRoleManagement = { id: 456 };
        const dataService: IDataService = { id: 13105 };
        roleManagement.dataService = dataService;

        const dataServiceCollection: IDataService[] = [{ id: 71807 }];
        spyOn(dataServiceService, 'query').and.returnValue(of(new HttpResponse({ body: dataServiceCollection })));
        const expectedCollection: IDataService[] = [dataService, ...dataServiceCollection];
        spyOn(dataServiceService, 'addDataServiceToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ roleManagement });
        comp.ngOnInit();

        expect(dataServiceService.query).toHaveBeenCalled();
        expect(dataServiceService.addDataServiceToCollectionIfMissing).toHaveBeenCalledWith(dataServiceCollection, dataService);
        expect(comp.dataServicesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const roleManagement: IRoleManagement = { id: 456 };
        const respByException: IAttribute = { id: 'fc168cd0-64bf-4417-9138-cab1b61a5732' };
        roleManagement.respByException = respByException;
        const responsible: IBusinessObject = { id: 4440 };
        roleManagement.responsible = responsible;
        const dataRole: IDataRole = { id: 6848 };
        roleManagement.dataRole = dataRole;
        const dataService: IDataService = { id: 97057 };
        roleManagement.dataService = dataService;

        activatedRoute.data = of({ roleManagement });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(roleManagement));
        expect(comp.respByExceptionsCollection).toContain(respByException);
        expect(comp.responsiblesCollection).toContain(responsible);
        expect(comp.dataRolesCollection).toContain(dataRole);
        expect(comp.dataServicesCollection).toContain(dataService);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const roleManagement = { id: 123 };
        spyOn(roleManagementService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ roleManagement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: roleManagement }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(roleManagementService.update).toHaveBeenCalledWith(roleManagement);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const roleManagement = new RoleManagement();
        spyOn(roleManagementService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ roleManagement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: roleManagement }));
        saveSubject.complete();

        // THEN
        expect(roleManagementService.create).toHaveBeenCalledWith(roleManagement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const roleManagement = { id: 123 };
        spyOn(roleManagementService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ roleManagement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(roleManagementService.update).toHaveBeenCalledWith(roleManagement);
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

      describe('trackBusinessObjectById', () => {
        it('Should return tracked BusinessObject primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBusinessObjectById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackDataRoleById', () => {
        it('Should return tracked DataRole primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDataRoleById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackDataServiceById', () => {
        it('Should return tracked DataService primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDataServiceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

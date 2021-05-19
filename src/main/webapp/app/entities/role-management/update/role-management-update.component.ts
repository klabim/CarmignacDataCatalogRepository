import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRoleManagement, RoleManagement } from '../role-management.model';
import { RoleManagementService } from '../service/role-management.service';
import { IAttribute } from 'app/entities/attribute/attribute.model';
import { AttributeService } from 'app/entities/attribute/service/attribute.service';
import { IBusinessObject } from 'app/entities/business-object/business-object.model';
import { BusinessObjectService } from 'app/entities/business-object/service/business-object.service';
import { IDataRole } from 'app/entities/data-role/data-role.model';
import { DataRoleService } from 'app/entities/data-role/service/data-role.service';
import { IDataService } from 'app/entities/data-service/data-service.model';
import { DataServiceService } from 'app/entities/data-service/service/data-service.service';

@Component({
  selector: 'jhi-role-management-update',
  templateUrl: './role-management-update.component.html',
})
export class RoleManagementUpdateComponent implements OnInit {
  isSaving = false;

  respByExceptionsCollection: IAttribute[] = [];
  responsiblesCollection: IBusinessObject[] = [];
  dataRolesCollection: IDataRole[] = [];
  dataServicesCollection: IDataService[] = [];

  editForm = this.fb.group({
    id: [],
    idDataRole: [null, []],
    updateDate: [],
    creationDate: [],
    respByException: [],
    responsible: [],
    dataRole: [],
    dataService: [],
  });

  constructor(
    protected roleManagementService: RoleManagementService,
    protected attributeService: AttributeService,
    protected businessObjectService: BusinessObjectService,
    protected dataRoleService: DataRoleService,
    protected dataServiceService: DataServiceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roleManagement }) => {
      this.updateForm(roleManagement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const roleManagement = this.createFromForm();
    if (roleManagement.id !== undefined) {
      this.subscribeToSaveResponse(this.roleManagementService.update(roleManagement));
    } else {
      this.subscribeToSaveResponse(this.roleManagementService.create(roleManagement));
    }
  }

  trackAttributeById(index: number, item: IAttribute): string {
    return item.id!;
  }

  trackBusinessObjectById(index: number, item: IBusinessObject): number {
    return item.id!;
  }

  trackDataRoleById(index: number, item: IDataRole): number {
    return item.id!;
  }

  trackDataServiceById(index: number, item: IDataService): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoleManagement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(roleManagement: IRoleManagement): void {
    this.editForm.patchValue({
      id: roleManagement.id,
      idDataRole: roleManagement.idDataRole,
      updateDate: roleManagement.updateDate,
      creationDate: roleManagement.creationDate,
      respByException: roleManagement.respByException,
      responsible: roleManagement.responsible,
      dataRole: roleManagement.dataRole,
      dataService: roleManagement.dataService,
    });

    this.respByExceptionsCollection = this.attributeService.addAttributeToCollectionIfMissing(
      this.respByExceptionsCollection,
      roleManagement.respByException
    );
    this.responsiblesCollection = this.businessObjectService.addBusinessObjectToCollectionIfMissing(
      this.responsiblesCollection,
      roleManagement.responsible
    );
    this.dataRolesCollection = this.dataRoleService.addDataRoleToCollectionIfMissing(this.dataRolesCollection, roleManagement.dataRole);
    this.dataServicesCollection = this.dataServiceService.addDataServiceToCollectionIfMissing(
      this.dataServicesCollection,
      roleManagement.dataService
    );
  }

  protected loadRelationshipsOptions(): void {
    this.attributeService
      .query({ filter: 'rolemanagement-is-null' })
      .pipe(map((res: HttpResponse<IAttribute[]>) => res.body ?? []))
      .pipe(
        map((attributes: IAttribute[]) =>
          this.attributeService.addAttributeToCollectionIfMissing(attributes, this.editForm.get('respByException')!.value)
        )
      )
      .subscribe((attributes: IAttribute[]) => (this.respByExceptionsCollection = attributes));

    this.businessObjectService
      .query({ filter: 'rolemanagement-is-null' })
      .pipe(map((res: HttpResponse<IBusinessObject[]>) => res.body ?? []))
      .pipe(
        map((businessObjects: IBusinessObject[]) =>
          this.businessObjectService.addBusinessObjectToCollectionIfMissing(businessObjects, this.editForm.get('responsible')!.value)
        )
      )
      .subscribe((businessObjects: IBusinessObject[]) => (this.responsiblesCollection = businessObjects));

    this.dataRoleService
      .query({ filter: 'rolemanagement-is-null' })
      .pipe(map((res: HttpResponse<IDataRole[]>) => res.body ?? []))
      .pipe(
        map((dataRoles: IDataRole[]) =>
          this.dataRoleService.addDataRoleToCollectionIfMissing(dataRoles, this.editForm.get('dataRole')!.value)
        )
      )
      .subscribe((dataRoles: IDataRole[]) => (this.dataRolesCollection = dataRoles));

    this.dataServiceService
      .query({ filter: 'rolemanagement-is-null' })
      .pipe(map((res: HttpResponse<IDataService[]>) => res.body ?? []))
      .pipe(
        map((dataServices: IDataService[]) =>
          this.dataServiceService.addDataServiceToCollectionIfMissing(dataServices, this.editForm.get('dataService')!.value)
        )
      )
      .subscribe((dataServices: IDataService[]) => (this.dataServicesCollection = dataServices));
  }

  protected createFromForm(): IRoleManagement {
    return {
      ...new RoleManagement(),
      id: this.editForm.get(['id'])!.value,
      idDataRole: this.editForm.get(['idDataRole'])!.value,
      updateDate: this.editForm.get(['updateDate'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value,
      respByException: this.editForm.get(['respByException'])!.value,
      responsible: this.editForm.get(['responsible'])!.value,
      dataRole: this.editForm.get(['dataRole'])!.value,
      dataService: this.editForm.get(['dataService'])!.value,
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBusinessObject, BusinessObject } from '../business-object.model';
import { BusinessObjectService } from '../service/business-object.service';
import { IAttribute } from 'app/entities/attribute/attribute.model';
import { AttributeService } from 'app/entities/attribute/service/attribute.service';

@Component({
  selector: 'jhi-business-object-update',
  templateUrl: './business-object-update.component.html',
})
export class BusinessObjectUpdateComponent implements OnInit {
  isSaving = false;

  attributesSharedCollection: IAttribute[] = [];

  editForm = this.fb.group({
    id: [],
    idBo: [null, []],
    name: [],
    definition: [],
    updateDate: [],
    creationDate: [],
    attributeList: [],
  });

  constructor(
    protected businessObjectService: BusinessObjectService,
    protected attributeService: AttributeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessObject }) => {
      this.updateForm(businessObject);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const businessObject = this.createFromForm();
    if (businessObject.id !== undefined) {
      this.subscribeToSaveResponse(this.businessObjectService.update(businessObject));
    } else {
      this.subscribeToSaveResponse(this.businessObjectService.create(businessObject));
    }
  }

  trackAttributeById(index: number, item: IAttribute): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusinessObject>>): void {
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

  protected updateForm(businessObject: IBusinessObject): void {
    this.editForm.patchValue({
      id: businessObject.id,
      idBo: businessObject.idBo,
      name: businessObject.name,
      definition: businessObject.definition,
      updateDate: businessObject.updateDate,
      creationDate: businessObject.creationDate,
      attributeList: businessObject.attributeList,
    });

    this.attributesSharedCollection = this.attributeService.addAttributeToCollectionIfMissing(
      this.attributesSharedCollection,
      businessObject.attributeList
    );
  }

  protected loadRelationshipsOptions(): void {
    this.attributeService
      .query()
      .pipe(map((res: HttpResponse<IAttribute[]>) => res.body ?? []))
      .pipe(
        map((attributes: IAttribute[]) =>
          this.attributeService.addAttributeToCollectionIfMissing(attributes, this.editForm.get('attributeList')!.value)
        )
      )
      .subscribe((attributes: IAttribute[]) => (this.attributesSharedCollection = attributes));
  }

  protected createFromForm(): IBusinessObject {
    return {
      ...new BusinessObject(),
      id: this.editForm.get(['id'])!.value,
      idBo: this.editForm.get(['idBo'])!.value,
      name: this.editForm.get(['name'])!.value,
      definition: this.editForm.get(['definition'])!.value,
      updateDate: this.editForm.get(['updateDate'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value,
      attributeList: this.editForm.get(['attributeList'])!.value,
    };
  }
}

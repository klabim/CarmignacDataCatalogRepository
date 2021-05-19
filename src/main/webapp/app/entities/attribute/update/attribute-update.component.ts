import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAttribute, Attribute } from '../attribute.model';
import { AttributeService } from '../service/attribute.service';
import { ISourcePriority } from 'app/entities/source-priority/source-priority.model';
import { SourcePriorityService } from 'app/entities/source-priority/service/source-priority.service';
import { IBusinessObject } from 'app/entities/business-object/business-object.model';
import { BusinessObjectService } from 'app/entities/business-object/service/business-object.service';

@Component({
  selector: 'jhi-attribute-update',
  templateUrl: './attribute-update.component.html',
})
export class AttributeUpdateComponent implements OnInit {
  isSaving = false;

  goldenSourcePrioritiesCollection: ISourcePriority[] = [];
  linkedTypesCollection: IBusinessObject[] = [];

  editForm = this.fb.group({
    id: [null, []],
    name: [],
    internalExternal: [],
    cardinality: [],
    enumeration: [],
    lPattern: [],
    longName: [],
    definition: [],
    updateDate: [],
    creationDate: [],
    goldenSourcePriority: [],
    linkedType: [],
  });

  constructor(
    protected attributeService: AttributeService,
    protected sourcePriorityService: SourcePriorityService,
    protected businessObjectService: BusinessObjectService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attribute }) => {
      this.updateForm(attribute);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attribute = this.createFromForm();
    if (attribute.id !== undefined) {
      this.subscribeToSaveResponse(this.attributeService.update(attribute));
    } else {
      this.subscribeToSaveResponse(this.attributeService.create(attribute));
    }
  }

  trackSourcePriorityById(index: number, item: ISourcePriority): number {
    return item.id!;
  }

  trackBusinessObjectById(index: number, item: IBusinessObject): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttribute>>): void {
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

  protected updateForm(attribute: IAttribute): void {
    this.editForm.patchValue({
      id: attribute.id,
      name: attribute.name,
      internalExternal: attribute.internalExternal,
      cardinality: attribute.cardinality,
      enumeration: attribute.enumeration,
      lPattern: attribute.lPattern,
      longName: attribute.longName,
      definition: attribute.definition,
      updateDate: attribute.updateDate,
      creationDate: attribute.creationDate,
      goldenSourcePriority: attribute.goldenSourcePriority,
      linkedType: attribute.linkedType,
    });

    this.goldenSourcePrioritiesCollection = this.sourcePriorityService.addSourcePriorityToCollectionIfMissing(
      this.goldenSourcePrioritiesCollection,
      attribute.goldenSourcePriority
    );
    this.linkedTypesCollection = this.businessObjectService.addBusinessObjectToCollectionIfMissing(
      this.linkedTypesCollection,
      attribute.linkedType
    );
  }

  protected loadRelationshipsOptions(): void {
    this.sourcePriorityService
      .query({ filter: 'attribute-is-null' })
      .pipe(map((res: HttpResponse<ISourcePriority[]>) => res.body ?? []))
      .pipe(
        map((sourcePriorities: ISourcePriority[]) =>
          this.sourcePriorityService.addSourcePriorityToCollectionIfMissing(
            sourcePriorities,
            this.editForm.get('goldenSourcePriority')!.value
          )
        )
      )
      .subscribe((sourcePriorities: ISourcePriority[]) => (this.goldenSourcePrioritiesCollection = sourcePriorities));

    this.businessObjectService
      .query({ filter: 'attribute-is-null' })
      .pipe(map((res: HttpResponse<IBusinessObject[]>) => res.body ?? []))
      .pipe(
        map((businessObjects: IBusinessObject[]) =>
          this.businessObjectService.addBusinessObjectToCollectionIfMissing(businessObjects, this.editForm.get('linkedType')!.value)
        )
      )
      .subscribe((businessObjects: IBusinessObject[]) => (this.linkedTypesCollection = businessObjects));
  }

  protected createFromForm(): IAttribute {
    return {
      ...new Attribute(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      internalExternal: this.editForm.get(['internalExternal'])!.value,
      cardinality: this.editForm.get(['cardinality'])!.value,
      enumeration: this.editForm.get(['enumeration'])!.value,
      lPattern: this.editForm.get(['lPattern'])!.value,
      longName: this.editForm.get(['longName'])!.value,
      definition: this.editForm.get(['definition'])!.value,
      updateDate: this.editForm.get(['updateDate'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value,
      goldenSourcePriority: this.editForm.get(['goldenSourcePriority'])!.value,
      linkedType: this.editForm.get(['linkedType'])!.value,
    };
  }
}

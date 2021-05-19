import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrderedSource, OrderedSource } from '../ordered-source.model';
import { OrderedSourceService } from '../service/ordered-source.service';
import { ISource } from 'app/entities/source/source.model';
import { SourceService } from 'app/entities/source/service/source.service';
import { ISourcePriority } from 'app/entities/source-priority/source-priority.model';
import { SourcePriorityService } from 'app/entities/source-priority/service/source-priority.service';

@Component({
  selector: 'jhi-ordered-source-update',
  templateUrl: './ordered-source-update.component.html',
})
export class OrderedSourceUpdateComponent implements OnInit {
  isSaving = false;

  linkedSourcesCollection: ISource[] = [];
  sourcePrioritiesSharedCollection: ISourcePriority[] = [];

  editForm = this.fb.group({
    id: [],
    orderSource: [null, [Validators.required]],
    updateDate: [],
    creationDate: [],
    linkedSource: [],
    sourcePriority: [],
  });

  constructor(
    protected orderedSourceService: OrderedSourceService,
    protected sourceService: SourceService,
    protected sourcePriorityService: SourcePriorityService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderedSource }) => {
      this.updateForm(orderedSource);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderedSource = this.createFromForm();
    if (orderedSource.id !== undefined) {
      this.subscribeToSaveResponse(this.orderedSourceService.update(orderedSource));
    } else {
      this.subscribeToSaveResponse(this.orderedSourceService.create(orderedSource));
    }
  }

  trackSourceById(index: number, item: ISource): number {
    return item.id!;
  }

  trackSourcePriorityById(index: number, item: ISourcePriority): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderedSource>>): void {
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

  protected updateForm(orderedSource: IOrderedSource): void {
    this.editForm.patchValue({
      id: orderedSource.id,
      orderSource: orderedSource.orderSource,
      updateDate: orderedSource.updateDate,
      creationDate: orderedSource.creationDate,
      linkedSource: orderedSource.linkedSource,
      sourcePriority: orderedSource.sourcePriority,
    });

    this.linkedSourcesCollection = this.sourceService.addSourceToCollectionIfMissing(
      this.linkedSourcesCollection,
      orderedSource.linkedSource
    );
    this.sourcePrioritiesSharedCollection = this.sourcePriorityService.addSourcePriorityToCollectionIfMissing(
      this.sourcePrioritiesSharedCollection,
      orderedSource.sourcePriority
    );
  }

  protected loadRelationshipsOptions(): void {
    this.sourceService
      .query({ filter: 'orderedsource-is-null' })
      .pipe(map((res: HttpResponse<ISource[]>) => res.body ?? []))
      .pipe(
        map((sources: ISource[]) => this.sourceService.addSourceToCollectionIfMissing(sources, this.editForm.get('linkedSource')!.value))
      )
      .subscribe((sources: ISource[]) => (this.linkedSourcesCollection = sources));

    this.sourcePriorityService
      .query()
      .pipe(map((res: HttpResponse<ISourcePriority[]>) => res.body ?? []))
      .pipe(
        map((sourcePriorities: ISourcePriority[]) =>
          this.sourcePriorityService.addSourcePriorityToCollectionIfMissing(sourcePriorities, this.editForm.get('sourcePriority')!.value)
        )
      )
      .subscribe((sourcePriorities: ISourcePriority[]) => (this.sourcePrioritiesSharedCollection = sourcePriorities));
  }

  protected createFromForm(): IOrderedSource {
    return {
      ...new OrderedSource(),
      id: this.editForm.get(['id'])!.value,
      orderSource: this.editForm.get(['orderSource'])!.value,
      updateDate: this.editForm.get(['updateDate'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value,
      linkedSource: this.editForm.get(['linkedSource'])!.value,
      sourcePriority: this.editForm.get(['sourcePriority'])!.value,
    };
  }
}

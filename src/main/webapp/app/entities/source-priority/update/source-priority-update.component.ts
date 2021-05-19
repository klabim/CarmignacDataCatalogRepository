import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISourcePriority, SourcePriority } from '../source-priority.model';
import { SourcePriorityService } from '../service/source-priority.service';

@Component({
  selector: 'jhi-source-priority-update',
  templateUrl: './source-priority-update.component.html',
})
export class SourcePriorityUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idSourcePriority: [null, []],
    name: [],
    description: [],
    updateDate: [],
    creationDate: [],
  });

  constructor(
    protected sourcePriorityService: SourcePriorityService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sourcePriority }) => {
      this.updateForm(sourcePriority);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sourcePriority = this.createFromForm();
    if (sourcePriority.id !== undefined) {
      this.subscribeToSaveResponse(this.sourcePriorityService.update(sourcePriority));
    } else {
      this.subscribeToSaveResponse(this.sourcePriorityService.create(sourcePriority));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISourcePriority>>): void {
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

  protected updateForm(sourcePriority: ISourcePriority): void {
    this.editForm.patchValue({
      id: sourcePriority.id,
      idSourcePriority: sourcePriority.idSourcePriority,
      name: sourcePriority.name,
      description: sourcePriority.description,
      updateDate: sourcePriority.updateDate,
      creationDate: sourcePriority.creationDate,
    });
  }

  protected createFromForm(): ISourcePriority {
    return {
      ...new SourcePriority(),
      id: this.editForm.get(['id'])!.value,
      idSourcePriority: this.editForm.get(['idSourcePriority'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      updateDate: this.editForm.get(['updateDate'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value,
    };
  }
}

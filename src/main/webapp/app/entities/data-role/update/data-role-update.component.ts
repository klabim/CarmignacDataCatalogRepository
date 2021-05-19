import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDataRole, DataRole } from '../data-role.model';
import { DataRoleService } from '../service/data-role.service';

@Component({
  selector: 'jhi-data-role-update',
  templateUrl: './data-role-update.component.html',
})
export class DataRoleUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idDataRole: [null, []],
    name: [],
    description: [],
    updateDate: [],
    creationDate: [],
  });

  constructor(protected dataRoleService: DataRoleService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dataRole }) => {
      this.updateForm(dataRole);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dataRole = this.createFromForm();
    if (dataRole.id !== undefined) {
      this.subscribeToSaveResponse(this.dataRoleService.update(dataRole));
    } else {
      this.subscribeToSaveResponse(this.dataRoleService.create(dataRole));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDataRole>>): void {
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

  protected updateForm(dataRole: IDataRole): void {
    this.editForm.patchValue({
      id: dataRole.id,
      idDataRole: dataRole.idDataRole,
      name: dataRole.name,
      description: dataRole.description,
      updateDate: dataRole.updateDate,
      creationDate: dataRole.creationDate,
    });
  }

  protected createFromForm(): IDataRole {
    return {
      ...new DataRole(),
      id: this.editForm.get(['id'])!.value,
      idDataRole: this.editForm.get(['idDataRole'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      updateDate: this.editForm.get(['updateDate'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value,
    };
  }
}

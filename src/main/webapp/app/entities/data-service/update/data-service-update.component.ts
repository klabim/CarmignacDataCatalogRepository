import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDataService, DataService } from '../data-service.model';
import { DataServiceService } from '../service/data-service.service';

@Component({
  selector: 'jhi-data-service-update',
  templateUrl: './data-service-update.component.html',
})
export class DataServiceUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idService: [null, []],
    name: [],
    description: [],
    updateDate: [],
    creationDate: [],
  });

  constructor(protected dataServiceService: DataServiceService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dataService }) => {
      this.updateForm(dataService);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dataService = this.createFromForm();
    if (dataService.id !== undefined) {
      this.subscribeToSaveResponse(this.dataServiceService.update(dataService));
    } else {
      this.subscribeToSaveResponse(this.dataServiceService.create(dataService));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDataService>>): void {
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

  protected updateForm(dataService: IDataService): void {
    this.editForm.patchValue({
      id: dataService.id,
      idService: dataService.idService,
      name: dataService.name,
      description: dataService.description,
      updateDate: dataService.updateDate,
      creationDate: dataService.creationDate,
    });
  }

  protected createFromForm(): IDataService {
    return {
      ...new DataService(),
      id: this.editForm.get(['id'])!.value,
      idService: this.editForm.get(['idService'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      updateDate: this.editForm.get(['updateDate'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value,
    };
  }
}

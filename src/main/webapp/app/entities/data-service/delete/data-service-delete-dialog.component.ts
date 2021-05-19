import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDataService } from '../data-service.model';
import { DataServiceService } from '../service/data-service.service';

@Component({
  templateUrl: './data-service-delete-dialog.component.html',
})
export class DataServiceDeleteDialogComponent {
  dataService?: IDataService;

  constructor(protected dataServiceService: DataServiceService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dataServiceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

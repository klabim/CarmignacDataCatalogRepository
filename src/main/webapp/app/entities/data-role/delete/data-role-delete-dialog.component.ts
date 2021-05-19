import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDataRole } from '../data-role.model';
import { DataRoleService } from '../service/data-role.service';

@Component({
  templateUrl: './data-role-delete-dialog.component.html',
})
export class DataRoleDeleteDialogComponent {
  dataRole?: IDataRole;

  constructor(protected dataRoleService: DataRoleService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dataRoleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoleManagement } from '../role-management.model';
import { RoleManagementService } from '../service/role-management.service';

@Component({
  templateUrl: './role-management-delete-dialog.component.html',
})
export class RoleManagementDeleteDialogComponent {
  roleManagement?: IRoleManagement;

  constructor(protected roleManagementService: RoleManagementService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.roleManagementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

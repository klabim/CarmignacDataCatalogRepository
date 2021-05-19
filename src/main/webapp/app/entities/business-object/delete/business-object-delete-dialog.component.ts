import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusinessObject } from '../business-object.model';
import { BusinessObjectService } from '../service/business-object.service';

@Component({
  templateUrl: './business-object-delete-dialog.component.html',
})
export class BusinessObjectDeleteDialogComponent {
  businessObject?: IBusinessObject;

  constructor(protected businessObjectService: BusinessObjectService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.businessObjectService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

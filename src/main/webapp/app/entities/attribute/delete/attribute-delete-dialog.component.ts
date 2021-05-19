import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAttribute } from '../attribute.model';
import { AttributeService } from '../service/attribute.service';

@Component({
  templateUrl: './attribute-delete-dialog.component.html',
})
export class AttributeDeleteDialogComponent {
  attribute?: IAttribute;

  constructor(protected attributeService: AttributeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.attributeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

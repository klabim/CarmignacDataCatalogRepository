import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrderedSource } from '../ordered-source.model';
import { OrderedSourceService } from '../service/ordered-source.service';

@Component({
  templateUrl: './ordered-source-delete-dialog.component.html',
})
export class OrderedSourceDeleteDialogComponent {
  orderedSource?: IOrderedSource;

  constructor(protected orderedSourceService: OrderedSourceService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderedSourceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

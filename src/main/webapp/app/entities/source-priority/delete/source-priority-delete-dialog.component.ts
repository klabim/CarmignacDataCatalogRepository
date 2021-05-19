import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISourcePriority } from '../source-priority.model';
import { SourcePriorityService } from '../service/source-priority.service';

@Component({
  templateUrl: './source-priority-delete-dialog.component.html',
})
export class SourcePriorityDeleteDialogComponent {
  sourcePriority?: ISourcePriority;

  constructor(protected sourcePriorityService: SourcePriorityService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sourcePriorityService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

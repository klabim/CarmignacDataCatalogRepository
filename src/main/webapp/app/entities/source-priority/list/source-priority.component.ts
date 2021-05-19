import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISourcePriority } from '../source-priority.model';
import { SourcePriorityService } from '../service/source-priority.service';
import { SourcePriorityDeleteDialogComponent } from '../delete/source-priority-delete-dialog.component';

@Component({
  selector: 'jhi-source-priority',
  templateUrl: './source-priority.component.html',
})
export class SourcePriorityComponent implements OnInit {
  sourcePriorities?: ISourcePriority[];
  isLoading = false;

  constructor(protected sourcePriorityService: SourcePriorityService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sourcePriorityService.query().subscribe(
      (res: HttpResponse<ISourcePriority[]>) => {
        this.isLoading = false;
        this.sourcePriorities = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISourcePriority): number {
    return item.id!;
  }

  delete(sourcePriority: ISourcePriority): void {
    const modalRef = this.modalService.open(SourcePriorityDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sourcePriority = sourcePriority;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

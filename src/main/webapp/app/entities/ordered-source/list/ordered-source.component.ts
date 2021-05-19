import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrderedSource } from '../ordered-source.model';
import { OrderedSourceService } from '../service/ordered-source.service';
import { OrderedSourceDeleteDialogComponent } from '../delete/ordered-source-delete-dialog.component';

@Component({
  selector: 'jhi-ordered-source',
  templateUrl: './ordered-source.component.html',
})
export class OrderedSourceComponent implements OnInit {
  orderedSources?: IOrderedSource[];
  isLoading = false;

  constructor(protected orderedSourceService: OrderedSourceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.orderedSourceService.query().subscribe(
      (res: HttpResponse<IOrderedSource[]>) => {
        this.isLoading = false;
        this.orderedSources = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOrderedSource): number {
    return item.id!;
  }

  delete(orderedSource: IOrderedSource): void {
    const modalRef = this.modalService.open(OrderedSourceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.orderedSource = orderedSource;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

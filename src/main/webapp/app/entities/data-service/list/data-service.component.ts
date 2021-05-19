import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDataService } from '../data-service.model';
import { DataServiceService } from '../service/data-service.service';
import { DataServiceDeleteDialogComponent } from '../delete/data-service-delete-dialog.component';

@Component({
  selector: 'jhi-data-service',
  templateUrl: './data-service.component.html',
})
export class DataServiceComponent implements OnInit {
  dataServices?: IDataService[];
  isLoading = false;

  constructor(protected dataServiceService: DataServiceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.dataServiceService.query().subscribe(
      (res: HttpResponse<IDataService[]>) => {
        this.isLoading = false;
        this.dataServices = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDataService): number {
    return item.id!;
  }

  delete(dataService: IDataService): void {
    const modalRef = this.modalService.open(DataServiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.dataService = dataService;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

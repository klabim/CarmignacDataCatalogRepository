import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusinessObject } from '../business-object.model';
import { BusinessObjectService } from '../service/business-object.service';
import { BusinessObjectDeleteDialogComponent } from '../delete/business-object-delete-dialog.component';

@Component({
  selector: 'jhi-business-object',
  templateUrl: './business-object.component.html',
})
export class BusinessObjectComponent implements OnInit {
  businessObjects?: IBusinessObject[];
  isLoading = false;

  constructor(protected businessObjectService: BusinessObjectService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.businessObjectService.query().subscribe(
      (res: HttpResponse<IBusinessObject[]>) => {
        this.isLoading = false;
        this.businessObjects = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBusinessObject): number {
    return item.id!;
  }

  delete(businessObject: IBusinessObject): void {
    const modalRef = this.modalService.open(BusinessObjectDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.businessObject = businessObject;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

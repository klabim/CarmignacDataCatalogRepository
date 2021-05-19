import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDataRole } from '../data-role.model';
import { DataRoleService } from '../service/data-role.service';
import { DataRoleDeleteDialogComponent } from '../delete/data-role-delete-dialog.component';

@Component({
  selector: 'jhi-data-role',
  templateUrl: './data-role.component.html',
})
export class DataRoleComponent implements OnInit {
  dataRoles?: IDataRole[];
  isLoading = false;

  constructor(protected dataRoleService: DataRoleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.dataRoleService.query().subscribe(
      (res: HttpResponse<IDataRole[]>) => {
        this.isLoading = false;
        this.dataRoles = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDataRole): number {
    return item.id!;
  }

  delete(dataRole: IDataRole): void {
    const modalRef = this.modalService.open(DataRoleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.dataRole = dataRole;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

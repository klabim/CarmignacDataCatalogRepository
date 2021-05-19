import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoleManagement } from '../role-management.model';
import { RoleManagementService } from '../service/role-management.service';
import { RoleManagementDeleteDialogComponent } from '../delete/role-management-delete-dialog.component';

@Component({
  selector: 'jhi-role-management',
  templateUrl: './role-management.component.html',
})
export class RoleManagementComponent implements OnInit {
  roleManagements?: IRoleManagement[];
  isLoading = false;

  constructor(protected roleManagementService: RoleManagementService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.roleManagementService.query().subscribe(
      (res: HttpResponse<IRoleManagement[]>) => {
        this.isLoading = false;
        this.roleManagements = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRoleManagement): number {
    return item.id!;
  }

  delete(roleManagement: IRoleManagement): void {
    const modalRef = this.modalService.open(RoleManagementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.roleManagement = roleManagement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

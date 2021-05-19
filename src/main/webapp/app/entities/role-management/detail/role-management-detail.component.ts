import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoleManagement } from '../role-management.model';

@Component({
  selector: 'jhi-role-management-detail',
  templateUrl: './role-management-detail.component.html',
})
export class RoleManagementDetailComponent implements OnInit {
  roleManagement: IRoleManagement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roleManagement }) => {
      this.roleManagement = roleManagement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

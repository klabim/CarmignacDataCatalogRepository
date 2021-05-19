import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDataRole } from '../data-role.model';

@Component({
  selector: 'jhi-data-role-detail',
  templateUrl: './data-role-detail.component.html',
})
export class DataRoleDetailComponent implements OnInit {
  dataRole: IDataRole | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dataRole }) => {
      this.dataRole = dataRole;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

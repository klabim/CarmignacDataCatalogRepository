import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBusinessObject } from '../business-object.model';

@Component({
  selector: 'jhi-business-object-detail',
  templateUrl: './business-object-detail.component.html',
})
export class BusinessObjectDetailComponent implements OnInit {
  businessObject: IBusinessObject | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessObject }) => {
      this.businessObject = businessObject;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

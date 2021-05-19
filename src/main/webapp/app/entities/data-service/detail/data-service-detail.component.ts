import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDataService } from '../data-service.model';

@Component({
  selector: 'jhi-data-service-detail',
  templateUrl: './data-service-detail.component.html',
})
export class DataServiceDetailComponent implements OnInit {
  dataService: IDataService | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dataService }) => {
      this.dataService = dataService;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

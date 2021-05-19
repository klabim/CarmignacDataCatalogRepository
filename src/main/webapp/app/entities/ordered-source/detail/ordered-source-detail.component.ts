import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrderedSource } from '../ordered-source.model';

@Component({
  selector: 'jhi-ordered-source-detail',
  templateUrl: './ordered-source-detail.component.html',
})
export class OrderedSourceDetailComponent implements OnInit {
  orderedSource: IOrderedSource | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderedSource }) => {
      this.orderedSource = orderedSource;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

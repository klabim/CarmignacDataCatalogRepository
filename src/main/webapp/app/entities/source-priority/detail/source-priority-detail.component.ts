import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISourcePriority } from '../source-priority.model';

@Component({
  selector: 'jhi-source-priority-detail',
  templateUrl: './source-priority-detail.component.html',
})
export class SourcePriorityDetailComponent implements OnInit {
  sourcePriority: ISourcePriority | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sourcePriority }) => {
      this.sourcePriority = sourcePriority;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

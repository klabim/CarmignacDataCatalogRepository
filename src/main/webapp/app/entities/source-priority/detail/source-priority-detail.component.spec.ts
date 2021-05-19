import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SourcePriorityDetailComponent } from './source-priority-detail.component';

describe('Component Tests', () => {
  describe('SourcePriority Management Detail Component', () => {
    let comp: SourcePriorityDetailComponent;
    let fixture: ComponentFixture<SourcePriorityDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SourcePriorityDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ sourcePriority: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SourcePriorityDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SourcePriorityDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load sourcePriority on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sourcePriority).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

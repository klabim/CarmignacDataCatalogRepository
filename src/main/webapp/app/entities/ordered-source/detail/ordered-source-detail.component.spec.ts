import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrderedSourceDetailComponent } from './ordered-source-detail.component';

describe('Component Tests', () => {
  describe('OrderedSource Management Detail Component', () => {
    let comp: OrderedSourceDetailComponent;
    let fixture: ComponentFixture<OrderedSourceDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [OrderedSourceDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ orderedSource: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(OrderedSourceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderedSourceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load orderedSource on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.orderedSource).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

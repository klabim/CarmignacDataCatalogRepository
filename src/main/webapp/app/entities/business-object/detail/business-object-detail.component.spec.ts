import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BusinessObjectDetailComponent } from './business-object-detail.component';

describe('Component Tests', () => {
  describe('BusinessObject Management Detail Component', () => {
    let comp: BusinessObjectDetailComponent;
    let fixture: ComponentFixture<BusinessObjectDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BusinessObjectDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ businessObject: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BusinessObjectDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BusinessObjectDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load businessObject on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.businessObject).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

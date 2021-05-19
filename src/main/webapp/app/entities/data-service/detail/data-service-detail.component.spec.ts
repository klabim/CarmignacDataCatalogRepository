import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DataServiceDetailComponent } from './data-service-detail.component';

describe('Component Tests', () => {
  describe('DataService Management Detail Component', () => {
    let comp: DataServiceDetailComponent;
    let fixture: ComponentFixture<DataServiceDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DataServiceDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ dataService: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DataServiceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DataServiceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load dataService on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.dataService).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DataRoleDetailComponent } from './data-role-detail.component';

describe('Component Tests', () => {
  describe('DataRole Management Detail Component', () => {
    let comp: DataRoleDetailComponent;
    let fixture: ComponentFixture<DataRoleDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DataRoleDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ dataRole: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DataRoleDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DataRoleDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load dataRole on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.dataRole).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

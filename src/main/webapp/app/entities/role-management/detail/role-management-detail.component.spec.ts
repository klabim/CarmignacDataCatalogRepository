import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RoleManagementDetailComponent } from './role-management-detail.component';

describe('Component Tests', () => {
  describe('RoleManagement Management Detail Component', () => {
    let comp: RoleManagementDetailComponent;
    let fixture: ComponentFixture<RoleManagementDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RoleManagementDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ roleManagement: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RoleManagementDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RoleManagementDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load roleManagement on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.roleManagement).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

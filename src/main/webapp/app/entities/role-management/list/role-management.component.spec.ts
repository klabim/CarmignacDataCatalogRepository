import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RoleManagementService } from '../service/role-management.service';

import { RoleManagementComponent } from './role-management.component';

describe('Component Tests', () => {
  describe('RoleManagement Management Component', () => {
    let comp: RoleManagementComponent;
    let fixture: ComponentFixture<RoleManagementComponent>;
    let service: RoleManagementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RoleManagementComponent],
      })
        .overrideTemplate(RoleManagementComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RoleManagementComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RoleManagementService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.roleManagements?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

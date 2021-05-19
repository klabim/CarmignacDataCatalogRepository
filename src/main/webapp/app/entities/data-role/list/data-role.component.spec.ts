import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DataRoleService } from '../service/data-role.service';

import { DataRoleComponent } from './data-role.component';

describe('Component Tests', () => {
  describe('DataRole Management Component', () => {
    let comp: DataRoleComponent;
    let fixture: ComponentFixture<DataRoleComponent>;
    let service: DataRoleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DataRoleComponent],
      })
        .overrideTemplate(DataRoleComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DataRoleComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DataRoleService);

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
      expect(comp.dataRoles?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BusinessObjectService } from '../service/business-object.service';

import { BusinessObjectComponent } from './business-object.component';

describe('Component Tests', () => {
  describe('BusinessObject Management Component', () => {
    let comp: BusinessObjectComponent;
    let fixture: ComponentFixture<BusinessObjectComponent>;
    let service: BusinessObjectService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BusinessObjectComponent],
      })
        .overrideTemplate(BusinessObjectComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BusinessObjectComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BusinessObjectService);

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
      expect(comp.businessObjects?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

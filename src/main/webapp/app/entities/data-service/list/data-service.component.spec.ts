import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DataServiceService } from '../service/data-service.service';

import { DataServiceComponent } from './data-service.component';

describe('Component Tests', () => {
  describe('DataService Management Component', () => {
    let comp: DataServiceComponent;
    let fixture: ComponentFixture<DataServiceComponent>;
    let service: DataServiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DataServiceComponent],
      })
        .overrideTemplate(DataServiceComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DataServiceComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DataServiceService);

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
      expect(comp.dataServices?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AttributeService } from '../service/attribute.service';

import { AttributeComponent } from './attribute.component';

describe('Component Tests', () => {
  describe('Attribute Management Component', () => {
    let comp: AttributeComponent;
    let fixture: ComponentFixture<AttributeComponent>;
    let service: AttributeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AttributeComponent],
      })
        .overrideTemplate(AttributeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AttributeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AttributeService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }],
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
      expect(comp.attributes?.[0]).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});

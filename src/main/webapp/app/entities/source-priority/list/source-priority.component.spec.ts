import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SourcePriorityService } from '../service/source-priority.service';

import { SourcePriorityComponent } from './source-priority.component';

describe('Component Tests', () => {
  describe('SourcePriority Management Component', () => {
    let comp: SourcePriorityComponent;
    let fixture: ComponentFixture<SourcePriorityComponent>;
    let service: SourcePriorityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SourcePriorityComponent],
      })
        .overrideTemplate(SourcePriorityComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SourcePriorityComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SourcePriorityService);

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
      expect(comp.sourcePriorities?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

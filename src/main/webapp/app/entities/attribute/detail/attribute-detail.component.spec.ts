import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AttributeDetailComponent } from './attribute-detail.component';

describe('Component Tests', () => {
  describe('Attribute Management Detail Component', () => {
    let comp: AttributeDetailComponent;
    let fixture: ComponentFixture<AttributeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AttributeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ attribute: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
          },
        ],
      })
        .overrideTemplate(AttributeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AttributeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load attribute on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.attribute).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
      });
    });
  });
});

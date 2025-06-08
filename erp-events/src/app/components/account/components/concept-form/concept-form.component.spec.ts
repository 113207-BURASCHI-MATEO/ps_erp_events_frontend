import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptFormComponent } from './concept-form.component';

describe('ConceptFormComponent', () => {
  let component: ConceptFormComponent;
  let fixture: ComponentFixture<ConceptFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConceptFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConceptFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

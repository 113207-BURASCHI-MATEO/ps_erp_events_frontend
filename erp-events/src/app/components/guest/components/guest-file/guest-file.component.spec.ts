import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestFileComponent } from './guest-file.component';

describe('GuestFileComponent', () => {
  let component: GuestFileComponent;
  let fixture: ComponentFixture<GuestFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestCheckInComponent } from './guest-check-in.component';

describe('GuestCheckInComponent', () => {
  let component: GuestCheckInComponent;
  let fixture: ComponentFixture<GuestCheckInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestCheckInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

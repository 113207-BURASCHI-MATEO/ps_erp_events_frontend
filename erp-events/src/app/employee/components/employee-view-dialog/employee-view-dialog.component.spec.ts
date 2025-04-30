import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeViewDialogComponent } from './employee-view-dialog.component';

describe('EmployeeViewDialogComponent', () => {
  let component: EmployeeViewDialogComponent;
  let fixture: ComponentFixture<EmployeeViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

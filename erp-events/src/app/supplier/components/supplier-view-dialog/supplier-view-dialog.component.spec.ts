import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierViewDialogComponent } from './supplier-view-dialog.component';

describe('SupplierViewDialogComponent', () => {
  let component: SupplierViewDialogComponent;
  let fixture: ComponentFixture<SupplierViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

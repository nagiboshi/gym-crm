import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePurchaseDialogComponent } from './share-purchase-dialog.component';

describe('SharePurchaseDialogComponent', () => {
  let component: SharePurchaseDialogComponent;
  let fixture: ComponentFixture<SharePurchaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharePurchaseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePurchaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

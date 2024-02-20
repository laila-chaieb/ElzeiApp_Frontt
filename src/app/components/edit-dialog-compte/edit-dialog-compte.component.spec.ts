import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDialogCompteComponent } from './edit-dialog-compte.component';

describe('EditDialogCompteComponent', () => {
  let component: EditDialogCompteComponent;
  let fixture: ComponentFixture<EditDialogCompteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDialogCompteComponent]
    });
    fixture = TestBed.createComponent(EditDialogCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

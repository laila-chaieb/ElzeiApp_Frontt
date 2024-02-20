import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDialogComponentComponent } from './edit-dialog-component.component';

describe('EditDialogComponentComponent', () => {
  let component: EditDialogComponentComponent;
  let fixture: ComponentFixture<EditDialogComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDialogComponentComponent]
    });
    fixture = TestBed.createComponent(EditDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

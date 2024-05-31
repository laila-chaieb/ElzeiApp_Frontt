import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogValideComponent } from './dialog-valide.component';

describe('DialogValideComponent', () => {
  let component: DialogValideComponent;
  let fixture: ComponentFixture<DialogValideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogValideComponent]
    });
    fixture = TestBed.createComponent(DialogValideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

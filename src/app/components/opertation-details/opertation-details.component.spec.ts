import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpertationDetailsComponent } from './opertation-details.component';

describe('OpertationDetailsComponent', () => {
  let component: OpertationDetailsComponent;
  let fixture: ComponentFixture<OpertationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpertationDetailsComponent]
    });
    fixture = TestBed.createComponent(OpertationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeClassesComponent } from './liste-classes.component';

describe('ListeClassesComponent', () => {
  let component: ListeClassesComponent;
  let fixture: ComponentFixture<ListeClassesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeClassesComponent]
    });
    fixture = TestBed.createComponent(ListeClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

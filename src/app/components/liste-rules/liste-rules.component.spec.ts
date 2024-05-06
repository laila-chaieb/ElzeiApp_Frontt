import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRulesComponent } from './liste-rules.component';

describe('ListeRulesComponent', () => {
  let component: ListeRulesComponent;
  let fixture: ComponentFixture<ListeRulesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeRulesComponent]
    });
    fixture = TestBed.createComponent(ListeRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

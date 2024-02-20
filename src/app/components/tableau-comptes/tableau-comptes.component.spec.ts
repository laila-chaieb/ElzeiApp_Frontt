import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauComptesComponent } from './tableau-comptes.component';

describe('TableauComptesComponent', () => {
  let component: TableauComptesComponent;
  let fixture: ComponentFixture<TableauComptesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableauComptesComponent]
    });
    fixture = TestBed.createComponent(TableauComptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

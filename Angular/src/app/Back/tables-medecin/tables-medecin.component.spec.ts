import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesMedecinComponent } from './tables-medecin.component';

describe('TablesMedecinComponent', () => {
  let component: TablesMedecinComponent;
  let fixture: ComponentFixture<TablesMedecinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablesMedecinComponent]
    });
    fixture = TestBed.createComponent(TablesMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

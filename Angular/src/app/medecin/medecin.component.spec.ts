import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinComponent } from './medecin.component';

describe('MedecinComponent', () => {
  let component: MedecinComponent;
  let fixture: ComponentFixture<MedecinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedecinComponent]
    });
    fixture = TestBed.createComponent(MedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

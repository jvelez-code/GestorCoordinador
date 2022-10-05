import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadasCalificadasGDEComponent } from './llamadas-calificadas-gde.component';

describe('LlamadasCalificadasGDEComponent', () => {
  let component: LlamadasCalificadasGDEComponent;
  let fixture: ComponentFixture<LlamadasCalificadasGDEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LlamadasCalificadasGDEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlamadasCalificadasGDEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

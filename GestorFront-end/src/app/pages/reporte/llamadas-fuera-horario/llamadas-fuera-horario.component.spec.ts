import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadasFueraHorarioComponent } from './llamadas-fuera-horario.component';

describe('LlamadasFueraHorarioComponent', () => {
  let component: LlamadasFueraHorarioComponent;
  let fixture: ComponentFixture<LlamadasFueraHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LlamadasFueraHorarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlamadasFueraHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

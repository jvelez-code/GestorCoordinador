import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadasFueraHorarioEventualComponent } from './llamadas-fuera-horario-eventual.component';

describe('LlamadasFueraHorarioEventualComponent', () => {
  let component: LlamadasFueraHorarioEventualComponent;
  let fixture: ComponentFixture<LlamadasFueraHorarioEventualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LlamadasFueraHorarioEventualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlamadasFueraHorarioEventualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuracionEstadoComponent } from './duracion-estado.component';

describe('DuracionEstadoComponent', () => {
  let component: DuracionEstadoComponent;
  let fixture: ComponentFixture<DuracionEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuracionEstadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuracionEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

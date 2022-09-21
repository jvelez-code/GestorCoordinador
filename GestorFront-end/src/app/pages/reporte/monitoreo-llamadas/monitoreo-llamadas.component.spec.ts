import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoLlamadasComponent } from './monitoreo-llamadas.component';

describe('MonitoreoLlamadasComponent', () => {
  let component: MonitoreoLlamadasComponent;
  let fixture: ComponentFixture<MonitoreoLlamadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoreoLlamadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoreoLlamadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

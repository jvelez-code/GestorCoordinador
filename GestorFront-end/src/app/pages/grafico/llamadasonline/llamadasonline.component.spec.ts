import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadasonlineComponent } from './llamadasonline.component';

describe('LlamadasonlineComponent', () => {
  let component: LlamadasonlineComponent;
  let fixture: ComponentFixture<LlamadasonlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LlamadasonlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlamadasonlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

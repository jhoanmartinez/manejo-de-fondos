import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FondosPageComponent } from './fondos-page.component';

describe('FondosPageComponent', () => {
  let component: FondosPageComponent;
  let fixture: ComponentFixture<FondosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FondosPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FondosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

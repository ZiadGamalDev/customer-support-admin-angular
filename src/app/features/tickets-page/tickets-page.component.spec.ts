import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsPageComponent } from './tickets-page.component';

describe('TicketsPageComponent', () => {
  let component: TicketsPageComponent;
  let fixture: ComponentFixture<TicketsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

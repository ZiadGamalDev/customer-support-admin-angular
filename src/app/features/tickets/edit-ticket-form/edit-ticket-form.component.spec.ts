import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTicketFormComponent } from './edit-ticket-form.component';

describe('EditTicketFormComponent', () => {
  let component: EditTicketFormComponent;
  let fixture: ComponentFixture<EditTicketFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTicketFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { Ticket } from '../../../interfaces/tkt.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TktServiceService } from '../../../services/tickets/tkt-service.service';
import { CommonModule } from '@angular/common';
import { Agent } from '../../../interfaces/agentProfile.interface';
import { AgentService } from '../../../services/agents/agent.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-ticket-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-ticket-form.component.html',
  styleUrl: './edit-ticket-form.component.css',
})
export class EditTicketFormComponent {
  @Input() ticket!: Ticket;
  @Output() ticketUpdated = new EventEmitter<Ticket>();
  @Output() close = new EventEmitter<void>();
  agents: Agent[] = [];
  editForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  constructor(
    private fb: FormBuilder,
    private ticketService: TktServiceService,
    private agentService: AgentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAgents();
    this.editForm = this.fb.group({
      agentId: [this.ticket?.agentId || '', [Validators.required]],
      title: [this.ticket?.title || ''],
      description: [this.ticket?.description || ''],
    });
  }

  // form getters
  get agentIdControl() {
    return this.editForm.get('agentId');
  }
  get titleControl() {
    return this.editForm.get('title');
  }
  get descriptionControl() {
    return this.editForm.get('description');
  }

  loadAgents() {
    const token = localStorage.getItem('token') || '';
    this.agentService.getAgents(token).subscribe({
      next: (response) => {
        this.agents = response;
      },
      error: (error) => {
        this.error =
          error.message || 'Error loading agents. Please try again later.';
      },
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    this.error = null;
    const token = localStorage.getItem('token') || '';
    this.ticketService
      .editTicket(token, this.ticket.id, this.editForm.value)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.toastr.success('Ticket updated successfully!', 'Success');
          this.editForm.reset();
          this.close.emit();
          this.loadAgents();
          this.ticketUpdated.emit(response);
        },
        error: (error) => {
          this.isSubmitting = false;
          const errorMessage =
            error.error?.message || 'Error updating ticket. Please try again later.';
          this.error = errorMessage;

          if (errorMessage === 'The selected agent is not available') {
            this.toastr.warning('The selected agent is not available! Please choose another agent.', 'Warning');
            this.editForm.patchValue({ agentId: '' });
            this.editForm.markAsTouched();
          } else {
            this.toastr.error(errorMessage, 'Error');
            this.close.emit();
          }
        },
      });
  }

  onClose() {
    this.editForm.reset();
    this.close.emit();
  }
}

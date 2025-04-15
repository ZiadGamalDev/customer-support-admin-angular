import { Component } from '@angular/core';
import { AgentSidebarComponent } from '../sidebar/agent-sidebar/agent-sidebar.component';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { UsersService } from '../../services/users/users.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { emailDomainValidator } from '../../validators/email-domain.validator';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [
    AgentSidebarComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
  ],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.css',
})
export class AgentsComponent {
  agentForm: FormGroup;
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  isLoading = false;
  showModalAdd = false;
  isClosingAdd = false;
  error = '';
  searchQuery = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  showDeleteModal = false;
  userToDelete: string | null = null;
  selectedStatus: string = 'all';

  showModalEdit = false;
  isClosingEdit = false;
  selectedAgentId: string | null = null;

  agent = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmedPassword: '',
  };

  constructor(
    private userService: UsersService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.agentForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
            emailDomainValidator
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/
            ),
          ],
        ],
        confirmedPassword: ['', [Validators.required]],
        role: ['agent', [Validators.required]],
        status: ['available', [Validators.required]],
        phone: ['', [Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmedPassword = form.get('confirmedPassword')?.value;
    return password === confirmedPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredUsers = res;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch users';
        this.toastr.error('Failed to fetch users', 'Error');
        this.loading = false;
        console.error(err);
      },
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
  }

  applyFilters(): void {
    let tempUsers = this.users;

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      tempUsers = tempUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    if (this.selectedStatus !== 'all') {
      tempUsers = tempUsers.filter(
        (user) =>
          user.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    this.filteredUsers = tempUsers;
    this.updatePagination();
  }

  searchUsers(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  filterByStatus(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  openDeleteModal(userId: string): void {
    this.userToDelete = userId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (this.userToDelete) {
      this.loading = true;
      this.userService.deleteUser(this.userToDelete).subscribe({
        next: () => {
          this.users = this.users.filter(
            (user) => user.id !== this.userToDelete
          );
          this.filteredUsers = this.filteredUsers.filter(
            (user) => user.id !== this.userToDelete
          );
          this.updatePagination();
          this.loading = false;
          this.closeDeleteModal();
          this.toastr.success('User Deleted Successfully', 'Success');
        },
        error: (err) => {
          this.error = 'Failed to delete user';
          this.loading = false;
          this.closeDeleteModal();
          console.error(err);
        },
      });
    }
  }

  approveUser(email: string) {
    this.userService.approveUser(email).subscribe({
      next: (res) => {
        this.toastr.success('User approved successfully!', 'Success');
        this.fetchUsers();
      },
      error: (err) => {
        this.toastr.error('Error approving user', 'Error');
      },
    });
  }

  // * (Add) Modal
  openModalAdd() {
    this.showModalAdd = true;
    this.isClosingAdd = false;
  }

  closeModalAdd() {
    this.isClosingAdd = true;
    setTimeout(() => {
      this.showModalAdd = false;
      this.isClosingAdd = false;
      this.agentForm.reset();
    }, 300);
  }

  addNewAgent() {
    if (this.agentForm.valid) {
      this.isLoading = true;
      const agentData = {
        name: this.agentForm.get('name')?.value,
        email: this.agentForm.get('email')?.value,
        password: this.agentForm.get('password')?.value,
        confirmPassword: this.agentForm.get('confirmedPassword')?.value,
        role: this.agentForm.get('role')?.value,
        phone: this.agentForm.get('phone')?.value || undefined,
      };

      this.userService.addAgent(agentData).subscribe({
        next: (res) => {
          this.toastr.success('Agent added successfully!', 'Success');
          this.closeModalAdd();
          this.fetchUsers();
        },
        error: (err) => {
          console.log(err.message);
          
          const errorMessage = err.error?.message || 'Error adding agent';
          this.toastr.error(errorMessage, 'Error');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.toastr.warning('Please fill all fields correctly.', 'Error');
      this.markFormGroupTouched(this.agentForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm() {
    this.agent = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmedPassword: '',
    };
  }

  // * (Edit) Modal
  openModalEdit(id: string) {
    this.selectedAgentId = id;
    this.showModalEdit = true;
    this.isClosingEdit = false;

    this.agentForm.get('password')?.clearValidators();
    this.agentForm.get('confirmedPassword')?.clearValidators();
    this.agentForm.get('password')?.updateValueAndValidity();
    this.agentForm.get('confirmedPassword')?.updateValueAndValidity();

    this.agentForm.get('name')?.clearValidators();
    this.agentForm.get('email')?.clearValidators();
    this.agentForm.get('phone')?.clearValidators();
    this.agentForm.get('role')?.clearValidators();
    this.agentForm.get('status')?.clearValidators();

    this.agentForm
      .get('name')
      ?.setValidators([
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF0-9\s]+$/),
      ]);
    this.agentForm
      .get('email')
      ?.setValidators([
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]);
    this.agentForm
      .get('phone')
      ?.setValidators([Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)]);

    this.agentForm.get('name')?.updateValueAndValidity();
    this.agentForm.get('email')?.updateValueAndValidity();
    this.agentForm.get('phone')?.updateValueAndValidity();
    this.agentForm.get('role')?.updateValueAndValidity();
    this.agentForm.get('status')?.updateValueAndValidity();

    this.loadAgentData(id);
  }

  closeModalEdit() {
    this.isClosingEdit = true;
    setTimeout(() => {
      this.showModalEdit = false;
      this.isClosingEdit = false;
      this.agentForm.reset();
      this.selectedAgentId = null;

      this.agentForm
        .get('name')
        ?.setValidators([
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/),
        ]);
      this.agentForm
        .get('email')
        ?.setValidators([
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ]);
      this.agentForm
        .get('phone')
        ?.setValidators([Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)]);
      this.agentForm.get('role')?.setValidators([Validators.required]);
      this.agentForm.get('status')?.setValidators([Validators.required]);
      this.agentForm
        .get('password')
        ?.setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
          ),
        ]);
      this.agentForm
        .get('confirmedPassword')
        ?.setValidators([Validators.required]);

      this.agentForm.get('name')?.updateValueAndValidity();
      this.agentForm.get('email')?.updateValueAndValidity();
      this.agentForm.get('phone')?.updateValueAndValidity();
      this.agentForm.get('role')?.updateValueAndValidity();
      this.agentForm.get('status')?.updateValueAndValidity();
      this.agentForm.get('password')?.updateValueAndValidity();
      this.agentForm.get('confirmedPassword')?.updateValueAndValidity();
    }, 300);
  }

  loadAgentData(agentId: string) {
    this.isLoading = true;
    this.userService.getAgent(agentId).subscribe({
      next: (agentData) => {
        this.agentForm.patchValue({
          name: agentData.name,
          email: agentData.email,
          phone: agentData.phone,
          role: agentData.role,
          status: agentData.status,
        });
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error loading agent data';
        this.toastr.error(errorMessage, 'Error');
        this.closeModalEdit();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  editAgent() {
    if (this.selectedAgentId) {
      this.isLoading = true;

      const agentData: any = {};
      const formValues = this.agentForm.value;

      this.userService.getAgent(this.selectedAgentId).subscribe({
        next: (originalData) => {
          if (formValues.name && formValues.name !== originalData.name) {
            agentData.name = formValues.name;
          }
          if (formValues.email && formValues.email !== originalData.email) {
            agentData.email = formValues.email;
          }
          if (formValues.phone && formValues.phone !== originalData.phone) {
            agentData.phone = formValues.phone;
          }
          if (formValues.role && formValues.role !== originalData.role) {
            agentData.role = formValues.role;
          }
          if (formValues.status && formValues.status !== originalData.status) {
            agentData.status = formValues.status;
          }

          if (Object.keys(agentData).length === 0) {
            this.toastr.warning('No changes detected.', 'Warning');
            this.isLoading = false;
            return;
          }

          this.userService
            .editAgent(this.selectedAgentId!, agentData)
            .subscribe({
              next: (res) => {
                this.toastr.success('Agent updated successfully!', 'Success');
                this.closeModalEdit();
                this.fetchUsers();
              },
              error: (err) => {
                const errorMessage =
                  err.error?.message || 'Error updating agent';
                this.toastr.error(errorMessage, 'Error');
              },
              complete: () => {
                this.isLoading = false;
              },
            });
        },
        error: (err) => {
          this.toastr.error('Error loading agent data', 'Error');
          this.closeModalEdit();
          this.isLoading = false;
        },
      });
    } else {
      this.toastr.warning('Please select an agent to edit.', 'Error');
      this.markFormGroupTouched(this.agentForm);
    }
  }
}

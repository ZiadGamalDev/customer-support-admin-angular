import { Component } from '@angular/core';
import { AgentSidebarComponent } from '../sidebar/agent-sidebar/agent-sidebar.component';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { UsersService } from '../../services/users/users.service';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [AgentSidebarComponent, CommonModule, FormsModule, ToastrModule],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.css',
})
export class AgentsComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  showModal = false;
  isClosing = false;
  error = '';
  searchQuery = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  showDeleteModal = false;
  userToDelete: string | null = null;
  selectedStatus: string = 'all';

  agent = {
    name: '',
    email: '',
    password: '',
    confirmedPassword: '',
  };

  constructor(
    private userService: UsersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        console.log(res);
        
        this.filteredUsers = res;
        // this.updatePagination();
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
        (user) => user.status.toLowerCase() === this.selectedStatus.toLowerCase()
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
          this.users = this.users.filter((user) => user.id !== this.userToDelete);
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
        console.log('User approved successfully!', res);
        this.toastr.success('User approved successfully!', 'Success');
        this.fetchUsers();
      }, 
      error: (err) => {
        console.error('Error approving user', err);
        this.toastr.error('Error approving user', 'Error');
      }
    });
  }

  openModal() {
    this.showModal = true;
    this.isClosing = false;
  }

  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.showModal = false;
    }, 300);
  }

  submitAgent() {
    if (
      this.agent.name &&
      this.agent.email &&
      this.agent.password &&
      this.agent.password === this.agent.confirmedPassword
    ) {
      this.userService.addAgent(this.agent).subscribe(
        (res) => {
          console.log('Agent added successfully:', res);
          this.toastr.success('Agent added successfully!', 'Success');
          this.closeModal();
        },
        (err) => {
          console.error('Error adding agent:', err);
          this.toastr.error('Error adding agent', 'Error');
        }
      );
    } else {
      this.toastr.warning('Please fill all fields correctly.', 'Error');
    }
  }

  resetForm() {
    this.agent = {
      name: '',
      email: '',
      password: '',
      confirmedPassword: '',
    };
  }
}

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
  error = '';
  searchQuery = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  showDeleteModal = false;
  userToDelete: string | null = null;

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
        this.filteredUsers = res;
        this.updatePagination();
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

  searchUsers(): void {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = this.users;
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
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
}

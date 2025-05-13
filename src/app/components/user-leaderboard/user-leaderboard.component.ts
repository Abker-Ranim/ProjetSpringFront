import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  email: string;
  score: number;
  rank: number; // Changed from string to number to match backend DTO
  trend?: 'up' | 'down' | 'stable';
}

@Component({
  selector: 'app-user-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Add HttpClientModule
  templateUrl: './user-leaderboard.component.html',
  styleUrls: ['./user-leaderboard.component.css'],
})
export class UserLeaderboardComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  sortBy = 'score';
  sortOrder: 'asc' | 'desc' = 'desc'; // Default to desc for score (highest first)

  private apiUrl = 'http://localhost:8089/SpringMVC/api/v1/leaderboard'; // Adjust URL as needed

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLeaderboard();
  }

  fetchLeaderboard(): void {
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching leaderboard:', error);
        // Optionally handle error (e.g., show message to user)
      },
    });
  }

  applyFilters(): void {
    let result = [...this.users];

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      result = result.filter((user) =>
        user.email.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      if (this.sortBy === 'rank') {
        comparison = a.rank - b.rank;
      } else if (this.sortBy === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else if (this.sortBy === 'score') {
        comparison = a.score - b.score;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredUsers = result;
  }

  search(): void {
    this.applyFilters();
  }

  setSortBy(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = field === 'score' ? 'desc' : 'asc'; // Default desc for score
    }
    this.applyFilters();
  }

  getSortIcon(field: string): string {
    if (this.sortBy !== field) {
      return 'fa-sort';
    }
    return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }
}
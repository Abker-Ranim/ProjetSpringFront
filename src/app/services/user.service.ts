import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }}
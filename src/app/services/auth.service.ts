import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from '../../../config/config';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http:HttpClient, private router: Router) {

  }

  signIn(credentials: any) {
    return this.http.post(`${API_URI}/auth/login`, credentials);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  get(id: any): Observable<User> {
    return this.http.get<User>(`${API_URI}/auth/user/${id}`);
  }

  isLoggedIn():boolean {
    if (typeof window !== 'undefined' && !!localStorage.getItem('token')) {
      return true;
    }else{
      return false;
    }
  }
}

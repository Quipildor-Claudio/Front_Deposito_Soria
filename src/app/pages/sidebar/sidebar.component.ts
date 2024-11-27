import { Component, inject, OnInit, Pipe } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  authService = inject(AuthService);
  jwtService = inject(JwtService);
  currentUser : User;
  constructor() {
    this.currentUser =  new User();
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const userId = this.jwtService.getUserIdFromToken(token);
    this.authService.get(userId).subscribe(res=>{
      this.currentUser=res;
    });
   
  }

}

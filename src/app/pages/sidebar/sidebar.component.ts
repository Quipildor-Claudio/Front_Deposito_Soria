import { Component, inject, OnInit, Pipe } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JwtService } from '../../services/jwt.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
    this.authService.getUserTk().subscribe(res=>this.currentUser=res);
   
  }

}

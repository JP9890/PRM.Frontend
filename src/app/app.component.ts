import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PRMTool-Frontend';
  isLoggedIn = false;
  isAdmin = false;
  username = '';
  user: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.user = user;
      if (user) {
        this.username = user.username;
        this.isAdmin = user.roles?.includes('Admin');
      } else {
        this.username = '';
        this.isAdmin = false;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}

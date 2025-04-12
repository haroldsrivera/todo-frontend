import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  email = '';
  password = '';
  error = '';

  constructor(
    private todoService: TodoService,
    private authService: AuthService, 
    private router: Router
  ) {}
  
  onLogin(): void {
    this.todoService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (typeof response === 'string' && response.includes('Login exitoso')) {
          this.authService.login(); 
          this.router.navigate(['/todo']);
        } else {
          this.showToast('errorCredentials');
        }
      },
      error: () => {
        this.showToast('errorCredentials');
      }
    });
  }

  showToast(toastId: string) {
      const toastElement = document.getElementById(toastId);
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    }

}

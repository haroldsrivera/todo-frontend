import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TodoComponent } from './components/todo/todo.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'todo',
    component: TodoComponent,
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: 'login' }
];

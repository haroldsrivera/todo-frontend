import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    
    const todoServiceMock = jasmine.createSpyObj('TodoService', ['login']);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    todoServiceSpy = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login and redirect if token is valid', () => {
    const mockResponse = { token: 'mocked.token.123' };
    todoServiceSpy.login.and.returnValue(of(mockResponse));

    component.email = 'test@example.com';
    component.password = '123456';
    component.onLogin();

    expect(todoServiceSpy.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(authServiceSpy.login).toHaveBeenCalledWith('mocked.token.123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/todo']);
    expect(component.error).toBe('');
  });

  it('should show error if login returns no token', () => {
    todoServiceSpy.login.and.returnValue(of({}));

    component.email = 'wrong@example.com';
    component.password = 'wrong';
    component.onLogin();

    expect(component.error).toBe('Credenciales incorrectas.');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should handle login error response', () => {
    todoServiceSpy.login.and.returnValue(throwError(() => new Error('Unauthorized')));

    component.onLogin();

    expect(component.error).toBe('Credenciales incorrectas.');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { environment } from '../../environments/environment';
import { Todo } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const dummyTodos: Todo[] = [
    { id: 1, title: 'Tarea 1', description: 'Desc 1', date: '2025-04-13' },
    { id: 2, title: 'Tarea 2', description: 'Desc 2', date: '2025-04-14' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);

    // Simula token en localStorage para getAuthHeaders()
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', () => {
    const mockResponse = { token: 'fake-jwt-token' };
    service.login('test@example.com', '1234').subscribe(res => {
      expect(res.token).toBe('fake-jwt-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: '1234' });
    req.flush(mockResponse);
  });

  it('should retrieve all todos', () => {
    service.getAll().subscribe(todos => {
      expect(todos.length).toBe(2);
      expect(todos).toEqual(dummyTodos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(dummyTodos);
  });

  it('should retrieve a todo by id', () => {
    const id = 1;
    service.getById(id).subscribe(todo => {
      expect(todo.title).toBe('Tarea 1');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTodos[0]);
  });

  it('should create a new todo', () => {
    const newTodo: Todo = { title: 'Nueva tarea', description: 'Nueva desc', date: '2025-04-15' };

    service.create(newTodo).subscribe(todo => {
      expect(todo.title).toBe('Nueva tarea');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);
    req.flush({ ...newTodo, id: 3 });
  });

  it('should update a todo', () => {
    const updatedTodo: Todo = { id: 1, title: 'Actualizada', description: 'Modificada', date: '2025-04-16' };

    service.update(1, updatedTodo).subscribe(todo => {
      expect(todo.title).toBe('Actualizada');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTodo);
    req.flush(updatedTodo);
  });

  it('should delete a todo', () => {
    service.delete(1).subscribe(response => {
      expect(response.message).toBe('Eliminado');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Eliminado' });
  });
});

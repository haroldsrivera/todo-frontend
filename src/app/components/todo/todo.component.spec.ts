import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Todo } from '../../models/todo.model';
import { environment } from '../../../environments/environment';
import { TodoService } from '../../services/todo.service';

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
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all todos', () => {
    service.getAll().subscribe(todos => {
      expect(todos.length).toBe(2);
      expect(todos).toEqual(dummyTodos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTodos);
  });

  it('should create a new todo', () => {
    const newTodo: Todo = { title: 'Nuevo', description: 'Test', date: '2025-04-13' };

    service.create(newTodo).subscribe(todo => {
      expect(todo.title).toBe('Nuevo');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...newTodo, id: 3 });
  });

  it('should delete a todo', () => {
    const todoId = 1;

    service.delete(todoId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Eliminado' });
  });

  it('should update a todo', () => {
    const updatedTodo: Todo = { id: 1, title: 'Actualizado', description: 'Modificado', date: '2025-04-15' };

    service.update(1, updatedTodo).subscribe(todo => {
      expect(todo).toEqual(updatedTodo);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTodo);
    req.flush(updatedTodo);
  });
});

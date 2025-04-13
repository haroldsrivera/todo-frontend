import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [TodoService]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no haya peticiones pendientes
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Puedes agregar más tests para verificar el comportamiento de los métodos
  // Ejemplo de test para el método getAll
  it('getAll should return an Observable<Todo[]>', () => {
    const dummyTodos = [
      { id: 1, title: 'Todo 1', description: 'Description 1', date: '2025-04-12' },
      { id: 2, title: 'Todo 2', description: 'Description 2', date: '2025-04-12' }
    ];

    service.getAll().subscribe(todos => {
      expect(todos.length).toBe(2);
      expect(todos).toEqual(dummyTodos);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    // Responde con los datos de prueba
    req.flush(dummyTodos);
  });
});

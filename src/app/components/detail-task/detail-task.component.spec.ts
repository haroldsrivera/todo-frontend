import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailTaskComponent } from './detail-task.component';
import { Todo } from '../../models/todo.model';
import { By } from '@angular/platform-browser';

describe('DetailTaskComponent', () => {
  let component: DetailTaskComponent;
  let fixture: ComponentFixture<DetailTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTaskComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render task title, description and date correctly', () => {
    const mockTask: Todo = {
      id: 1,
      title: 'Título de prueba',
      description: 'Descripción de prueba',
      date: '2025-04-13'
    };

    component.task = mockTask;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Título de prueba');
    expect(compiled.textContent).toContain('Descripción de prueba');
    expect(compiled.textContent).toContain('2025-04-13');
  });

  it('should not throw error if task is undefined', () => {
    component.task = undefined;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display labels for title, description and date even if task is empty', () => {
    component.task = {
      title: '',
      description: '',
      date: ''
    } as Todo;

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Título:');
    expect(compiled.textContent).toContain('Descripción:');
    expect(compiled.textContent).toContain('Fecha:');
  });
});

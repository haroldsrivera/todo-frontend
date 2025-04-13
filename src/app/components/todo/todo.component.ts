import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import * as bootstrap from 'bootstrap';
import { DetailTaskComponent } from '../detail-task/detail-task.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    DetailTaskComponent,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  todo: Todo = { title: '', description: '', date: new Date().toISOString().substring(0, 10) };
  editingId: number | null = null;

  showConfirmDialog: boolean = false;
  idToDelete: number | null = null;

  selectedTask!: Todo;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
      this.todoService.getAll().subscribe(data => this.todos = data);
  }

    viewDetails(task: Todo): void {
    this.selectedTask = task;

    // Esperar al DOM para asegurarse de que el modal ya está renderizado
    setTimeout(() => {
      const modalElement = document.getElementById('taskDetailModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement, { backdrop: 'static' });
        modal.show();
      }
    }, 0);
  }
  
  save(): void {
    if (this.editingId !== null) {
      this.todoService.update(this.editingId, this.todo).subscribe((updated) => {
        const index = this.todos.findIndex(t => t.id === this.editingId);
        if (index !== -1) {
          this.todos[index] = updated; 
        }
        this.resetForm();
        this.showToast('updateToast');
      });
    } else {
      this.todoService.create(this.todo).subscribe((created) => {
        this.todos.push(created); 
        this.resetForm();
        this.showToast('successToast');
      });
    }
  }
  
  edit(task: Todo): void {
    this.todo = { ...task };
    this.editingId = task.id!;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.todo = { title: '', description: '', date: new Date().toISOString().substring(0, 10) };
    this.editingId;
  }

  confirmDelete(id: number): void {
    this.idToDelete = id;
    const modal = new bootstrap.Modal('#confirmDeleteModal');
    modal.show();
  }

  deleteConfirmed(): void {
    if (this.idToDelete !== null) {
      this.todoService.delete(this.idToDelete).subscribe(() => {
        this.loadTodos();
        this.showToast('deleteToast');
        this.idToDelete = null;

        const modalElement = document.getElementById('confirmDeleteModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
      });
    }
  }

  showToast(toastId: string) {
    const toastElement = document.getElementById(toastId);
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }
}

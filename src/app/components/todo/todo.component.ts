  import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import * as bootstrap from 'bootstrap';


@Component({
    selector: 'app-todo',
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        CalendarModule,
        DialogModule,
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './todo.component.html',
    styleUrl: './todo.component.css'
})

export class TodoComponent implements OnInit {

  todos: Todo[] = [];
  todo: Todo = { title: '', description: '', date: new Date().toISOString().substring(0, 10) };

  showConfirmDialog: boolean = false;
  idToDelete: number | null = null;

  constructor(
    private todoService: TodoService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getAll().subscribe(data => this.todos = data);
  }

  save(): void {
    this.todoService.create(this.todo).subscribe(() => {
      this.todo = { title: '', description: '', date: new Date().toISOString().substring(0, 10) };
      this.loadTodos();
      this.showToast('successToast');
    });
  }

  confirmDelete(id: number): void {
    this.idToDelete = id;
    const modalEl = document.getElementById('confirmDeleteModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  deleteConfirmed(): void {
    if (this.idToDelete !== null) {
      this.todoService.delete(this.idToDelete).subscribe(() => {
        this.loadTodos();
        this.showToast('deleteToast');
        this.idToDelete = null;
  
        const modalEl = document.getElementById('confirmDeleteModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
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

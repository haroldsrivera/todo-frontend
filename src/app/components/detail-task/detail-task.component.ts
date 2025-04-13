import { Component, Input } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-detail-task',
  imports: [],
  templateUrl: './detail-task.component.html',
  styleUrl: './detail-task.component.css'
})
export class DetailTaskComponent {
  @Input() task?: Todo;
}

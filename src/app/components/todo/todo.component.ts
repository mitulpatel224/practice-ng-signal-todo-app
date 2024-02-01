import { Component, computed, signal } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm, NgModelGroup } from '@angular/forms';

type TodoItem = {
  id: number;
  task: string;
  status: boolean;
  // timer
};

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent {
  /** Signal<TodoItem[]>: Todo list */
  public todoList = signal<TodoItem[]>([
    { id: 1, status: true, task: 'Placeholder task...' },
  ]);

  /** Computed total pending items */
  public totalPendingItems = computed(() =>
    this.todoList().filter((task) => task.status === false)
  );

  /**
   * Add new task to the Todo list
   * @param form NgForm
   * @returns void
   */
  public addTask(form: NgForm): void {
    const { valid, value } = form;

    if (!valid) return;

    const { task } = value;
    this.todoList.update((list) => [
      ...list,
      { id: list.length + 1, status: false, task },
    ]);
    form.resetForm();
  }

  /**
   * Update task status by mutating signal
   * @param index number
   * @param task TodoItem
   */
  public taskChecked(index: number, task: TodoItem): void {
    this.todoList.mutate((old) => (old[index] = task));
  }
}

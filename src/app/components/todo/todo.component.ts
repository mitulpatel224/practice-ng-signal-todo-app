import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  signal,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm, NgModelGroup } from '@angular/forms';

/**
 * Type: Todo Item 
 */
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
export class TodoComponent implements OnDestroy {
  /**
   * Signal<TodoItem[]>: Todo list
   */
  public todoList = signal<TodoItem[]>([
    { id: 1, status: true, task: 'Placeholder task...' },
  ]);

  /**
   * Computed total pending items
   * computed() executes its callback function each time when there is any changes in a signal used inside it!
   */
  public totalPendingItems = computed(() =>
    this.todoList().filter((task) => task.status === false)
  );

  /**
   * Effects to trigger any side-effect due to a signal
   * effect() executes its callback function each time when there is any changes in a signal used inside it!
   */
  private logger = effect(() => {
    console.log(
      'Pending todos:',
      this.todoList().filter((task) => task.status === false)
    );
  });

  /**
   * Add new task to the Todo list
   * @param form NgForm
   * @returns void
   */
  public addTask(form: NgForm): void {
    const { valid, value } = form;

    if (!valid) return;

    const { task } = value;
    // signal.update() creates a new instance (different reference) of value
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
    // signal.mutate() changes the existing instance (same reference) of value
    this.todoList.mutate((old) => (old[index] = task));
  }

  ngOnDestroy(): void {
    // Destroys logger effect
    this.logger.destroy();
  }
}

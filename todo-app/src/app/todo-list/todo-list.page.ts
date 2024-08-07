import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Todo, TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.page.html',
  styleUrls: ['./todo-list.page.scss'],
})
export class TodoListPage {
  todos: Todo[] = [];
  newTodo: Todo = { id: 0, title: '', description: '', completed: false };
  editingTodo: Todo | null = null;

  constructor(private todoService: TodoService, private alertController: AlertController) {
    this.loadTodos();
  }

  loadTodos() {
    this.todos = this.todoService.getTodos();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentTodoAlert(todo: Todo | null = null) {
    const isEditing = !!todo;
    const alert = await this.alertController.create({
      header: isEditing ? 'Edit To-Do' : 'New To-Do',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title',
          value: todo ? todo.title : ''
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Description',
          value: todo ? todo.description : ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.editingTodo = null;
          }
        }, {
          text: 'Save',
          handler: (data) => {
            if (isEditing && todo) {
              todo.title = data.title;
              todo.description = data.description;
              this.todoService.updateTodo({...todo});
              this.showAlert('Success', 'To-Do updated successfully');
            } else {
              const newTodo: Todo = { id: 0, title: data.title, description: data.description, completed: false };
              this.todoService.addTodo(newTodo);
              this.showAlert('Success', 'To-Do added successfully');
            }
            this.loadTodos();
          }
        }
      ]
    });

    await alert.present();
  }

  editTodo(todo: Todo) {
    this.presentTodoAlert(todo);
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id);
    this.showAlert('Deleted', 'To-Do deleted successfully');
    this.loadTodos();
  }

  toggleCompletion(todo: Todo) {
    this.todoService.toggleTodoCompletion(todo.id);
    this.loadTodos();
  }
}

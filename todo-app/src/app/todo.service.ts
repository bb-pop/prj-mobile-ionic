import { Injectable } from '@angular/core';

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = [];
  private nextId = 0;

  constructor() { 
    this.loadTodos();
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  addTodo(todo: Todo) {
    todo.id = this.nextId++;
    todo.completed = false;
    this.todos.push(todo);
    this.saveTodos();
  }

  updateTodo(updatedTodo: Todo) {
    const index = this.todos.findIndex(todo => todo.id === updatedTodo.id);
    if (index > -1) {
      this.todos[index] = updatedTodo;
      this.saveTodos();
    }
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
  }

  toggleTodoCompletion(id: number) {
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
    }
  }

  private saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  private loadTodos() {
    const todos = localStorage.getItem('todos');
    if (todos) {
      this.todos = JSON.parse(todos);
      this.nextId = this.todos.length ? Math.max(...this.todos.map(todo => todo.id)) + 1 : 0;
    }
  }
}

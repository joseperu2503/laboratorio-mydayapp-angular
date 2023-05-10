import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Todo {
  id: string,
  title: string,
  completed: boolean
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let todosStorage = localStorage.getItem('mydayapp-angular')
    if(todosStorage){
      this.todos = JSON.parse(todosStorage)
    }

    this.route.params.subscribe(params => {
      this.filter = params['filter']
      this.filterTodos()
    })
  }

  form: FormGroup = new FormGroup({
    input: new FormControl<string>('')
  })

  filter: string | null = ''
  todoEdit: number | null = null

  todos: Todo[] = []
  todosFiltered: Todo[] = []

  newTodo(){
    this.todos.push({
      id: new Date().getTime().toString(),
      title: this.form.value.input.trim(),
      completed: false
    })
    this.form.controls['input'].setValue('')
    this.setStorage()
  }

  deleteTodo(i: number){
    this.todos.splice(i, 1)
    this.setStorage()
  }

  toggleTodo(i: number){
    this.todos[i].completed = !this.todos[i].completed
    this.setStorage()
  }

  enterEditTodo(i: number){
    this.todoEdit = i
  }

  exitEditTodo(){
    this.todoEdit = null
  }


  onKeyDownTodo(event: KeyboardEvent, inputValue: string, i: number){
    if (event.code === "Escape") {
      this.exitEditTodo()
    }

    if (event.code === "Enter") {
      this.todos[i].title = inputValue.trim()
      this.setStorage()
      this.exitEditTodo()
    }
  }

  setStorage(){
    localStorage.setItem('mydayapp-angular', JSON.stringify(this.todos))
  }

  filterTodos(){
    this.todosFiltered = this.todos

    if(this.filter == 'pending'){
      this.todosFiltered = this.todos.filter(t => !t.completed)
    }

    if(this.filter == 'completed'){
      this.todosFiltered = this.todos.filter(t => t.completed)
    }
  }

  clearCompleteTodos(){
    this.todos = this.todos.filter(t => !t.completed)
    this.filterTodos()
    this.setStorage()
  }

  get pendingTodos(){
    return this.todos.filter(t => !t.completed)
  }

  get completedTodos(){
    return this.todos.filter(t => t.completed)
  }

}

//maybe composition to make them share a property pointing to the same place
//like a relational table
export class Project {
  todoList = [];
  #creationDate = new Date();
  constructor(name, description = "") {
    this.name = name;
    this.description = description;
  }

  addToProject(task) {
    this.todoList.push(task);
    console.log(
      `${this.todoList[this.todoList.length - 1].toString()} added to ${
        this.name
      }`
    );
    return task;
  }
  removeFromProject(task) {
    const taskIndex = this.findInProject(task);
    if (taskIndex !== false) {
      this.todoList.splice(taskIndex, 1);
      console.log(`${task.toString()} removed from todos`);
    } else {
      console.log(`${task.toString()} was not found in array`);
    }
    return this.todoList;
  }
  findInProject(task) {
    const index = this.todoList.indexOf(task);
    return index === -1 ? false : index;
  }

  find(property, value) {
    for (let todo of this.todoList) {
      if (todo[property] === value) {
        return todo;
      }
    }
  }
  //TODO REFACTOR TO USE FILTER INSTEAD AND DELETE FINDTODOBYID AND FINDINPROJECT
  filter(fun) {
    const returnTodos = [];
    for (let todo of this.todoList) {
      const currentTodo = todo;
      if (fun(currentTodo) === true) {
        returnTodos.push(currentTodo);
      }
    }
    return returnTodos;
  }
  toString() {
    return `Project ${
      this.name
    } contains the following todos:\n${this.listTodos()}`;
  }
  listTodos() {
    let todoListStr = "";
    for (let todo of this.todoList) {
      todoListStr += todo.toString();
      todoListStr += "\n";
    }
    return todoListStr;
  }
}
export const defaultProject = new Project("Default");

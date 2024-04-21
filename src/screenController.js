import { app } from "./app";
export class ScreenController {
  static contentDiv = document.querySelector(".content");
  static #priorityToClass = {
    1: "low-priority",
    2: "medium-priority",
    3: "high-priority",
  };
  static addProject(project) {
    const div = document.createElement("div");
    div.classList.add("project");
    div.textContent = project.name;
    return div;
  }

  static addTodo(todo) {
    const div = document.createElement("div");
    div.classList.add("todo");
    div.textContent = todo.title;
    const todoColor = ScreenController.#priorityToClass[todo.priority];
    div.dataset.todoId = todo.Id;
    // div.classList.add(todoColor);
    div.dataset.todoPriority = todo.priority;
    return div;
    //TODO Add more elements to display other status for the todo
  }
  static renderAllProjects() {
    const projectElements = [];
    app.listProjects((project) => {
      const projectDiv = ScreenController.addProject(project);
      project.listTodos((todo) => {
        const todoDiv = ScreenController.addTodo(todo);
        projectDiv.appendChild(todoDiv);
      });
      projectElements.push(projectDiv);
    });
    this.contentDiv.replaceChildren(...projectElements);
  }

  static renderFilteredTodos(func) {
    const projectElements = [];
    app.listProjects((project) => {
      const projectDiv = ScreenController.addProject(project);
      const filteredTodos = project.filter((todo) => func(todo) === true);
      for (let todo of filteredTodos) {
        const todoDiv = ScreenController.addTodo(todo);
        projectDiv.appendChild(todoDiv);
        projectElements.push(projectDiv);
      }
    });
    this.contentDiv.replaceChildren(...projectElements);
  }
}

import { app } from "./app";
export class ScreenController {
  static contentDiv = document.querySelector(".content");
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

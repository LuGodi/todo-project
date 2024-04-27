import { app } from "./app";
import { FormController } from "./FormController";
export class ScreenController {
  static contentDiv = document.querySelector(".content");
  static buttons = {
    buttonContainer: document.querySelector(".header"),
    addTodo: document.querySelector("#add-todo-button"),
    addProject: document.querySelector("#add-project-button"),
    removeProject: document.querySelector("#remove-project-button"),
  };
  static #cacheDomTodos = [];

  static initEventListeners() {
    this.buttons.buttonContainer.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        console.log(event.target.dataset);
        this.#openDialog(event.target.dataset.dialog);
      }
    });
  }
  static #openDialog(dialogTarget) {
    //error was being throw because value of this inside event listener is the window object
    FormController[dialogTarget].dialog.showModal();
    // FormController.addTodoForm.dialog.showModal();
    FormController.populateAddTodoForm();
  }
  static #emptyCacheDomTodos() {
    this.#cacheDomTodos.splice(0, this.#cacheDomTodos.length);
  }
  static #addProject(project) {
    const div = document.createElement("div");
    div.classList.add("project");
    div.textContent = project.name;
    return div;
  }

  static #addTodo(todo) {
    const div = document.createElement("div");
    div.classList.add("todo");
    const divParagraphTitle = document.createElement("p");
    const divParagraphDueDate = document.createElement("p");
    divParagraphDueDate.classList.add("duedate");
    divParagraphTitle.textContent = todo.title;
    divParagraphDueDate.textContent =
      todo.duedate === "" ? "No duedate" : todo.timeToDuedate;

    div.append(divParagraphTitle, divParagraphDueDate);
    div.dataset.todoId = todo.Id;
    div.dataset.todoPriority = todo.priority;
    const divExtraInformation =
      ScreenController.#createExpandedTodoInformation(todo);
    div.append(divExtraInformation);
    ScreenController.#cacheDomTodos.push(div);
    //TODO delegate the event listener to avoid adding a lot of listeners
    div.addEventListener("click", this.#expandTodo);
    return div;
    //TODO Add more elements to display other status for the todo
  }
  static renderAllProjects() {
    const projectElements = [];
    app.listProjects((project) => {
      const projectDiv = ScreenController.#addProject(project);
      project.listTodos((todo) => {
        const todoDiv = ScreenController.#addTodo(todo);
        projectDiv.appendChild(todoDiv);
      });
      projectElements.push(projectDiv);
    });
    this.contentDiv.replaceChildren(...projectElements);
  }

  static renderFilteredTodos(func) {
    const projectElements = [];
    app.listProjects((project) => {
      const projectDiv = ScreenController.#addProject(project);
      const filteredTodos = project.filter((todo) => func(todo) === true);
      for (let todo of filteredTodos) {
        const todoDiv = ScreenController.#addTodo(todo);
        projectDiv.appendChild(todoDiv);
        projectElements.push(projectDiv);
      }
    });
    this.contentDiv.replaceChildren(...projectElements);
  }

  static #createExpandedTodoInformation(todo) {
    const divExpanded = document.createElement("div");
    divExpanded.classList.add("hiddenDetails");
    const paragraphDescription = document.createElement("p");
    const paragraphCreationDate = document.createElement("p");
    paragraphDescription.textContent = todo.description;
    paragraphCreationDate.textContent = todo.creationTime;
    divExpanded.append(paragraphDescription, paragraphCreationDate);

    return divExpanded;
  }

  static #expandTodo(todoDatasetId) {
    console.log("click");
    console.log(this);
    const targetExtraInfo = this.lastElementChild;
    targetExtraInfo.classList.toggle("hiddenDetails");
  }
}

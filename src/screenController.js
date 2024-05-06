import { app } from "./app";
import { FormController } from "./FormController";
import { format } from "date-fns";
import deleteIcon from "../assets/delete_icon.svg";
export class ScreenController {
  static contentDiv = document.querySelector(".content");
  static dateDiv = {
    container: document.querySelector("#date"),
    weekDay: document.querySelector("#day-of-the-week"),
    monthDay: document.querySelector("#day-of-the-month"),
    month: document.querySelector("#month"),
  };

  static buttons = {
    buttonContainer: document.querySelector(".header"),
    addTodo: document.querySelector("#add-todo-button"),
    addProject: document.querySelector("#add-project-button"),
    removeProject: document.querySelector("#remove-project-button"),
  };
  static #cacheDomTodos = [];
  static init() {
    this.renderAllProjects();
    this.date();
    this.initEventListeners();
  }
  static initEventListeners() {
    this.buttons.buttonContainer.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        console.log(event.target.dataset);
        this.#openDialog(event.target.dataset.dialog);
      }
    });

    this.contentDiv.addEventListener("click", (event) => {
      if (event.target.dataset.iconAction === "delete") {
      }
    });
    // this.contentDiv.addEventListener("click", (event) => {
    //   console.log(event.target);
    //   if (event.target.dataset.iconAction !== undefined) {
    //     console.log(event.target.dataset.iconAction);
    //     this[event.target.dataset.iconAction + "Todo"](
    //       event.target.parentElement.parentElement.parentElement.dataset.todoId
    //     );
    //   }
    // });
  }
  static date() {
    const today = new Date();
    this.dateDiv.weekDay.textContent = format(today, "EEEE");
    this.dateDiv.month.textContent = format(today, "MMMM");
    this.dateDiv.monthDay.textContent = format(today, "d");
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
  static #addProject(project, projectIndex) {
    const div = document.createElement("div");
    div.classList.add("project");
    console.log(project);
    div.dataset.projectIndex = projectIndex;
    const span = document.createElement("span");
    span.classList.add("project-header");
    span.textContent = project.name;
    span.append(this.#addProjectOptions());
    div.append(span);
    div.addEventListener("click", this.#projectEventListeners);
    return div;
  }

  static #projectEventListeners(event) {
    console.log(this);
    console.log(event.target);
    console.log(event.target.dataset.iconAction === "delete-project");
    if (event.target.dataset.iconAction === "delete-project") {
      console.log("delete project");
      app.deleteProject(event.target.dataset.projectIndex);
      ScreenController.renderAllProjects();
    }
  }

  static #addTodo(todo) {
    const div = document.createElement("div");
    div.classList.add("todo");
    const expandIcon = this.#addSvgIcon("expand_more");
    expandIcon.dataset.iconAction = "expand";
    const checkCompleted = document.createElement("div");
    const checkCompletedInput = document.createElement("input");
    checkCompletedInput.type = "checkbox";
    checkCompletedInput.checked = todo.completed;
    checkCompletedInput.dataset.iconAction = "toggleCompleted";
    checkCompleted.append(checkCompletedInput);
    const divHeader = document.createElement("div");
    divHeader.classList.add("todo-header");
    const spanTaskName = document.createElement("span");
    spanTaskName.classList.add("todo-title");
    divHeader.append(
      expandIcon,
      checkCompleted,
      spanTaskName,
      this.#addTodoOptions()
    );
    const divParagraphDueDate = document.createElement("p");
    divParagraphDueDate.classList.add("duedate");
    spanTaskName.textContent = todo.title;
    divParagraphDueDate.textContent =
      todo.duedate === "" ? "---- ----" : todo.timeToDuedate;

    div.append(divHeader, divParagraphDueDate);
    div.dataset.todoId = todo.Id;
    div.dataset.todoPriority = todo.priority;
    const divExtraInformation =
      ScreenController.#createExpandedTodoInformation(todo);
    div.append(divExtraInformation);
    ScreenController.#cacheDomTodos.push(div);
    //TODO delegate the event listener to avoid adding a lot of listeners
    div.addEventListener("click", (event) => {
      this.#todoEventListeners(event, divExtraInformation);
    });
    return div;
    //TODO Add more elements to display other status for the todo
  }

  static #todoEventListeners(event, divExtraInformation) {
    console.log(this);
    if (event.target.dataset.iconAction !== undefined) {
      ScreenController[event.target.dataset.iconAction + "Todo"](
        event,
        event.currentTarget.dataset.todoId,
        divExtraInformation
      );
      // else if (event.target.)
      return;
    }
    // if (!ScreenController.#checkIfInEditMode(this)) {
    //   ScreenController.expandTodo(event);
    // }
  }

  //Todo remove checkIfInEditMode and place add icon for expanding instead of the whole div
  static toggleCompletedTodo(event, todoId) {
    app.findAndToggleCompletedTodo(todoId);
  }
  static #checkIfInEditMode(todoDiv) {
    if (todoDiv.classList.contains("edit-todo")) {
      console.log("todo div is in edition mode");
      return true;
    }
    return false;
  }

  static #addTodoOptions() {
    const div = document.createElement("div");
    div.classList.add("todo-options");
    div.append(this.#addSvgIcon("edit"), this.#addSvgIcon("delete"));
    return div;
  }
  static #addProjectOptions() {
    const div = document.createElement("div");
    div.classList.add("project-options");
    div.append(this.#addSvgIcon("delete", "delete-project"));
    return div;
  }

  static editTodo(event, todoIdentifierNum) {
    const targetDiv = event.currentTarget;
    targetDiv.classList.add("edit-todo");
    FormController.populateEditTodoForm(+todoIdentifierNum, targetDiv);
    console.log(event.currentTarget);
  }
  static deleteTodo(event, todoIdentifierNum) {
    console.log(`called deleteTodo on Todo id ${todoIdentifierNum}`);
    app.findAndDeleteTodo(+todoIdentifierNum);
    this.renderAllProjects();
  }

  static #addSvgIcon(iconText, iconAction, todoId) {
    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.textContent = iconText;
    icon.dataset.iconAction = iconAction ?? iconText;
    return icon;
  }
  static renderAllProjects() {
    const projectElements = [];
    app.listProjects((project, projectIndex) => {
      console.log(project);
      const projectDiv = ScreenController.#addProject(project, projectIndex);
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
    divExpanded.classList.add("expanded-information");
    const paragraphDescription = document.createElement("p");
    paragraphDescription.classList.add("description");
    const paragraphCreationDate = document.createElement("p");
    paragraphCreationDate.classList.add("creation-date");
    paragraphDescription.textContent = todo.description;
    paragraphCreationDate.textContent = todo.creationTime;
    divExpanded.append(paragraphDescription, paragraphCreationDate);

    return divExpanded;
  }

  static expandTodo(event, todoId, divExtraInformation) {
    console.log("click");
    console.log(event.currentTarget);
    const targetExtraInfo = divExtraInformation;
    targetExtraInfo.classList.toggle("hiddenDetails");
  }
}

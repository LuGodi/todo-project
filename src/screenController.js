import { app } from "./app";
export class ScreenController {
  static contentDiv = document.querySelector(".content");
  static buttons = {
    addTodo: document.querySelector("#add-todo-button"),
    addProject: document.querySelector("#add-project-button"),
    removeProject: document.querySelector("#remove-project-button"),
  };
  static #cacheDomTodos = [];
  static formCache = {
    projectSelect: document.querySelector("select#parent-project"),
    dialog: document.querySelector("#add-todo-form"),
    inputRadio: {
      "new-project-radio": document.querySelector("#new-project-radio"),
      "existing-project-radio": document.querySelector(
        "#existing-project-radio"
      ),
    },
  };
  static initEventListeners() {
    this.buttons.addTodo.addEventListener("click", (event) => {
      this.#openDialog();
    });
  }
  static #emptyCacheDomTodos() {
    this.#cacheDomTodos.splice(0, this.#cacheDomTodos.length);
  }
  static addProject(project) {
    const div = document.createElement("div");
    div.classList.add("project");
    div.textContent = project.name;
    return div;
  }

  static addTodo(todo) {
    const div = document.createElement("div");
    div.classList.add("todo");
    const divParagraphTitle = document.createElement("p");
    const divParagraphDueDate = document.createElement("p");
    divParagraphTitle.textContent = todo.title;
    divParagraphDueDate.textContent = todo.duedate;

    div.append(divParagraphTitle, divParagraphDueDate);
    div.dataset.todoId = todo.Id;
    div.dataset.todoPriority = todo.priority;
    const divExtraInformation =
      ScreenController.#createExpandedTodoInformation(todo);
    div.append(divExtraInformation);
    ScreenController.#cacheDomTodos.push(div);
    div.addEventListener("click", this.#expandTodo);
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

  static #openDialog() {
    console.log("click");
    //error was being throw because value of this inside event listener is the window object
    this.formCache.dialog.showModal();
    this.#populateForm();
  }
  static #populateForm() {
    const projectSelect = ScreenController.formCache.projectSelect;
    const optionsToAdd = [];
    app.listProjects((project) => {
      const selectOption = document.createElement("option");
      selectOption.value = project.name;
      selectOption.textContent = project.name;
      optionsToAdd.push(selectOption);
    });
    console.log(optionsToAdd);
    projectSelect.replaceChildren(...optionsToAdd);
  }
  //TODO add form logic for new project or not
  static readForm() {
    if (this.formCache.inputRadio["new-project-radio"].checked === true)
      console.log("the user wants a new project ");
  }
  //   static #renderAddTodoForm {
  //     const nameInput = document.createElement("input")
  //     const priorityInput = document.createElement("")
  //   }
}

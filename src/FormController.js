import { app } from "./app";
import { ScreenController } from "./screenController";
import { isPast, format } from "date-fns";
export class FormController {
  static forms = document.forms;
  static addProjectForm = {
    dialog: document.querySelector("#add-project-dialog"),
  };
  static addTodoForm = {
    dialog: document.querySelector("#add-todo-dialog"),
    formElement: document.querySelector("#add-todo-form"),
    projectFieldset: document.querySelector("#project-fieldset"),
    duedate: document.querySelector("#duedate"),
    addNewProject: {
      radio: document.querySelector("#new-project-radio"),
      textInput: document.querySelector("#new-project-input-name"),
    },
    addExistingProject: {
      radio: document.querySelector("#existing-project-radio"),
      selectInput: document.querySelector("#parent-project"),
    },
    // submitBtn: document.querySelector("#submit-button"),
    // closeBtn: document.querySelector("#close-dialog-button"),
  };

  static formEventListeners() {
    for (let form of this.forms) {
      form.addEventListener("submit", (event) => {
        this.#readForm(event.target);

        event.target.reset();
        return;
      });
    }

    //now I need the events to delegate to the project field to avoid two event listeners calling the same function
    this.addTodoForm.projectFieldset.addEventListener("change", (event) => {
      if (event.target.tagName === "INPUT") {
        this.#checkNewProject();
      }
    });
    this.addTodoForm.duedate.addEventListener("change", (event) => {
      console.log(event.target);
      this.#checkValidDuedate();
    });
  }
  static #readForm(formElement, todo) {
    const formData = new FormData(formElement);

    if (formElement === this.addTodoForm.formElement) {
      console.log(formData.has("duedate"));
      app.addNewTodo({
        title: formData.get("task-name"),
        description: formData.get("description"),
        duedate:
          formData.get("duedate") === ""
            ? false
            : new Date(formData.get("duedate")),
        priority: formData.get("priority"),
        projectName:
          formData.get("project-selection") === "existing"
            ? formData.get("parent-project")
            : formData.get("new-project-name"),
      });
      //TODO Add new project
    } else if (formElement === this.forms["add-project-form"]) {
      app.addNewProject(formData.get("project-name"));
    } else if (formElement.dataset.action === "updateTodo") {
      for (let [key, value] of formData) {
        console.log(key, value);
        // console.log(formElement.dataset);
        app[formElement.dataset.action](todo, key, value);
      }
    }
    //I dont think this is supposed to be here, but I moved it from the forms listeners since any reading of the form will have to result in the rendering of the screen
    ScreenController.renderAllProjects();
  }
  static #checkValidDuedate() {
    return isPast(this.addTodoForm.duedate);
  }
  static #checkNewProject() {
    if (this.addTodoForm.addNewProject.radio.checked === true) {
      console.log("user wants a new project");
      this.addTodoForm.addNewProject.textInput.setAttribute("required", "");
      this.addTodoForm.addExistingProject.selectInput.setAttribute(
        "disabled",
        ""
      );
      this.addTodoForm.addNewProject.textInput.removeAttribute("disabled");
    } else if (this.addTodoForm.addExistingProject.radio.checked === true) {
      this.addTodoForm.addNewProject.textInput.setAttribute("disabled", "true");
      this.addTodoForm.addExistingProject.selectInput.removeAttribute(
        "disabled"
      );
    }
  }

  static populateAddTodoForm(dataAttribute) {
    this.#populateExistingProjects(
      this.addTodoForm.addExistingProject.selectInput
    );
    this.#setMinValidDuedate(this.addTodoForm.duedate);
  }

  static populateEditTodoForm(todoId, targetTodoDiv) {
    const targetTodo = app.findTodoById(+todoId);
    const targetDiv = targetTodoDiv;
    const form = document.createElement("form");
    form.classList.add("edit-todo-form");
    form.dataset.action = "updateTodo";
    const heading = document.createElement("h3");
    heading.textContent = "Edit Todo Form";

    const formElements = [];
    const divTitle = this.#createLabelInputPair(
      "edit-title",
      "title",
      "Name",
      "text",
      targetTodo.title
    );
    formElements.push(divTitle);

    const divDescription = this.#createLabelInputPair(
      "edit-description",
      "description",
      "Description",
      "textarea",
      targetTodo.description
    );
    formElements.push(divDescription);

    const divDueDate = this.#createLabelInputPair(
      "edit-duedate",
      "duedate",
      "Set Duedate",
      "date",
      targetTodo.duedate === "" ? "" : format(targetTodo.duedate, "yyyy-MM-dd")
    );
    console.log(targetTodo.duedate);
    const selectProject = this.#createLabelInputPair(
      "edit-project",
      "moveProject",
      "Move to project",
      "select",
      targetTodo.parentProject
    );

    const selectPriority = this.#createLabelInputPair(
      "edit-priority",
      "priority",
      "Priority",
      "number",
      targetTodo.priority
    );
    selectPriority.lastElementChild.setAttribute("min", 1);
    selectPriority.lastElementChild.setAttribute("max", 3);
    selectPriority.lastElementChild.setAttribute("value", targetTodo.priority);

    const submitCloseBtnContainer = document.createElement("div");
    submitCloseBtnContainer.classList.add("submit-close-button-container");
    const submitBtn = document.createElement("button");
    submitBtn.dataset.action = "submit";
    submitBtn.textContent = "Edit";
    const closeBtn = document.createElement("button");
    closeBtn.dataset.action = "close";
    closeBtn.textContent = "Cancel";
    submitCloseBtnContainer.append(submitBtn, closeBtn);

    form.append(
      divTitle,
      divDescription,
      divDueDate,
      selectProject,
      selectPriority,
      submitCloseBtnContainer
    );
    form.addEventListener("submit", (event) => {
      this.#readForm(event.currentTarget, targetTodo);
      event.preventDefault();
    });
    targetDiv.replaceChildren(heading, form);
  }
  static #createLabelInputPair(
    idAttribute,
    nameAttribute,
    labelText,
    inputType,
    inputOldValue
  ) {
    const div = document.createElement("div");
    let input;
    if (inputType === "select") {
      input = document.createElement("select");
      this.#populateExistingProjects(input);
    } else {
      input = document.createElement("input");
      input.type = inputType;
    }
    const label = document.createElement("label");
    input.id = idAttribute;
    input.value = inputOldValue;
    input.setAttribute("name", nameAttribute);
    label.setAttribute("for", idAttribute);
    label.textContent = labelText;
    if (inputType === "date") {
      this.#setMinValidDuedate(input);
    }

    div.append(label, input);
    div.classList.add("label-input-container");
    return div;
  }

  //Todo change from adding element option to use the add method of the htmlselectelement api
  static #populateExistingProjects(selectInput) {
    const projectSelect = selectInput;
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
  static #setMinValidDuedate(duedateInput) {
    duedateInput.setAttribute("min", format(Date(), "yyyy-MM-dd"));
  }
}

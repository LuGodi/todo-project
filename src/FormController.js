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
        ScreenController.renderAllProjects();
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
  static #readForm(formElement) {
    const formData = new FormData(formElement);
    for (let data of formData) {
      console.log(data);
    }

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
    }
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
    this.#populateExistingProjects();
    this.#setMinValidDuedate(this.addTodoForm.duedate);
  }

  static populateEditTodoForm(todoId, targetTodoDiv) {
    const targetTodo = app.findTodoById(+todoId);
    const targetDiv = targetTodoDiv;
    const form = document.createElement("form");

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
      targetTodo.duedate
    );

    form.append(divTitle, divDescription, divDueDate);
    targetDiv.replaceChildren(form);
  }
  static #createLabelInputPair(
    idAttribute,
    nameAttribute,
    labelText,
    inputType,
    inputOldValue
  ) {
    const div = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");
    input.id = idAttribute;
    input.type = inputType;
    input.value = inputOldValue;
    input.setAttribute("name", nameAttribute);
    label.setAttribute("for", idAttribute);
    label.textContent = labelText;
    if (inputType === "date") {
      this.#setMinValidDuedate(input);
    }

    div.append(label, input);
    return div;
  }
  static #populateExistingProjects() {
    const projectSelect = this.addTodoForm.addExistingProject.selectInput;
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

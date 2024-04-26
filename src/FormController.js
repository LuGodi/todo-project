import { app } from "./app";
import { ScreenController } from "./screenController";
export class FormController {
  static forms = document.forms;
  static addProjectForm = {
    dialog: document.querySelector("#add-project-dialog"),
  };
  static addTodoForm = {
    dialog: document.querySelector("#add-todo-dialog"),
    formElement: document.querySelector("#add-todo-form"),
    projectFieldset: document.querySelector("#project-fieldset"),
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

    this.addTodoForm.dialog.addEventListener("click", (event) => {
      if (event.target.dataset.action === "close") {
        this.addTodoForm.dialog.close();
        return;
      }
    });
    // this.addTodoForm.formElement.addEventListener("submit", (event) => {
    //   console.log(event.type);
    //   console.log(event.target);
    //   this.readForm(event.target);
    //   console.log("clicked submit");
    //   ScreenController.renderAllProjects();
    //   event.target.reset();
    //   return;
    // });
    //now I need the events to delegate to the project field to avoid two event listeners calling the same function
    this.addTodoForm.projectFieldset.addEventListener("change", (event) => {
      if (event.target.tagName === "INPUT") {
        this.#checkNewProject();
      }
    });
  }
  static #readForm(formElement) {
    const formData = new FormData(formElement);

    if (formElement === this.addTodoForm.formElement) {
      console.log(typeof formData.get("duedate"));
      app.addNewTodo({
        title: formData.get("task-name"),
        description: formData.get("description"),
        duedate: formData.get("duedate"),
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
}

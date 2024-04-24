import { app } from "./app";
export class FormController {
  static addTodoForm = {
    dialog: document.querySelector("#add-todo-form"),
    projectFieldset: document.querySelector("#project-fieldset"),
    addNewProject: {
      radio: document.querySelector("#new-project-radio"),
      textInput: document.querySelector("#new-project-input-name"),
    },
    addExistingProject: {
      radio: document.querySelector("#existing-project-radio"),
      selectInput: document.querySelector("#parent-project"),
    },
    submitBtn: document.querySelector("#submit-button"),
    closeBtn: document.querySelector("#close-dialog-button"),
  };

  static formEventListeners() {
    this.addTodoForm.submitBtn.addEventListener("click", (event) => {
      this.readAddTodoForm();
      console.log("clicked submit");
    });
    //now I need the events to delegate to the project field to avoid two event listeners calling the same function
    this.addTodoForm.projectFieldset.addEventListener("change", (event) => {
      if (event.target.tagName === "INPUT") {
        this.#checkNewProject();
      }
    });
  }
  static readAddTodoForm() {
    this.#checkNewProject();
  }
  static #checkNewProject() {
    if (this.addTodoForm.addNewProject.radio.checked === true) {
      console.log("user wants a new project");
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
  //   static #openDialog() {
  //     console.log("click");
  //     //error was being throw because value of this inside event listener is the window object
  //     this.formCache.addTodoForm.dialog.showModal();
  //     this.#populateAddTodoForm();
  //   }
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

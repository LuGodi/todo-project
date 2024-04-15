export class Project {
  #todos = [];
  #creationDate = new Date();
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  addToProject(task) {
    this.#todos.push(task);
    console.log(`${this.#todos[length - 1]} added to project`);
    return this.#todos;
  }
  removeFromProject(task) {
    if (this.#todos.includes(task)) {
      const indexToRemove = this.#todos.indexOf(task);
      this.#todos.splice(indexToRemove, 1);
      console.log(task, " removed from todos");
    } else {
      console.log(`${task} was not found in array`);
    }
    return this.#todos;
  }
}
export const defaultProject = new Project("Default");

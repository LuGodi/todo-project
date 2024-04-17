//maybe composition to make them share a property pointing to the same place
//like a relational table
export class Project {
  #todos = [];
  #creationDate = new Date();
  constructor(name, description = "") {
    this.name = name;
    this.description = description;
  }

  addToProject(task) {
    this.#todos.push(task);
    console.log(
      `${this.#todos[
        this.#todos.length - 1
      ].toString()} added to ${this.toString()}`
    );
    return this.#todos;
  }
  removeFromProject(task) {
    const taskIndex = this.findInProject(task);
    if (taskIndex !== false) {
      this.#todos.splice(taskIndex, 1);
      console.log(task, " removed from todos");
    } else {
      console.log(`${task} was not found in array`);
    }
    return this.#todos;
  }
  findInProject(task) {
    const index = this.#todos.indexOf(task);
    return index === -1 ? index : false;
  }
  toString() {
    return `Project ${this.name}`;
  }
}
export const defaultProject = new Project("Default");

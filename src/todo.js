//should the error handling part be here or in a separate form validation function

export class Todo {
  #creationDate = new Date();
  #completed = false;

  //TODO this isnt supposed to be here I think
  static #priorityToFlag = {
    1: "low-priority",
    2: "medium-priority",
    3: "high-priority",
  };
  static todoIdControl = 0;

  constructor(
    title,
    description = "",
    duedate = false,
    priority = 1,
    parentProject
  ) {
    if (priority > 3 || priority < 1) throw new Error("invalid priority");
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.priority = priority;
    this.parentProject = parentProject;
    this.Id = Todo.todoIdControl++;

    //priorities will be low medium high, add a check condition
  }
  get colorClass() {
    return Todo.#priorityToFlag[this.priority];
  }
  get creationTime() {
    //add here the date-fns
    return this.#creationDate;
  }
  set completed(flag) {
    if (flag === true) console.log(`task ${this.title} completed`);
    this.#completed = flag;
  }
  get completed() {
    return this.#completed;
  }

  toString() {
    return `A todo titled - ${this.title} -, id ${this.Id}, duedate set to ${
      this.duedate === false ? "None" : this.duedate
    }, with priority ${this.priority} created at ${this.creationTime}`;
  }
}

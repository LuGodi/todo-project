//should the error handling part be here or in a separate form validation function

export class Todo {
  #creationDate = new Date();
  #completed = false;
  constructor(title, description = "", duedate = false, priority = 1) {
    if (priority > 3 || priority < 1) throw new Error("invalid priority");
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.priority = priority;

    //priorities will be low medium high, add a check condition
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
}

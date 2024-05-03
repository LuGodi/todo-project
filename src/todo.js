//should the error handling part be here or in a separate form validation function
import { formatRelative, formatDistanceToNow } from "date-fns";
export class Todo {
  #creationDate = new Date();
  completed = false;

  static todoIdControl = 0;

  constructor(
    title,
    description = "",
    duedate = "",
    priority = 1,
    parentProject
  ) {
    if (priority > 3 || priority < 1) throw new Error("invalid priority");
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.todoPriority = priority;
    this.parentProject = parentProject;
    this.Id = Todo.todoIdControl++;

    //priorities will be low medium high, add a check condition
  }

  set priority(newpriority) {
    if (newpriority > 3 || newpriority < 1) {
      throw new Error("priority must be 1 2 or 3");
      return;
    }
    const oldPriority = this.todoPriority;
    this.todoPriority = newpriority;
    console.log(
      `Todo ${this.title} priority changed from ${oldPriority} to ${this.priority}`
    );
    return this;
  }
  get priority() {
    return this.todoPriority;
  }
  get creationTime() {
    //add here the date-fns
    const relativeTime = formatRelative(this.#creationDate, Date());
    return relativeTime;
  }
  get timeToDuedate() {
    if (this.duedate === "" || this.duedate === false) {
      return;
    }
    const timeToDuedate = formatDistanceToNow(this.duedate, {
      addSuffix: true,
    });
    console.log(timeToDuedate);
    return timeToDuedate;
  }
  // set completed(flag) {
  //   if (flag === true) console.log(`task ${this.title} completed`);
  //   this.#completed = flag;
  // }
  // get completed() {
  //   return this.#completed;
  // }

  toString() {
    return `A todo titled - ${this.title} -, id ${this.Id}, duedate set to ${
      this.duedate === false || this.duedate === "" ? "None" : this.duedate
    }, with priority ${this.priority} created at ${this.creationTime}`;
  }

  todoEntries() {}
}

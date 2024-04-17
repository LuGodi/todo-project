import { Todo } from "./todo";
import { app } from "./app";

const screenController = {
  spanDiv: document.getElementById("main"),
  log(msg) {
    const p = document.createElement("p");
    p.textContent = msg;
    this.spanDiv.appendChild(p);
  },
};

const mock = {
  task1: {
    title: "dishes",
    description: "do the dishes",
    duedate: "12-03-2024",
    priority: 3,
  },
  task2: {
    title: "study",
    description: "math today",
    duedate: "15-03-2024",
    priority: 1,
  },
  task3: {
    title: "walk dog",
    description: "",
    duedate: "",
    priority: 2,
    projectName: "Home",
  },
};
// screenController.log("hi");
app.addNewTodo(mock.task1);
app.addNewTodo(mock.task2);
app.addNewTodo(mock.task3);
app.listProjects();
const todoToMove = app.projects[0];
console.log(todoToMove);

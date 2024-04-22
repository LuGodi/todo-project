import { Todo } from "./todo";
import { app } from "./app";
import { ScreenController } from "./screenController";
import "./style.css";

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
    description: "boo",
    duedate: "20/02/2021",
    priority: 2,
    projectName: "Home",
  },
};
app.addNewTodo(mock.task1);
app.addNewTodo(mock.task2);
app.addNewTodo(mock.task3);
console.log("list projects:");
app.listProjects((project) => console.log(project.toString()));
console.log("testing the list todos");

ScreenController.renderAllProjects();
ScreenController.initEventListeners();

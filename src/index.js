import { Todo } from "./todo";
import { app } from "./app";
import { FormController } from "./FormController";
import { ScreenController } from "./screenController";
import "./style.css";

const mock = {
  task1: {
    title: "dishes",
    description: "do the dishes",

    priority: 3,
  },
  task2: {
    title: "study",
    description: "math today",

    priority: 1,
  },
  task3: {
    title: "walk dog",
    description: "boo",

    priority: 2,
    projectName: "Home",
  },
};
app.addNewTodo(mock.task1);
app.addNewTodo(mock.task2);
app.addNewTodo(mock.task3);
app.findAndToggleCompletedTodo(1);
console.log("list projects:");
app.listProjects((project) => console.log(project.toString()));
console.log(app.projects);
console.log("testing the list todos");
console.log(app.findTodoById(0));

app.init();
console.log(FormController.forms);

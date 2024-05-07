import { Todo } from "./todo";
import { app } from "./app";
import { Project } from "./project";
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
    project: { type: "name", projectName: "Home" },
  },
};

app.init();
const myTodo = app.addNewTodo(mock.task1);
app.addNewTodo(mock.task2);
app.addNewTodo(mock.task3);
app.findAndToggleCompletedTodo(1);
console.log("list projects:");
app.listProjects((project) => console.log(project.toString()));
console.log(app.projects);
console.log("testing the list todos");
console.log(app.findTodoById(0));
ScreenController.renderAllProjects();
console.log(FormController.forms);
app.saveData();

const savedTodo = myTodo.saveTodo();

console.log(savedTodo);
const loadedTodo = Todo.loadTodo(savedTodo);
app.projects[0].addToProject(loadedTodo);
console.log(app.projects);

const savedProjectData = app.projects[1].saveProject();
const ProjectDataParsed = Project.loadProject(savedProjectData);

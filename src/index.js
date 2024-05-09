import { Todo } from "./todo";
import { app } from "./app";
import { Project } from "./project";
import { FormController } from "./FormController";
import { ScreenController } from "./screenController";
import "./style.css";

app.init();

ScreenController.renderAllProjects();

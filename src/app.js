import { defaultProject } from "./project";
import { Todo } from "./todo";
import { Project } from "./project";
class App {
  projects = [defaultProject];
  addNewTodo({
    title,
    description,
    duedate,
    priority,
    projectName = "Default",
  }) {
    //leverage destructuring assignment
    const newTodo = new Todo(title, description, duedate, priority);
    const project = this.findProject(projectName);
    //Need to figure out better how I want the client to be able to input the project
    //will default always be the choice? Should I warn them when I create a new project?
    //atm this functions is making three things, two reasons of change:
    //its adding a todo
    //its looking if a given project exists
    //and if not its creating one
    //TODO
    if (project === false) {
      const newProject = this.addNewProject(projectName);
      newProject.addToProject(newTodo);
    } else {
      project.addToProject(newTodo);
    }
  }

  completeTodo(todo) {
    todo.completed = true;
  }
  deleteTodo(todo, project) {
    project.removeFromProject(todo);
  }
  addNewProject(name, description) {
    const newProject = new Project(name, description);
    this.projects.push(newProject);
    return newProject;
  }
  findProject(projectName) {
    for (let project of this.projects) {
      console.log(project);
      if (project.name === projectName) {
        return project;
      }
    }
    return false;
  }
  findInProjects(todo) {
    const foundIndices = [];
    for (let project of this.projects) {
      if (project.findInProject(todo) !== false) {
        foundIndices.push({
          project: project,
          taskIndex: project.findInProject(todo),
        });
      }
    }

    return foundIndices;
  }
  listProjects() {
    for (let project of this.projects) {
      console.log(project);
    }
  }
}

const app = new App();
export { app };

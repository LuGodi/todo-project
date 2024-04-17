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
    const project = this.findProject(projectName);
    //Need to figure out better how I want the client to be able to input the project
    //will default always be the choice? Should I warn them when I create a new project?
    //atm this functions is making three things, two reasons of change:
    //its adding a todo
    //its looking if a given project exists
    //and if not its creating one
    //TODO
    if (project === false) {
      const newProjectId = this.addNewProject(projectName);
      this.projects[newProjectId].addToProject(
        new Todo(title, description, duedate, priority, newProjectId)
      );
    } else {
      const [projectIndex, projectObj] = project;
      projectObj.addToProject(
        new Todo(title, description, duedate, priority, projectIndex)
      );
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
    return this.projects.push(newProject) - 1;
    // return newProject;
  }
  findProject(projectName) {
    for (let [projectIndex, project] of this.projects.entries()) {
      console.log(project);
      if (project.name === projectName) {
        return [projectIndex, project];
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
  moveTodo(todo, targetProjectName) {
    //I need to remove the todo from the project that it is in
    const projectId = todo.projectId;
    const targetProject = this.projects[projectId];
    console.log(projectId);

    targetProject.removeFromProject(todo);
    //I need to remove the todo.projectId
    todo.projectId = null;

    //I need to add the todo to the new project
    //will i receive project id or project name?
    const [targetProjectId, targetProjectObj] =
      this.projects.findProject(targetProjectName);
    targetProjectObj.addToProject(todo);
    //I need to update the todo.projectId
    todo.projectId = targetProjectId;

    return targetProjectObj.listTodos();
  }
  listProjects() {
    for (let project of this.projects) {
      console.log(project.toString());
    }
  }
}

const app = new App();
export { app };

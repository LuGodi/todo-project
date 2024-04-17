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
      const newProject = this.addNewProject(projectName);
      newProject.addToProject(
        new Todo(title, description, duedate, priority, newProject)
      );
    } else {
      const [projectIndex, projectObj] = project;
      projectObj.addToProject(
        new Todo(title, description, duedate, priority, projectObj)
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
    this.projects.push(newProject);
    return newProject;
    // return newProject;
  }
  findProject(projectName) {
    for (let [projectIndex, project] of this.projects.entries()) {
      //   console.log(project);
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
  findTodoById(todoId) {
    for (const project of this.projects) {
      const todo = project.find("Id", todoId);
      if (todo instanceof Todo) return todo;
    }
    console.log(`todo id ${todoId} not found`);
  }
  moveTodo(todo, newProjectName) {
    const currentProject = todo.parentProject;
    currentProject.removeFromProject(todo);
    todo.parentProject = null;
    const [targetProjectId, targetProjectObj] =
      this.findProject(newProjectName);
    targetProjectObj.addToProject(todo);
    todo.parentProject = targetProjectObj;

    return targetProjectObj.listTodos();
  }
  //TODO i want to add a function to be applied to each project
  listProjects() {
    for (let project of this.projects) {
      console.log(project.toString());
    }
  }
}

const app = new App();
export { app };

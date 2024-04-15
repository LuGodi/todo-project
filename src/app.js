import { defaultProject } from "./project";
import { Todo } from "./todo";
class App {
  projects = [];
  addNewTodo(
    { title, description, duedate, priority },
    project = defaultProject
  ) {
    //its an object to leverage destructuring assignment
    const newTodo = new Todo(title, description, duedate, priority);
    project.addToProject(newTodo);
  }

  completeTodo(todo) {
    todo.completed = true;
  }
  deleteTodo(todo, project) {
    project.removeFromProject(todo);
  }

  findInProjects(todo) {
    const foundIndices = [];
    for (project of projects) {
      if (project.findInProject(todo) !== false) {
        foundIndices.push({
          project: project,
          taskIndex: project.findInProject(todo),
        });
      }
    }

    return foundIndices;
  }
}

const app = new App();
export { app };

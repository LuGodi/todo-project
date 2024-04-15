import { defaultProject } from "./project";
import { Todo } from "./todo";
class App {
  addNewTodo(
    { title, description, duedate, priority },
    project = defaultProject
  ) {
    //its an object to leverage destructuring assignment
    const newTodo = new Todo({ title, description, duedate, priority });
    project.addToProject(new Todo());
  }
}

const app = new App();
export { app };

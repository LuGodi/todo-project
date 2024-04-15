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
screenController.log("hi");
app.addNewTodo({
  title: "dishes",
  description: "do the dishes",
  duedate: "12-03-2024",
  priority: 3,
});

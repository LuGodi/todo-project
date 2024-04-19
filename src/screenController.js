class ScreenController {
  static contentDiv = document.querySelector(".content");
  static addProject(project) {
    const div = document.createElement("div");
    div.classList.add("project");
    this.contentDiv.appendChild(div);
  }
}

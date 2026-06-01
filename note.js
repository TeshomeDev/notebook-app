
const noteEditor = document.querySelector(".note-editor");
const editButton = document.querySelector(".edit-button");

let isEditMode = false;

editButton.addEventListener("click", (e) => {

  e.stopPropagation();
  isEditMode = true;
  noteEditor.setAttribute("contenteditable", "true");
});

const lock = document.querySelector(".disable-editor-button");
lock.addEventListener("click", () => {
    noteEditor.setAttribute("contenteditable", "false");
    isEditMode = false;
});


const sidebar = document.querySelector(".sidebar");
const menu = document.querySelector(".menu");

menu.addEventListener("click", ()=> {
  sidebar.classList.toggle("is-menu-open");
});












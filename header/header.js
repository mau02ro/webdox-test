const landing_header = document.getElementById("landing_header");
const header_openMenu = document.getElementById("header_openMenu");
const header_container = document.getElementById("header_container");

const options_titleSublist = document.getElementById("options_titleSublist");
const options_subList = document.getElementById("options_subList");

// ---------------------------------------
// Menu
// ---------------------------------------
const CLASS_OPEN = "open_menu";
const CLASS_CLOSE = "close_menu";

function header_menuController(){
  if(!landing_header.classList.contains(CLASS_OPEN)){
    landing_header.classList.add(CLASS_OPEN);
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    document.getElementsByTagName("body")[0].style.position = "fixed";
  }else{
    landing_header.classList.add(CLASS_CLOSE);
    header_container.addEventListener("animationend", header_closeMenu);
  }
}
function header_closeMenu(){
  document.getElementsByTagName("body")[0].style.overflow = "initial";
  document.getElementsByTagName("body")[0].style.position = "initial";

  landing_header.classList.remove(CLASS_OPEN);
  landing_header.classList.remove(CLASS_CLOSE);

  header_container.removeEventListener("animationend", header_closeMenu);  
}

// ---------------------------------------
// Sublist
// ---------------------------------------
const CLASS_OPEN_SUBLIST = "open_subList";

function header_openSubList(){
  let { width } = document.getElementsByTagName("body")[0].getBoundingClientRect();

  if(width <= 561){
    options_titleSublist.classList.toggle(CLASS_OPEN_SUBLIST);

    Array.prototype.forEach.call(options_subList.childNodes, (item) => {
      item.addEventListener("click", header_closeSubList);
    })

    window.addEventListener("click", header_subListWindow);
  }
}
function header_closeSubList(){
  options_titleSublist.classList.remove(CLASS_OPEN_SUBLIST);

  Array.prototype.forEach.call(options_subList.childNodes, (item) => {
    item.removeEventListener("click", header_closeSubList);
  })

  window.removeEventListener("click", header_subListWindow);  
}
function header_subListWindow({clientX, clientY}){
  let list = options_subList.getBoundingClientRect();
  let title = options_titleSublist.getBoundingClientRect();

  if((clientY < title.top || clientY > list.bottom) 
    || (clientX < title.left || clientX > list.right)){
    header_closeSubList();
  }
}

header_openMenu.addEventListener("click", header_menuController);
options_titleSublist.addEventListener("click", header_openSubList);

window.addEventListener('resize', () => {
  header_closeMenu();
  header_closeSubList();
});


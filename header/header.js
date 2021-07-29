const landing_header = document.getElementById("landing_header");
const header_openMenu = document.getElementById("header_openMenu");
const header_container = document.getElementById("header_container");

const CONTROLLER_CLASS = "open_menu";

function header_menuController(){
  if(!landing_header.classList.contains(CONTROLLER_CLASS)){
    landing_header.classList.add(CONTROLLER_CLASS);
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
  }else{
    landing_header.classList.add("close_menu");
    header_container.addEventListener("animationend", header_closeMenu)
  }
}

function header_closeMenu(){
  landing_header.classList.remove(CONTROLLER_CLASS);
  landing_header.classList.remove("close_menu");

  header_container.removeEventListener("animationend", header_closeMenu);
  document.getElementsByTagName("body")[0].style.overflow = "initial";
}

header_openMenu.addEventListener("click", header_menuController)
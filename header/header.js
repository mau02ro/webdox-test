const landing_header = document.getElementById("landing_header");
const header_openMenu = document.getElementById("header_openMenu");
const header_container = document.getElementById("header_container");

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
  landing_header.classList.remove(CLASS_OPEN);
  landing_header.classList.remove(CLASS_CLOSE);

  header_container.removeEventListener("animationend", header_closeMenu);
  document.getElementsByTagName("body")[0].style.overflow = "initial";
  document.getElementsByTagName("body")[0].style.position = "initial";
}

header_openMenu.addEventListener("click", header_menuController);
window.addEventListener('resize', header_closeMenu);
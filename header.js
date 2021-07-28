const CLASS_MENU = "open_menu";

const header_openMenu = document.querySelector("#header_openMenu");
const header_container = document.querySelector("#header_container");
const header_closeMenu = document.querySelector("#header_closeMenu");

console.log(header_openMenu)

header_openMenu.addEventListener("click",  header_menuController);
header_closeMenu.addEventListener("click", header_menuController);

function header_menuController(){
  if(!header_container.classList.contains(CLASS_MENU)){
    header_container.classList.add(CLASS_MENU);
  }else{
    header_container.classList.remove(CLASS_MENU);
  }

}
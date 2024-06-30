const menuBtn = document.querySelector(".header-burger");
const hamBurger = document.querySelector(".header-burger__hamburger");
const nav = document.querySelector('.nav');
const menuNav = document.querySelector('.nav-bar');
let menuBarBtn = document.querySelectorAll('.nav-bar__btn');
// console.log(menuBarBtn[0]);

let showMenu = false;

menuBtn.addEventListener('click', navToggle);

function navToggle(){
    if(!showMenu){
        hamBurger.classList.add('open');
        nav.classList.add('open');
        showMenu = true;
    } else {
        hamBurger.classList.remove('open');
        nav.classList.remove('open');
        showMenu = false;
    }
}

const activePage = window.location.pathname;
const navLinks = document.querySelectorAll(".nav-bar__link");
navLinks.forEach(link =>{
        const navLinkPathName = new URL(link.href).pathname;
        if(activePage === navLinkPathName){
            link.classList.add("active");
        }
});

AOS.init();

// typing
const text="Aspiring MERN Stack Developer 🚀";
let i=0;

function type(){
if(i<text.length){
document.getElementById("typing").innerHTML+=text.charAt(i);
i++;
setTimeout(type,60);
}else{
setTimeout(()=>{
document.getElementById("typing").innerHTML="";
i=0;
type();
},2000);
}
}
type();

// skills animation
window.addEventListener("scroll",()=>{
document.querySelectorAll(".bar div").forEach(bar=>{
let rect=bar.getBoundingClientRect();
if(rect.top<window.innerHeight){
bar.style.width=bar.dataset.width;
}
});
});

// progress bar
window.onscroll=()=>{
let scrollTop=document.documentElement.scrollTop;
let height=document.documentElement.scrollHeight - document.documentElement.clientHeight;
let scrolled=(scrollTop/height)*100;
document.getElementById("progressBar").style.width=scrolled+"%";
};

function toggleMenu(){
let nav=document.getElementById("navLinks");
nav.style.display = nav.style.display==="flex" ? "none":"flex";
}

AOS.init();

// DARK MODE
document.getElementById("themeToggle").addEventListener("click",()=>{
document.body.classList.toggle("dark");
});

// MENU 
function toggleMenu(){
let nav=document.getElementById("navLinks");

if(nav.style.display==="flex"){
nav.style.display="none";
}else{
nav.style.display="flex";
}
}
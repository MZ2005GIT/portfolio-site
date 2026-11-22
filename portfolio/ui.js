const homeOverlay = document.getElementById("homeOverlay");
const contactOverlay = document.getElementById("contactOverlay");

const homeBtn = document.getElementById("homeBtn");
const contactBtn = document.getElementById("contactBtn");

const closeHome = document.getElementById("closeHome");
const closeContact = document.getElementById("closeContact");


// Open Home
homeBtn.addEventListener("click", () => {

    homeOverlay.classList.remove("hidden");
    contactOverlay.classList.add("hidden");

});


// Open Contact
contactBtn.addEventListener("click", () => {

    contactOverlay.classList.remove("hidden");
    homeOverlay.classList.add("hidden");

});


// Close Home
closeHome.addEventListener("click", () => {

    homeOverlay.classList.add("hidden");

});


// Close Contact
closeContact.addEventListener("click", () => {

    contactOverlay.classList.add("hidden");

});
const homeOverlay = document.getElementById("homeOverlay");
const contactOverlay = document.getElementById("contactOverlay");

const homeBtn = document.getElementById("homeBtn");
const contactBtn = document.getElementById("contactBtn");

const closeHome = document.getElementById("closeHome");
const closeContact = document.getElementById("closeContact");

const projectsOverlay = document.getElementById("projectsOverlay");
const closeProjects = document.getElementById("closeProjects");


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

export function openProjects() {
    homeOverlay.classList.add("hidden");
    contactOverlay.classList.add("hidden");
    projectsOverlay.classList.remove("hidden");
}

closeProjects.addEventListener("click", () => {
    projectsOverlay.classList.add("hidden");
});

const projectButtons = document.querySelectorAll(".project-btn");

projectButtons.forEach(button => {

    button.addEventListener("click", () => {

        const project = button.dataset.project;

        window.dispatchEvent(
            new CustomEvent("project-selected", {
                detail: project
            })
        );

        projectsOverlay.classList.add("hidden");

    });

});
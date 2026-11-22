const chatbot = document.getElementById("chatbot");

const minimizeChat = document.getElementById("minimizeChat");

const openChat = document.getElementById("openChat");


// Minimize chatbot

minimizeChat.addEventListener("click", () => {

    chatbot.classList.add("minimized");

    openChat.classList.remove("hidden");

});


// Reopen chatbot

openChat.addEventListener("click", () => {

    chatbot.classList.remove("minimized");

    openChat.classList.add("hidden");

});
const chatbot = document.getElementById("chatbot");

const minimizeChat = document.getElementById("minimizeChat");

const openChat = document.getElementById("openChat");

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

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

chatForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const userQuestion = chatInput.value.trim();

    if (!userQuestion) return;

    // Display the visitor's message
    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.textContent = userQuestion;

    chatMessages.appendChild(userMessage);

    // Clear input
    chatInput.value = "";

    // Display loading message
    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("bot-message");
    loadingMessage.textContent = "Thinking...";

    chatMessages.appendChild(loadingMessage);

    try {

        // Send question to Python backend
        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: userQuestion
            })
        });

        if (!response.ok) {
            throw new Error("Failed to get a response");
        }

        const data = await response.json();

        // Display chatbot answer
        loadingMessage.textContent = data.answer;

    } catch (error) {

        console.error(error);

        loadingMessage.textContent =
            "Sorry, something went wrong. Please try again.";

    }

});
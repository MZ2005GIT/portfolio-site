const contactForm = document.getElementById("contactForm");
const FUNCTION_URL =
    "https://jmyuwxwqhxkgporqslqh.supabase.co/functions/v1/send-contact";

const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message")
};

const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    subject: document.getElementById("subjectError"),
    message: document.getElementById("messageError")
};

const formStatus = document.getElementById("formStatus");


function validateForm() {

    let valid = true;

    // Clear previous errors
    Object.keys(fields).forEach(key => {

        errors[key].textContent = "";
        fields[key].classList.remove("invalid");

    });


    function showError(field, message) {

        errors[field].textContent = message;
        fields[field].classList.add("invalid");

        valid = false;

    }


    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const subject = fields.subject.value.trim();
    const message = fields.message.value.trim();


    // Name validation
    if (!name) {
        showError("name", "Please enter your name.");
    }


    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
        showError("email", "Please enter a valid email address.");
    }


    // Subject validation
    if (!subject) {
        showError("subject", "Please enter a subject.");
    }


    // Message validation
    if (message.length < 10) {
        showError("message", "Message must contain at least 10 characters.");
    }


    return valid;

}


contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();
    formStatus.textContent = "";

    if (!validateForm()) {
        return;
    }

    // Get the Cloudflare Turnstile verification token
    const turnstileToken = turnstile.getResponse();

    if (!turnstileToken) {
        formStatus.textContent = "Please complete the CAPTCHA verification.";
        return;
    }

    const submitButton = document.getElementById("sendMessage");

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.textContent = "Sending your message...";

    const formData = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        subject: fields.subject.value.trim(),
        message: fields.message.value.trim(),
        turnstileToken: turnstileToken,
        website: document.getElementById("website").value
    };

    try {

        const response = await fetch(FUNCTION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Unable to send your message.");
        }

        formStatus.textContent = "Your message was sent successfully!";
        contactForm.reset();

    } catch (error) {

        console.error("Contact submission error:", error);
        formStatus.textContent = error.message || "Something went wrong. Please try again.";

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
        turnstile.reset();

    }

});

# Interactive 3D Portfolio

An interactive 3D portfolio website built using **Three.js, HTML, CSS, and JavaScript**. Instead of presenting projects through a traditional portfolio layout, the website allows visitors to explore a 3D environment, interact with objects, and discover projects through an animated character and an in-world television.

**Live Website:** https://portfolio-site-2iyd.netlify.app/

---

## Overview

This project is an interactive portfolio designed to present my projects, technical skills, and experience through a 3D environment.

Visitors can explore the scene, interact with the character, view project demonstrations on a television screen, and access portfolio information through interactive UI elements.

The website also includes a chatbot for answering questions about the portfolio and a contact form for sending messages.

## Features

### 1. Interactive 3D Environment
- Built using Three.js.
- Explorable 3D environment containing furniture, trees, paths, fences, platforms, and other environmental objects.
- Procedurally created scene elements.
- Camera movement and navigation using keyboard and mouse input.

### 2. 3D Character
- Custom 3D character created and animated in Blender.
- Character model integrated into the Three.js scene using GLTF.
- Character animations managed using Three.js AnimationMixer.
- Interactive character with a jump animation.

### 3. Interactive Project Showcase
- Projects are displayed through an in-world television.
- Selecting a project changes the video displayed on the TV.
- Project information is presented through interactive UI elements.
- A whiteboard displays dynamically generated content.
- Raycasting is used to detect interactions with objects in the 3D environment.

### 4. Portfolio Information
- Interactive Home and Contact sections.
- HTML and CSS overlays integrated with the 3D environment.
- Posters and whiteboard content generated using html2canvas.

### 5. Portfolio Chatbot
- Integrated chatbot that answers questions about the portfolio.
- Communicates with a separately hosted backend.
- Uses a Gemini API-powered chatbot backend.
- API credentials are kept on the backend rather than exposed in frontend JavaScript.

### 6. Contact Form
- Allows visitors to submit messages.
- Uses a Supabase Edge Function to handle contact form submissions.
- Resend is used for email delivery.
- Cloudflare Turnstile provides bot protection.
- Backend credentials are kept outside the frontend.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and UI overlays |
| JavaScript | Application logic and interactions |
| Three.js | 3D rendering and scene management |
| GLTFLoader | Loading 3D character models |
| AnimationMixer | Managing character animations |
| VideoTexture | Displaying project videos on the TV |
| CanvasTexture | Creating textures dynamically |
| Raycaster | Detecting interactions with 3D objects |
| RoundedBoxGeometry | Creating rounded 3D objects |
| Blender | Character modeling and animation |
| html2canvas | Generating textures from HTML content |
| Supabase | Contact form backend |
| Resend | Email delivery |
| Cloudflare Turnstile | Spam and bot protection |
| Gemini API | Chatbot responses |
| Netlify | Website hosting |

## Project Structure

portfolio/
│
├── index.html
├── index.js
├── ui.js
├── contact.js
├── chatbot.js
├── style.css
│── alien.glb
│── project videos

**Main files:**

- `index.html` – Main website structure and UI elements.
- `index.js` – Three.js scene creation, 3D objects, character integration, camera movement, animations, and interactions.
- `ui.js` – Handles website interface interactions and overlays.
- `contact.js` – Handles contact form submissions and communication with the Supabase Edge Function.
- `chatbot.js` – Handles the chatbot interface and communication with its backend.
- `style.css` – Website styling and responsive UI elements.

## How to Run Locally

This project uses JavaScript ES modules and Three.js, so it should be run through a local development server rather than opening `index.html` directly.

### 1. Clone the repository

git clone <repository-url>

### 2. Navigate into the project folder

cd <repository-folder>

### 3. Start a local server

For example, using Python:

python -m http.server 5500

Alternatively, use the Live Server extension in Visual Studio Code.

### 4. Open the website

Visit:

http://localhost:5500

---

## Controls

| Input | Action |
|---|---|
| W | Move forward |
| A | Move left |
| S | Move backward |
| D | Move right |
| Mouse | Look around |
| Click | Interact with scene objects and UI elements |

## Deployment

The frontend is deployed using Netlify.

The project uses a static website structure, so there is no React, Vite, or frontend build process required.

Deployment configuration:

- Build command: None
- Publish directory: `.`

The chatbot backend and contact form backend are hosted separately from the frontend.

## Backend Integrations

### Chatbot

The chatbot frontend communicates with a separately hosted backend. The backend handles requests to the Gemini API and returns generated responses.

The Gemini API key is stored on the backend and is not included in the public frontend repository.

### Contact Form

The contact form follows this flow:

User submits contact form
          |
          v
Cloudflare Turnstile verification
          |
          v
contact.js sends request
          |
          v
Supabase Edge Function
          |
          v
Resend email service
          |
          v
Email delivered to recipient


Sensitive email service credentials are stored as backend environment secrets.


Developed as a personal portfolio project to explore interactive 3D web development and present my projects through an immersive experience.

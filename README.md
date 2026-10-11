# IdeaVault – Startup Idea Sharing Platform

IdeaVault is a modern, full-stack community platform where innovators can publish, explore, and validate startup concepts. Built with React, Firebase Authentication, and a custom Node.js/Express API backed by MongoDB Atlas.

**Live Site URL:** [https://ideavault-client-blue.vercel.app](https://ideavault-client-blue.vercel.app)

## Key Features

- **Secure Dual-Layer Authentication:** Users can register and login via Email/Password or Google OAuth. All protected API calls are secured using Firebase-issued tokens exchanged for custom server-signed JWT tokens—keeping sensitive routes locked to verified users only.
- **Full CRUD Idea Management:** Authenticated users can publish new startup ideas with rich details (title, category, budget, problem/solution, tags, and a pitch image). Published ideas can be updated via an edit modal or permanently deleted with a confirmation prompt—all without leaving the page.
- **Live Comment & Feedback System:** Every idea page includes a threaded comment section. Users can post, edit, and delete their own feedback in real-time—including an edit-in-place input system with inline save controls.
- **Dynamic Search & Category Filtering:** The Ideas catalog supports real-time search by title using case-insensitive regex matching on the server, combined with category filter tabs (Tech, Health, AI, Education, Finance, etc.) to quickly narrow results.
- **Personal Dashboard with Interaction History:** The dashboard provides two dedicated views: "My Ideas" shows all concepts you have published with edit/delete controls and comment counts, while "My Interactions" lists all ideas you have engaged with by leaving comments.
- **Persistent Dark/Light Mode Engine:** A custom global theme context powers a full HSL-based dark/light mode toggle that persists across page refreshes using localStorage—providing a comfortable, personalized experience at all times.
- **Responsive Glassmorphism Design:** Every page is built from scratch using modern glassmorphism, gradient overlays, and HSL color tokens—fully responsive across mobile, tablet, and desktop viewports with smooth CSS micro-animations.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite |
| Routing | React Router DOM v7 |
| Auth | Firebase Authentication |
| API Auth | JWT (jsonwebtoken) |
| Backend | Express.js + Node.js |
| Database | MongoDB Atlas |
| Deployment | Vercel (Client + Server) |
| Styling | Vanilla CSS (Glassmorphism) |
| Notifications | React Hot Toast |

## Getting Started

1. Clone this repository.
2. Run `npm install` to download dependencies.
3. Create a `.env` file in the project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```

4. Run `npm run dev` to start the local developer server.

## API Server

The backend Express API is deployed at: [https://ideavault-server-gilt.vercel.app](https://ideavault-server-gilt.vercel.app)

See the [server README](../ideavault-server/README.md) for full API documentation.

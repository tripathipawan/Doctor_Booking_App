# 🏥 Doctor Booking App

A modern, full-stack doctor appointment booking web application built with React, Firebase, and Tailwind CSS — featuring secure authentication, real-time data sync, light/dark mode, and a responsive UI optimized for all screen sizes.

**🔗 Live Demo:** [appoint-your-doctor.vercel.app](https://appoint-your-doctor.vercel.app/)

---

## 📌 Overview

This application provides a seamless interface for patients to browse doctors and book appointments online. It handles the complete user flow — from account creation and secure login, to selecting a doctor, picking an available slot, and confirming a booking — all backed by Firebase Firestore for real-time data persistence.

The project is built entirely with JavaScript, React, and a Firebase backend, with zero server-side code required. Tailwind CSS v4 powers the responsive and modern UI.

---

## ✨ Features

- **Firebase Authentication** — Users can securely register and log in with email and password. Sessions are managed in real time; the app reacts instantly to auth state changes without requiring a page reload.
- **Doctor Browsing** — A dedicated listing page displays available doctors with relevant details, allowing users to browse and select based on their requirements.
- **Appointment Booking System** — Users go through a clear, step-by-step booking flow to select a doctor, choose a date and time slot, and confirm their appointment.
- **Real-Time Firestore Database** — Appointment data is stored and synced via Firebase Firestore. Changes reflect in real time across sessions without manual refresh.
- **Light / Dark Mode Toggle** — The app includes a full theme-switching system. The selected theme (light or dark) is saved to `localStorage` so the preference persists across page reloads.
- **Fully Responsive Design** — Built mobile-first with Tailwind CSS, the layout adapts cleanly across mobile, tablet, and desktop screen sizes.
- **Smooth Scroll Navigation** — In-page navigation is powered by `react-scroll`, enabling smooth animated scrolling between sections within a single page.
- **React Router DOM v7 Routing** — Multi-page navigation is handled client-side using React Router, with dedicated routes for the home page, doctor listings, booking flow, and user dashboard.
- **Firestore Security Rules** — `firestore.rules` defines access control at the database level, ensuring users can only read and write their own appointment data.
- **Firebase Hosting Ready** — The project includes `firebase.json` and `.firebaserc` configuration files, making it immediately deployable to Firebase Hosting in addition to the current Vercel deployment.
- **Vite Build Tooling** — Development and production builds are handled by Vite with the React plugin, providing fast HMR during development and optimized bundles for deployment.
- **ESLint Code Quality** — The codebase is linted with ESLint configured for React hooks best practices and fast-refresh compatibility.
- **Vercel Deployment Config** — A `vercel.json` configuration ensures proper SPA routing behavior on Vercel, so direct URL access and page refreshes work correctly.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based UI and SPA architecture |
| JavaScript (ES6+) | Core application logic |
| Vite | Development server and production build tool |
| Tailwind CSS v4 | Utility-first responsive styling |
| Firebase Auth | Secure user registration and login |
| Firebase Firestore | Real-time appointment data storage |
| Firebase Hosting | Optional deployment platform |
| React Router DOM v7 | Client-side multi-page routing |
| react-scroll | Smooth animated in-page scrolling |
| Lucide React | Consistent icon library for UI elements |
| Vercel | Primary deployment and hosting platform |

---

## 📁 Project Structure

```
Doctor_Booking_App/
├── public/                  # Static assets (favicon, images)
├── src/
│   ├── components/          # Reusable UI components (Navbar, DoctorCard, BookingForm, etc.)
│   ├── pages/               # Route-level pages (Home, Doctors, Booking, Dashboard)
│   ├── context/             # React Context for auth state and theme management
│   ├── firebase/            # Firebase initialization and Firestore helper functions
│   └── App.jsx              # Root component with router setup
├── index.html               # Vite HTML entry point
├── vite.config.js           # Vite + React plugin configuration
├── firebase.json            # Firebase Hosting configuration
├── firestore.rules          # Firestore database security rules
├── firestore.indexes.json   # Firestore composite index definitions
├── .firebaserc              # Firebase project alias configuration
├── vercel.json              # Vercel SPA routing configuration
├── eslint.config.js         # ESLint rules and plugins
└── package.json             # Dependencies and npm scripts
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+ and a Firebase project with Authentication and Firestore enabled.

**1. Clone the repository**
```bash
git clone https://github.com/tripathipawan/Doctor_Booking_App.git
cd Doctor_Booking_App
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Firebase**

Create a `.env` file in the root and add your Firebase project credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**4. Start the development server**
```bash
npm run dev
```

**5. Build for production**
```bash
npm run build
```

---

## 🎮 How to Use

1. Open the [live app](https://appoint-your-doctor.vercel.app/) or run it locally.
2. **Sign Up** with your email and password to create an account.
3. Browse the **Doctors** section to view available specialists.
4. Select a doctor and go through the **Booking Flow** — choose a date, pick a time slot, and confirm.
5. View your booked appointments from the **Dashboard**.
6. Toggle between **Light and Dark mode** using the theme button in the navbar — your preference is saved automatically.

---

## 🧠 Architecture Highlights

| Concern | Implementation |
|---|---|
| Authentication | Firebase Auth with React Context for global auth state |
| Data Persistence | Firestore with user-scoped security rules per appointment |
| Theme System | CSS class toggling on `<html>` root with `localStorage` persistence |
| Routing | React Router DOM v7 with page-level components per route |
| SPA on Vercel | `vercel.json` rewrites all routes to `index.html` for correct navigation |
| Real-Time Sync | Firestore `onSnapshot` listeners for live appointment status updates |

---

## 🌱 What I Learned

- Building a complete user authentication and session flow with Firebase Auth and React Context
- Structuring and securing a Firestore database with document-level security rules
- Implementing a theme toggle system that persists across browser sessions using `localStorage`
- Managing client-side routing for a multi-page SPA with React Router DOM
- Deploying a Vite + React application to Vercel with proper SPA routing configuration

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add: your feature description'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Pawan Tripathi**
- GitHub: [@tripathipawan](https://github.com/tripathipawan)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

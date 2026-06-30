# Doctor Booking App — Full-Stack Healthcare Appointment Platform

A production-grade, full-stack doctor appointment booking web application built with React 19, Firebase Authentication, and Cloud Firestore. The platform serves 3 distinct user roles — patients, registered users, and an admin — each with their own protected experience. Users browse 40+ verified doctors across 10 medical specialities, select real-time available slots, and book appointments that persist to Firestore. The admin panel provides complete appointment lifecycle management. Everything is deployed live on Vercel with all client-side routes handled via `vercel.json` rewrites.

---

## Live Demo

**[https://appoint-your-doctor.vercel.app/](https://appoint-your-doctor.vercel.app/)**

---

## What This Project Does

The app opens with a full-viewport hero section featuring a 4-stat trust bar (50,000+ patients, 4.9 / 5 rating, 100% verified doctors, < 2 min booking time), an animated speciality browser, a top-doctors grid, a 3-step "How It Works" section, 3 patient testimonials, and a CTA appointment banner. The navbar is sticky, scroll-aware, and ARIA-compliant with a smooth animated underline indicator on active links. Unauthenticated users can browse freely; booking requires a Firebase account. Appointments are stored in Firestore's `appointments` collection and are queryable per-user, per-doctor, or globally (admin).

---

## Pages & Routing — 11 Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/alldoctors` | All Doctors — search + filter + pagination | Public |
| `/doctorprofile/:id` | Doctor Profile + slot booking | Public (book = auth required) |
| `/doctors/speciality/:speciality` | Speciality-Filtered Doctors | Public |
| `/about` | About Page | Public |
| `/contact` | Contact Page | Public |
| `/login` | Login / Register | Public |
| `/my-appointments` | User's appointments | `ProtectedRoute` (logged-in users only) |
| `/admin-login` | Admin login portal | Public (Navbar/Footer hidden) |
| `/admin-panel` | Admin appointment management | `AdminRoute` (admin email only) |
| `*` | 404 Not Found | Public |

All pages are lazy-loaded with `React.lazy()` + `Suspense`. The `PageLoader` component — a centered spinning ring with a `will-change: transform` GPU hint — displays during every code-split load.

---

## Authentication — Firebase Auth + Dual Route Guards

`authContext.jsx` wraps the app in `AuthProvider`, which calls `onAuthStateChanged(auth, ...)` to track the current user. The context exposes `signup`, `login`, and `logout` — all thin wrappers over Firebase SDK functions. The `loading` state is `true` until the first auth state event fires, preventing a flash of unauthenticated content.

### ProtectedRoute

```jsx
if (!user) return <Navigate to="/login" replace />;
```

Guards `/my-appointments`. Any unauthenticated visit redirects to `/login`.

### AdminRoute

```jsx
const ADMIN_EMAIL = "pawantripathi875@gmail.com";
if (!user) return <Navigate to="/admin-login" replace />;
if (user.email !== ADMIN_EMAIL) return <Navigate to="/" replace />;
```

Guards `/admin-panel`. Email is hardcoded and checked on every render — non-admin authenticated users are redirected to home.

### Login / Register Page

A split-screen layout (blue gradient left panel + white right form panel, collapses on mobile). Switches between "Sign In" and "Register" states via a local `state` variable. A `getErrorMsg(code)` switch covers 6 Firebase error codes with user-friendly messages: `auth/email-already-in-use`, `auth/wrong-password`, `auth/user-not-found`, `auth/invalid-credential`, `auth/weak-password`, `auth/too-many-requests`, `auth/invalid-email`. The left panel lists 4 platform features with check icons and 3 trust stats (100+ Doctors, 50K+ Patients, 4.9★ Rating).

### Admin Login Page

A standalone dark-themed page (`bg-gradient-to-br from-gray-900`) with an email check before Firebase auth — if `email !== ADMIN_EMAIL`, the request is rejected before any network call. A `ShieldCheck` icon, `Eye`/`EyeOff` password toggle, and 4 Firebase error code mappings.

---

## Firebase Integration

```js
// firebase.js
const app  = initializeApp(firebaseConfig);   // reads 6 VITE_ env vars
export const auth = getAuth(app);             // Firebase Auth
export const db   = getFirestore(app);        // Cloud Firestore
```

All 6 config values are loaded from environment variables (`VITE_FIREBASE_*`) — no credentials in source code.

### Firestore API — `appointmentApi.js`

All Firestore operations are in one dedicated file (`src/api/appointmentApi.js`), exporting 5 functions:

| Function | Firestore Operation | Usage |
|---|---|---|
| `addAppointment(data)` | `addDoc` — adds `bookedAt` ISO timestamp | Book new appointment |
| `getAllAppointments()` | `getDocs` full collection | Admin panel only |
| `getUserAppointments(userId)` | `query + where("userId", "==", uid)` | My Appointments page |
| `getDoctorAppointments(doctorId)` | `query + where("doctorId", "==", id)` | Slot conflict check on booking page |
| `deleteAppointment(id)` | `deleteDoc` | User cancel + admin delete |
| `updateAppointment(id, data)` | `updateDoc` | Admin reschedule |

Each appointment document stores: `doctorId`, `doctorName`, `doctorImage`, `speciality`, `day`, `time`, `userId`, `userEmail`, `bookedAt`.

---

## Doctor Data — 40 Doctors, 10 Specialities

`assets/assets.js` exports a `doctors` array of 40 entries (ids 1–40) and a `specialityData` array of 10 items. Doctors are distributed across:

| Speciality | Count |
|---|---|
| Physician (General) | 4 |
| Gynecologist | 4 |
| Dermatologist | 4 |
| Pediatricians | 4 |
| Neurologist | 4 |
| Gastroenterologist | 4 |
| Cardiologist | 4 |
| Orthopedic | 4 |
| Psychiatrist | 4 |
| Ophthalmologist | 4 |

Each doctor object carries: `_id`, `name`, `image` (doc1.png – doc20.jpg, cycled for 21–40), `speciality`, `degree`, `experience`, `about`, `fees`, `address`.

---

## Key Pages — Deep Dive

### Home Page

Composed of 6 sections in order: `Slide` (hero), Trust Stats bar (4 animated cards), `FindBySpeciality`, How It Works (3 steps with a connecting gradient line), 3 testimonial cards (avatars + 5-star ratings), and `Appointment` CTA banner. The trust stats cards use a `COLOR_MAP` object to apply per-card Tailwind variants (blue, amber, green, purple) with `animationDelay: i * 100ms` staggering.

### Hero Section — `Slide.jsx`

Full-viewport dark blue gradient (`#0f172a → #1e3a8a → #2563eb`). A static dot-grid pattern (white `rgba` at 4% opacity) is the background texture. Two decorative radial blobs at top-right and bottom-left. Right panel is a glassmorphism card (no `backdrop-filter` — removed for performance) showing:

- 10 speciality clickable pills (each links to `/doctors/speciality/:name`)
- 3 doctor preview rows (Dr. Rohit Kapoor — Physician, Dr. Priya Sharma — Gynecologist, Dr. Arjun Mehta — Neurologist) with availability badges
- "View all 40+ doctors" footer link

Left panel stats: `40+` Doctors, `10` Specialities, `4.9★` Rating, `50K+` Patients. 4 feature checkmarks: instant booking, no hidden fees, real-time slots, cancel anytime. Two CTA buttons: Book Appointment (smooth-scrolls to `#speciality` via react-scroll) and View All Doctors. A trust bar at the bottom with HIPAA Compliant, Patient First, 24/7 Support, 50K+ Patients.

### All Doctors Page

State variables: `selectedSpeciality` (11 options: All + 10 specialities), `searchQuery`, `loading`, `showFilter`, `currentPage`. `useMemo` filters and searches the doctors array by speciality (case-insensitive), then by name/speciality against the search query. Pagination: `DOCTORS_PER_PAGE = 8` — custom `PageBtn` component with `aria-current="page"` on the active page. Filter chips on desktop; `showFilter` toggle shows/hides on mobile. Skeleton loading state via `DoctorCardSkeleton` for 8 placeholder cards. `useEffect` resets `currentPage` to 1 whenever speciality or search changes.

### Doctor Profile + Booking

`useParams` gets `:id`, finds the doctor in the local array. `getDoctorAppointments(doctor._id)` fetches all existing bookings for this doctor on mount — stored in `bookedSlots`. 7 available days (`SAT 23` – `FRI 29`) and 7 time slots (`10:00 am` – `01:00 pm`) render as clickable selector buttons.

Booking validation checks (in order):

1. User must be logged in — if not, toast + redirect to `/login`
2. Day and time must both be selected
3. `isMySlot(day, time)` — user already has this slot booked
4. `isSlotBooked(day, time)` — any user has this slot booked

On successful `addAppointment()`: success toast, `getDoctorAppointments()` is re-fetched to update the slot grid live, and selection resets.

Left column: doctor image (with pulse skeleton loader), name, degree badge (`ShieldCheck` icon), speciality, experience, consultation fee. Right column: slot picker.

### My Appointments

`getUserAppointments(user.uid)` fetches only this user's documents (Firestore `where` query — no full collection read). Appointments render as article cards sorted newest-first with: doctor image, name, speciality in blue, day pill and time pill with Calendar/Clock icons. Cancel button triggers a 2-step flow: `cancelId` state is set, a confirmation modal appears with an `AlertTriangle` icon, and only on confirm does `deleteAppointment(cancelId)` run. `AppointmentSkeleton` shows 3 placeholder rows during loading. Empty state shows a Calendar icon with a "Browse Doctors" CTA button.

### Admin Panel

`getAllAppointments()` — fetches every document in the `appointments` collection. Stats bar: Total Appointments, Today's Slots (filtered by `day === "MON 25"`), Upcoming (= total). Per-appointment card: doctor image, name, speciality, patient email, day/time pills, Edit and Delete buttons.

Edit flow: sets `editingAppointment` + pre-fills `formData` with `{day, time}`. Before updating, checks for duplicate slot: `appointments.some(a => a.id !== editingAppointment.id && a.day === formData.day && a.time === formData.time && a.doctorId === editingAppointment.doctorId)`. Delete flow: `deleteConfirm` state shows a confirmation modal before `deleteAppointment(id)`.

---

## UI Systems

### Navbar — `Navabar.jsx`

`memo`-wrapped for performance. Uses `useCallback` for all handlers. 3 `useEffect` hooks: (1) scroll listener sets `scrolled` state — navbar background shifts from `bg-white` to `bg-white/95 backdrop-blur-md shadow-md` at `scrollY > 10` using `{ passive: true }`; (2) click-outside listener closes profile dropdown; (3) `location.pathname` change closes both mobile menu and dropdown.

Active link detection: `path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)`. Active link gets a `scale-x-100` animated underline pseudo-element; inactive links have `scale-x-0 group-hover:scale-x-100`.

Logged-in user button: initials avatar (first character of email, uppercased), truncated username (email prefix), `ChevronDown` that rotates 180° when dropdown is open. Dropdown menu has `role="menu"` with `role="menuitem"` on each action.

### Dark Mode — `ThemeContext.jsx`

`ThemeProvider` initializes from `localStorage.getItem("theme")` directly in the `useState` initializer — applies `document.documentElement.classList.add("dark")` immediately, preventing a flash of light mode. `toggleTheme` uses `useCallback` for a stable reference. Tailwind `dark:` variants respond to the `.dark` class on `<html>`. Theme persists across sessions.

### Toast System — `Toast.jsx`

Custom `ToastContext` with `ToastProvider`. `addToast(message, type, duration)` pushes a `{id: Date.now(), message, type}` object to the `toasts` array and schedules removal via `setTimeout`. `removeToast(id)` filters it out on manual close. 3 types: `success` (green), `error` (red), `info` (blue) — each with its own lucide icon. Toast container is `aria-live="polite"` for accessibility. Slide-in animation: `toastSlideIn` keyframe — `translateX(110%) → translateX(0)` with `cubic-bezier(0.22, 1, 0.36, 1)` and `will-change: transform, opacity`.

### Loading Skeletons — `LoadingSkeletons.jsx`

4 exported components: `Skeleton` (base shimmer div), `DoctorCardSkeleton` (image + 3 text lines), `AppointmentSkeleton` (image + 3 text lines + 2 action buttons), `PageLoader` (fixed overlay with a spinning ring using `will-change: transform`), `Spinner` (inline, configurable size). The `shimmer` class uses a `::after` pseudo-element with `transform: translateX(-100% → 100%)` — GPU-accelerated via `will-change: transform`.

### CSS — `index.css`

- Font: `Outfit` (Google Fonts), weights 300–900
- Tailwind v4 with `@custom-variant dark (&:where(.dark, .dark *))`
- 5px custom scrollbar (slate-colored thumb, transparent track, dark variant override)
- `:focus-visible` — 2px blue outline with 6px border-radius
- `.skip-to-content` — off-screen accessibility skip link that reveals on focus
- `@keyframes pageEnter` — `translateY(8px) → 0` (0.35s ease-out)
- `@keyframes shimmer` — GPU-accelerated `translateX(-100% → 100%)` (1.4s infinite)
- `@keyframes toastSlideIn` — `translateX(110%) → 0` with spring easing
- `@keyframes fadeUp` with 3 stagger delays (0.08s, 0.16s, 0.24s)
- `.gradient-text` — indigo-to-violet gradient via `-webkit-background-clip: text`
- `.glass` — `rgba(255,255,255,0.08)` background with border
- `@media (prefers-reduced-motion)` — kills all animations for accessibility

---

## About, Contact Pages

### About Page

Blue-to-indigo gradient hero (dark override: `#0f172a → #1e1b4b`) with decorative blur circles. Stats section overlaps the hero with `-mt-8 sm:-mt-12` negative margin. 4 values cards with per-color `COLOR_MAP` (rose, blue, emerald, purple). Story section: 2-column grid with about image + rich text. `useInView` hook (custom `IntersectionObserver` wrapper) triggers fade-in animations as sections scroll into view.

### Contact Page

4 contact info cards (MapPin, Mail, Phone, Clock) with hover `group-hover:translate-x-1`. Contact form: 5 fields (name, email, phone, subject, message textarea) with a 1.5s simulated API delay on submit and a `sent` state that replaces the form with a success message. FAQ section: 4 `FAQItem` accordion components — each tracks `open` state, animates height via `max-h-0 → max-h-48`, and rotates the `ChevronDown` icon 180° on open.

### Footer

4-column grid (2×2 on mobile, 4 on `xl`): Brand + 5 social icons (Facebook, Twitter/X, Instagram, LinkedIn, YouTube — each with unique `hover:bg-{color}` class and `hover:scale-110 hover:-translate-y-0.5`), Company links (5 items with animated underline slide-in on hover), Services links (10 specialities), Contact + Newsletter. Newsletter form: email input + Send button; on submit shows a success confirmation div for 4 seconds. Bottom bar: copyright with `Heart` icon animating `animate-pulse`, and 3 legal links (Terms, Privacy, Cookie Policy).

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| React | 19.2.1 | UI framework |
| Vite | 7.2.4 | Build tool and dev server |
| Tailwind CSS | 4.1.17 | Utility-first styling with `dark:` class variant |
| Firebase | 12.6.0 | Authentication (`getAuth`) + Firestore (`getFirestore`) |
| React Router DOM | 7.10.1 | `createBrowserRouter`, lazy routes, protected routing |
| react-scroll | 1.9.3 | Smooth-scroll to `#speciality` anchor on hero CTA |
| lucide-react | 0.556.0 | All icons — 30+ icons across all pages |
| @tailwindcss/vite | 4.1.17 | Vite plugin for Tailwind v4 |

---

## Project Structure

```
Doctor_Booking_App/
├── index.html                        # Vite entry — Outfit font link, #root mount
├── vite.config.js                    # @vitejs/plugin-react + @tailwindcss/vite
├── vercel.json                       # Rewrites all 5 client-side routes → "/"
├── firebase.json                     # Firebase Hosting config (fallback to index.html)
├── firestore.rules                   # Firestore security rules
├── firestore.indexes.json            # Composite index definitions
├── .env                              # VITE_FIREBASE_* (6 variables, not committed)
│
└── src/
    ├── main.jsx                      # createRoot, wraps in BrowserRouter + AuthProvider + ThemeProvider
    ├── App.jsx                       # 11 routes, Suspense + PageLoader, layout hides on /admin-login
    ├── firebase.js                   # initializeApp + getAuth + getFirestore exports
    ├── ProtectedRoute.jsx            # Redirects unauthenticated users to /login
    ├── AdminRoute.jsx                # Checks user.email === ADMIN_EMAIL; redirects otherwise
    │
    ├── api/
    │   └── appointmentApi.js         # addAppointment, getAllAppointments, getUserAppointments, getDoctorAppointments, deleteAppointment, updateAppointment
    │
    ├── context/
    │   ├── authContext.jsx           # AuthProvider — onAuthStateChanged, signup, login, logout; blocks render until loading:false
    │   └── ThemeContext.jsx          # ThemeProvider — dark/light via localStorage + documentElement.classList; toggleTheme via useCallback
    │
    ├── assets/
    │   ├── assets.js                 # Exports assets object (images + icons), doctors array (40 entries), specialityData array (10 specialities), AboutData
    │   ├── doc1.png – doc20.jpg      # 20 unique doctor portrait images (cycled for 21–40)
    │   ├── Dermatologist.svg         # Speciality icons (6 SVG, 4 PNG)
    │   └── ...                       # (appointment_img, group_profiles, about_image, contact_image, admin icons)
    │
    ├── components/
    │   ├── Navabar.jsx               # memo-wrapped; scroll-aware bg (blur at scrollY>10); active link underline animation; user dropdown with ChevronDown; theme toggle; mobile slide-down menu; ARIA nav/role attributes
    │   ├── Footer.jsx                # 4-col grid; 5 social icons with color hover; company + services links with slide-in underline; newsletter form with 4s success timeout; animated Heart icon in copyright
    │   ├── Header.jsx                # Inner homepage header (not main navbar); react-scroll "Book Appointment" CTA
    │   ├── Slide.jsx                 # Full-viewport hero — gradient bg, dot-grid texture, 2 blob shapes, 10 speciality pills, 3 doctor preview rows, stats row, trust bar; no backdrop-filter for perf
    │   ├── FindBySpeciality.jsx      # memo-wrapped; 10 speciality cards (image + name, lazy loaded); hover -translate-y-2; links to /doctors/speciality/:name
    │   ├── TopDoctors.jsx            # Single IntersectionObserver for entire grid (threshold:0.08); 10 doctor cards with CSS stagger delay (55ms × index); lazy image loading with pulse skeleton; memo on DoctorCard
    │   ├── Appointment.jsx           # CTA banner — blue gradient with 2 decorative blur blobs; 5-star row; 2 CTA buttons (Create Account → /login, Browse Doctors → /alldoctors); lazy doctor image
    │   ├── Toast.jsx                 # Custom context-based toast system; 3 types; aria-live="polite"; slide-in animation; manual dismiss; 3500ms auto-remove
    │   └── LoadingSkeletons.jsx      # Skeleton, DoctorCardSkeleton, AppointmentSkeleton, PageLoader (fixed overlay + GPU spin), Spinner (inline)
    │
    ├── pages/
    │   ├── Home.jsx                  # Composes: Slide + trust stats (4 cards) + FindBySpeciality + How It Works (3 steps) + testimonials (3 cards) + Appointment CTA
    │   ├── AllDoctors.jsx            # useMemo filter+search; DOCTORS_PER_PAGE=8; custom PageBtn pagination; speciality chip filter; DoctorCardSkeleton on load; useEffect resets page on filter change
    │   ├── DoctorProfile.jsx         # useParams; getDoctorAppointments on mount; 7-day × 7-time slot grid; isSlotBooked/isMySlot checks; addAppointment on confirm; re-fetch after booking; pulse skeleton on image; PageLoader while fetching
    │   ├── SpecialityDoctors.jsx     # useParams speciality; filters doctors array; 2/3/4-col grid; responsive aspect-ratio image
    │   ├── MyAppointments.jsx        # getUserAppointments(uid); appointment cards with day+time pills; 2-step cancel modal (AlertTriangle + confirm); AppointmentSkeleton × 3 on load; empty state CTA
    │   ├── AdminPanel.jsx            # getAllAppointments(); 3 stat cards; per-appointment edit (day+time dropdowns + duplicate check) + delete (confirmation modal); updateAppointment + deleteAppointment; AppointmentSkeleton × 4 on load
    │   ├── AdminLogin.jsx            # Email guard before Firebase call; ShieldCheck icon; Eye/EyeOff toggle; 4 error code mappings; loading spinner on button
    │   ├── Login.jsx                 # Sign In / Register toggle; left panel (gradient + 4 features + 3 stats); getErrorMsg(code) covers 7 Firebase errors; name validation on register; Eye/EyeOff toggle
    │   ├── About.jsx                 # Gradient hero; 4 stat cards (-mt-8 overlap); 4 values cards (COLOR_MAP); story grid; useInView IntersectionObserver for scroll-triggered animations
    │   ├── Contact.jsx               # 4 info cards; 5-field form with 1.5s simulated submit; sent success state; 4-item FAQ accordion (max-h transition + ChevronDown rotation)
    │   └── NotFound.jsx              # 404 page — "404" ghost text behind 🏥 emoji; Home + Go Back buttons
    │
    └── index.css                     # Outfit font, Tailwind v4, 5px scrollbar, skip link, shimmer keyframe (GPU), toastSlideIn, fadeUp stagger, gradient-text, glass, prefers-reduced-motion reset
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project with Authentication (Email/Password) and Firestore enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tripathipawan/Doctor_Booking_App.git
cd Doctor_Booking_App

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env in the root:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# 4. Start the development server
npm run dev
# App runs at http://localhost:5173
```

### Build & Deploy

```bash
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build locally
```

---

## Repository

[https://github.com/tripathipawan/Doctor_Booking_App](https://github.com/tripathipawan/Doctor_Booking_App)

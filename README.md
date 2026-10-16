# DevFolio — Senior Full-Stack Engineer Portfolio & Studio (Frontend)

> A modern, responsive developer portfolio and content management studio engineered with **React 18**, **Vite**, **TanStack React Query**, and **Axios**. Built to pair seamlessly with the Django REST Framework backend.

---

## 🎨 Visual Aesthetics & Design System

This frontend implements **Direction D: Soft Modern Gradient**, a modern aesthetic characterized by:
- **Subtle Glassmorphic Layering**: Translucent card backdrops (`rgba(255, 255, 255, 0.72)` light / `rgba(30, 41, 59, 0.75)` dark) with `backdrop-filter: blur(16px)`.
- **Soft Indigo/Violet Gradients**: Vibrant accent gradients (`linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)`).
- **Mathematical 8px Spacing Scale**: Strict grid using `8 / 16 / 24 / 32 / 48 / 64 / 96 px`.
- **Typographic Scale**: Paired Google Fonts — **Outfit** for display headings and **Inter** for reading typography, with **JetBrains Mono** for code snippets.
- **Fluid Dark / Light Mode**: Instant theme switching backed by CSS variables with `localStorage` persistence and zero UI flicker.

### Design Tokens (`src/styles/tokens.css`)

| Token Category | Variable Name | Light Mode Value | Dark Mode Value |
|---|---|---|---|
| Background Primary | `--bg-primary` | `#f8fafc` | `#0b0f19` |
| Background Secondary | `--bg-secondary` | `#f1f5f9` | `#111827` |
| Glass Surface | `--bg-glass` | `rgba(255, 255, 255, 0.72)` | `rgba(17, 24, 39, 0.75)` |
| Card Glass | `--bg-glass-card` | `rgba(255, 255, 255, 0.65)` | `rgba(30, 41, 59, 0.60)` |
| Accent Primary | `--accent-primary` | `#6366f1` (Indigo) | `#818cf8` (Light Indigo) |
| Accent Gradient | `--accent-gradient` | `linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)` | `linear-gradient(135deg, #818cf8, #a78bfa, #f472b6)` |
| Status Success | `--status-success` | `#10b981` | `#34d399` |
| Status Warning | `--status-warning` | `#f59e0b` | `#fbbf24` |
| Status Danger | `--status-danger` | `#ef4444` | `#f87171` |

---

## ⚡ Key Features

1. **Zero Hardcoded Content (`F-1`)**:
   - Every piece of biographical data, skill bar, experience timeline, project card, blog post, and comment is dynamically retrieved from the DRF API.
2. **Visitor Privacy & Access Control (`Section 0`)**:
   - Public visitors **never** see login links, sign-up forms, or admin dashboard links in the navigation bar.
   - The Studio Dashboard is accessible only via the direct `/login` route by the authenticated owner.
3. **Resilient Session & JWT Rotation (`F-10`)**:
   - Access tokens stored in memory/session; refresh tokens trigger silent renewal via Axios response interceptors on `401 Unauthorized` without redirect loops.
4. **Optimistic UI with Automatic Rollback (`F-8`)**:
   - Post "Like" button updates count and active state immediately on click. If the network or API fails, TanStack Query reverts the UI state and notifies the user with a toast.
5. **Threaded Comments & Moderation Feedback (`F-9`)**:
   - Public visitors submit comments and receive instant notification: *"Your comment is submitted and pending moderation."*
   - Nested replies (1-level deep) with author attribution.
6. **URL Synchronized Query Filters (`F-7`)**:
   - Blog search, category selection, and tag filtering synchronize with browser search params (`?category=backend&search=django`), supporting shareable deep links.
7. **Responsive Breakpoints**:
   - Hand-crafted layout adaptations across **1280px** (Desktop), **1024px** (Tablet Landscape), **768px** (Tablet Portrait / Hamburger Menu), and **480px** (Mobile devices).

---

## 🗺️ Application Routes

### Public Pages
| Route | Component | Purpose |
|---|---|---|
| `/` | `Home.jsx` | Hero with dynamic profile, featured projects, skills grid, latest posts, contact CTA |
| `/about` | `About.jsx` | Full bio, resume download, education cards, career timeline, categorized skills |
| `/projects` | `Projects.jsx` | Filterable project catalog (Web, Mobile, API, All) with live & repository links |
| `/projects/:slug` | `ProjectDetail.jsx` | Deep-dive case study with tech stack chips and project metadata |
| `/blog` | `Blog.jsx` | Published articles grid with search bar, category pill filters, and pagination |
| `/blog/:slug` | `BlogDetail.jsx` | Article reader with Markdown syntax, view counter, like button, comments |
| `/contact` | `Contact.jsx` | Inquiry form with inline validation, social channels, and direct email |
| `/login` | `Login.jsx` | Studio owner authentication portal (hidden from navigation) |
| `*` | `NotFound.jsx` | Custom 404 page with return-to-safety navigation |

### Protected Owner Studio (`/dashboard`)
| Route | Component | Purpose |
|---|---|---|
| `/dashboard` | `Overview.jsx` | Analytics cards (Posts, Views, Likes, Messages, Comments), monthly chart |
| `/dashboard/posts` | `PostsList.jsx` | Manage posts table, status badges (Draft/Published), quick delete |
| `/dashboard/posts/new` | `PostEditor.jsx` | Markdown editor with live preview toggle, image upload, category select |
| `/dashboard/posts/:slug/edit`| `PostEditor.jsx` | Edit existing post content, update category and published state |
| `/dashboard/projects` | `ProjectsManager.jsx`| CRUD modal for projects, tech stack multi-select, cover image uploader |
| `/dashboard/skills` | `SkillsManager.jsx` | CRUD modal for skills, proficiency slider (1-100%), category selector |
| `/dashboard/experience` | `ExperienceManager.jsx`| Manage work history and education entries with start/end date pickers |
| `/dashboard/taxonomy` | `TaxonomyManager.jsx`| Create and delete blog categories and tags |
| `/dashboard/comments` | `CommentsModeration.jsx`| Moderate visitor comments: Approve, Reject, or Delete pending remarks |
| `/dashboard/messages` | `MessagesInbox.jsx` | View contact form inquiries, mark as read, reply via `mailto:` |
| `/dashboard/profile` | `ProfileSettings.jsx` | Update biographical data, avatar upload, resume PDF upload, social URLs |

---

## 🛠️ Project Structure

```
portfolio-frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── src/
│   ├── main.jsx                     # Application bootstrap & mount
│   ├── App.jsx                      # Providers (QueryClient, Auth, Theme, Toast)
│   ├── api/                         # Axios endpoints & interceptors
│   │   ├── axios.js                 # Base Axios instance with Bearer & X-Visitor-Id
│   │   ├── auth.js                  # Login & Refresh endpoints
│   │   ├── profile.js               # Singleton profile endpoints
│   │   ├── skills.js                # Skills endpoints
│   │   ├── experience.js            # Experience & Education endpoints
│   │   ├── projects.js              # Projects endpoints
│   │   ├── posts.js                 # Posts & Like toggle endpoints
│   │   ├── comments.js              # Comments & moderation endpoints
│   │   ├── taxonomy.js              # Categories & Tags endpoints
│   │   ├── contact.js               # Contact message submission
│   │   └── dashboard.js             # Owner stats & analytics
│   ├── components/
│   │   ├── ui/                      # Reusable atom components
│   │   │   ├── Button.jsx           # Gradient & outline buttons with loading states
│   │   │   ├── Card.jsx             # Glassmorphic card container with hover lift
│   │   │   ├── Badge.jsx            # Status & taxonomy tag chips
│   │   │   ├── Input.jsx            # Form input with inline validation errors
│   │   │   ├── Modal.jsx            # Accessible dialog overlay
│   │   │   ├── Skeleton.jsx         # Shimmer loader placeholders
│   │   │   ├── EmptyState.jsx       # Illustrated empty collection state
│   │   │   ├── Pagination.jsx       # Page controls for paginated lists
│   │   │   └── SocialIcons.jsx      # Clean SVG brand icons (Github, Linkedin, Twitter)
│   │   ├── layout/                  # Navigation & Footer
│   │   │   ├── Navbar.jsx           # Responsive header & theme toggle
│   │   │   ├── Footer.jsx           # Dynamic copyright & social links
│   │   │   └── PageContainer.jsx    # Centered max-1240px container
│   │   ├── home/                    # Landing page sections
│   │   │   ├── Hero.jsx
│   │   │   ├── AboutPreview.jsx
│   │   │   ├── SkillGrid.jsx
│   │   │   ├── ExperienceTimeline.jsx
│   │   │   ├── FeaturedProjects.jsx
│   │   │   ├── LatestPosts.jsx
│   │   │   └── ContactCTA.jsx
│   │   ├── blog/                    # Blog components
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostFilters.jsx
│   │   │   ├── LikeButton.jsx       # Optimistic like button
│   │   │   ├── ShareBar.jsx         # Social sharing buttons
│   │   │   ├── CommentForm.jsx      # Moderation feedback form
│   │   │   └── CommentList.jsx      # Threaded comment hierarchy
│   │   └── dashboard/               # Owner studio components
│   │       ├── Sidebar.jsx          # Dashboard navigation with badge counters
│   │       ├── StatCard.jsx         # Metric summary card
│   │       ├── DataTable.jsx        # Data table with actions
│   │       ├── ConfirmModal.jsx     # Destructive action verification
│   │       └── ImageUploader.jsx    # File drag-and-drop / preview
│   ├── context/
│   │   ├── AuthContext.jsx          # JWT authentication provider
│   │   └── ThemeContext.jsx         # Light / Dark theme toggle provider
│   ├── hooks/
│   │   ├── useDebounce.js           # Debounced input hook for search queries
│   │   └── useVisitorId.js          # Persistent UUID visitor identification
│   ├── pages/                       # Route views
│   ├── routes/
│   │   ├── AppRoutes.jsx            # Route tree definitions
│   │   └── ProtectedRoute.jsx       # Owner-only route guard
│   ├── styles/
│   │   └── tokens.css               # Design tokens (Direction D)
│   └── utils/
│       └── formatDate.js            # Relative and formatted date helpers
```

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
cd portfolio-frontend
npm install
```

### 2. Environment Configuration
Ensure `.env` matches your backend URL:
```ini
VITE_API_URL=http://127.0.0.1:8000/api
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173/`.

### 4. Build for Production
```bash
npm run build
```

---

## 🔮 What I Would Improve With More Time

1. **Next.js SSR / SSG Pre-rendering**:
   - Migrate blog pages to Next.js App Router for server-side HTML pre-rendering, generating dynamic OpenGraph Twitter cards and meta tags for peak SEO.
2. **WebSocket Live Updates**:
   - Connect Django Channels or a lightweight Pusher subscription to deliver instant notifications to the Studio when a visitor submits a comment or contact message.
3. **End-to-End Test Suite**:
   - Add Cypress or Playwright test suites covering complete visitor journeys: post likes, comment submissions, contact messaging, and owner login flows.
4. **Draft Post Preview Links**:
   - Generate secure, signed time-limited share links for unpublished draft posts so authors can preview articles before publishing.

# BBSNC – Biswa Bangla Social Networking Club App

A mobile-first React app built with **Vite + React + Tailwind CSS + React Router**.

---

## 📁 File Structure

```
bbsnc/
├── index.html                   # App entry HTML (loads Nunito font from Google)
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind + custom colors/fonts
├── postcss.config.js            # PostCSS (required by Tailwind)
│
└── src/
    ├── main.jsx                 # ReactDOM.createRoot entry point
    ├── App.jsx                  # BrowserRouter + Routes (/, /home, /account)
    ├── index.css                # Tailwind directives + global component classes
    │
    ├── data/
    │   └── mockData.js          # Rooms array + topPicks array (all mock data)
    │
    ├── components/
    │   ├── Header.jsx           # Pink top bar: title + logo + wallet badge
    │   ├── BottomNav.jsx        # Fixed bottom bar: Home & Account tabs
    │   ├── FilterTabs.jsx       # Single / Double / Multiple / All chips
    │   ├── RoomCard.jsx         # Room card: avatar, name, hosts, users, Join btn
    │   └── TopPicksRow.jsx      # Horizontal scroll row of user avatars
    │
    └── pages/
        ├── HomePage.jsx         # Filter state + room list + top picks
        └── AccountPage.jsx      # Profile, Wallet, Levels, Controls, Footer
```

---

## 🚀 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🎨 Design System

| Token             | Value                       |
|-------------------|-----------------------------|
| Primary color     | `#ff85a1` (pink-300)        |
| Header background | `bg-pink-300`               |
| Card background   | `white` + soft shadow       |
| Border radius     | `rounded-2xl` (cards), `rounded-full` (buttons/badges) |
| Font              | Nunito (Google Fonts)       |
| Button style      | `btn-primary` – full-width pill, pink |

---

## 📱 Pages & Features

### `/home` – Home Page
- **FilterTabs**: Single / Double / Multiple / All  
  State-driven: `useState('All')` filters the `rooms` array  
- **TopPicksRow**: Horizontal scrollable avatar list  
- **RoomCard**: Adapts layout based on `room.type`  
  - `single` → solo avatar + age  
  - `double` → overlapping dual avatars + two host names  
  - `multiple` → initials avatar + "Multiple Hosts"  
- **Join Room** button on every card  

### `/account` – Account Page
- Profile card: username, gender/age, level badge, country  
- Edit icon button (pencil)  
- **Wallet section**: Talktime Wallet balance + Transactions  
- **Account Center**: Levels  
- **Controls**: Blocked & Hidden List, Report A Problem, Settings  
- User ID + copyright footer  

---

## 🔧 Customization

### Change mock data
Edit `src/data/mockData.js` to add/remove rooms or top picks.

### Add a new room type
1. Add entries to `rooms` array in `mockData.js`
2. Update `FilterTabs` label array
3. Update `RoomCard` rendering logic for the new type

### Connect to a real API
Replace `import { rooms } from '../data/mockData'` in `HomePage.jsx`  
with a `useEffect` + `fetch` / Axios call.

---

## 📦 Dependencies

| Package           | Purpose                        |
|-------------------|--------------------------------|
| react             | UI library                     |
| react-dom         | DOM rendering                  |
| react-router-dom  | Client-side routing            |
| tailwindcss       | Utility-first CSS              |
| vite              | Build tool & dev server        |
| @vitejs/plugin-react | JSX transform via Babel      |

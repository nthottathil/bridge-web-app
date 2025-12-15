# Bridge App - Onboarding Flow

A responsive React application for the Bridge social networking app that connects people in curated groups of 4 through personality-based matching.

## 📁 Project Structure

```
bridge-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── index.js          # Barrel export
│   │   ├── BridgeLogo.js     # Logo component
│   │   ├── Checkbox.js       # Checkbox input
│   │   ├── NavButton.js      # Navigation buttons
│   │   ├── SelectionChip.js  # Selectable chips
│   │   ├── SliderInput.js    # Range slider
│   │   ├── SplitLayout.js    # Main layout component
│   │   └── TextInput.js      # Text input field
│   ├── screens/
│   │   ├── WelcomeScreen.js
│   │   ├── GoalsScreen.js
│   │   ├── GenderScreen.js
│   │   ├── NationalityScreen.js
│   │   ├── EthnicityScreen.js
│   │   ├── EmailScreen.js
│   │   ├── PersonalityScreen1.js
│   │   ├── PersonalityScreen2.js
│   │   ├── PersonalityScreen3.js
│   │   ├── PersonalityScreen4.js
│   │   ├── InterestsScreen.js
│   │   ├── ConnectionGoalScreen.js
│   │   ├── SkillsScreen.js
│   │   ├── BioScreen.js
│   │   ├── LocationScreen.js
│   │   └── MatchingScreen.js  # Includes matching + chat
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. **Clone or create the project directory:**
   ```bash
   mkdir bridge-app
   cd bridge-app
   ```

2. **Copy all the files into the appropriate directories** (or clone the repo)

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   The app will automatically open at [http://localhost:3000](http://localhost:3000)

## 📱 Mobile Testing

The app is fully responsive. To test on mobile:

1. **Browser DevTools:** Press F12, click the device toggle button
2. **Local Network:** Find your IP address and access `http://YOUR_IP:3000` from your phone
3. **Deploy:** Use Vercel or Netlify for quick deployment

## 🎨 Features

- **16 Onboarding Screens:** Complete user profile creation flow
- **Personality Quiz:** 4-question Big Five personality assessment
- **Interest Selection:** Ranked interest selection with categories
- **Fake Matching:** Simulated matching algorithm with loading states
- **WhatsApp-style Chat:** Group chat interface for matched users
- **Responsive Design:** Works on desktop and mobile
- **Progress Indicator:** Visual progress bar throughout onboarding

## 🛠️ Built With

- React 18
- Create React App
- CSS-in-JS (inline styles)
- DM Sans font (Google Fonts)

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized build in the `build/` folder ready for deployment.

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop the build folder to netlify.com
```

### GitHub Pages
```bash
npm install gh-pages --save-dev
# Add to package.json: "homepage": "https://yourusername.github.io/bridge-app"
# Add scripts: "predeploy": "npm run build", "deploy": "gh-pages -d build"
npm run deploy
```

## 🎯 Next Steps (from Tech Spec)

- [ ] Connect to Firebase/AWS backend
- [ ] Implement real authentication
- [ ] Build actual matching algorithm
- [ ] Add real-time chat with WebSockets
- [ ] Profile photo uploads
- [ ] Push notifications

## 📄 License

MIT

# 🚀 START HERE - Life OS Setup

Welcome to Life OS! Follow these steps to get up and running in 5 minutes.

## ✅ Prerequisites Check

Before starting, make sure you have:
- [ ] Node.js v16 or higher installed ([nodejs.org](https://nodejs.org))
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Anthropic API key (from [console.anthropic.com](https://console.anthropic.com))
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## 📦 Step 1: Verify Installation

Open terminal in the `life-os` directory and check:

```bash
node --version    # Should be v16 or higher
npm --version     # Should be 8 or higher
```

## 🔧 Step 2: Install Dependencies

All dependencies are already installed! You should see:
- ✅ `life-os/node_modules/` (backend dependencies)
- ✅ `life-os/client/node_modules/` (frontend dependencies)

If missing, run:
```bash
npm run install-all
```

## 🗄️ Step 3: Set Up MongoDB

### Option A: Local MongoDB (Easiest for Testing)

1. **Check if MongoDB is installed:**
   ```bash
   mongod --version
   ```

2. **Start MongoDB:**
   - **Windows:** `net start MongoDB` (may need admin)
   - **macOS:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

3. **Your `.env` is already set up for local MongoDB:**
   ```
   MONGODB_URI=mongodb://localhost:27017/life-os
   ```

### Option B: MongoDB Atlas (Cloud - Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (takes 5 minutes)
3. Create database user with password
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Get connection string
6. Update `life-os/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/life-os
   ```

## 🔑 Step 4: Add Anthropic API Key

1. **Get API key:**
   - Go to [console.anthropic.com](https://console.anthropic.com)
   - Sign up / Log in
   - Navigate to API Keys
   - Create new key (starts with `sk-ant-api03-...`)

2. **Add to `.env` file:**
   
   Open `life-os/.env` and update:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   ```

3. **Verify `.env` file looks like this:**
   ```
   MONGODB_URI=mongodb://localhost:27017/life-os
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   PORT=5000
   NODE_ENV=development
   ```

## 📊 Step 5: Initialize Database

Create required text search indexes:

```bash
npm run init-db
```

You should see:
```
✅ Connected to MongoDB
✅ Created text index on notes.text
✅ Created text index on decisions...
🎉 Database initialization complete!
```

## 🚀 Step 6: Start the Application

```bash
npm run dev
```

This starts BOTH servers:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

**Your browser should automatically open to `http://localhost:3000`**

## ✨ Step 7: First Use

1. **Authentication:**
   - Enter your name: e.g., "John Doe"
   - Enter your email: e.g., "john@example.com"
   - Click "Get Started"

2. **First Chat:**
   Try typing:
   > "I have 3 tasks due tomorrow, an exam next week, and a project pending. What should I prioritize?"

3. **Add a Goal:**
   - Click the 🎯 icon (top-right)
   - Click "+ Add New Goal"
   - Title: "Exercise daily"
   - Why: "To improve health and energy"
   - Click "Add Goal"
   - Click the checkbox to mark it done!

4. **Add a Note:**
   - In the side panel, click "Notes" tab
   - Type: "Feeling productive today!"
   - Click "Add Note"

## 🎉 You're All Set!

Life OS is now running. Here's what you can do:

### 💬 Chat with Your AI Counselor
- Describe your situation
- Ask for help prioritizing tasks
- Get time-blocked schedules with trade-offs
- Make decisions with AI guidance

### 🎯 Track Goals
- Add daily habits with meaningful "why" reasons
- Mark them done each day
- Build streaks 🔥
- Celebrate milestones (7, 30, 50 days)

### 📝 Journal & Reflect
- Write quick notes
- Add reflections
- Link notes to tasks
- Search your thoughts later

### 🧠 Build Decision Memory
- Every decision you make gets stored
- Bot references past decisions naturally
- "Last time you chose X because Y..."

## 🐛 Troubleshooting

### Problem: "MongoDB connection error"

**Solution:**
```bash
# Check if MongoDB is running
mongod --version

# Start it (Windows)
net start MongoDB

# Or use MongoDB Compass to start it
```

### Problem: "Anthropic API error"

**Solution:**
- Open `life-os/.env`
- Check `ANTHROPIC_API_KEY=sk-ant-api03-...`
- No spaces, no quotes around the key
- Verify key is valid on [console.anthropic.com](https://console.anthropic.com)

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Kill the process using port 5000
npx kill-port 5000

# Or change port in .env
PORT=5001
```

### Problem: Frontend won't connect to backend

**Solution:**
- Check `life-os/client/.env` has:
  ```
  REACT_APP_API_URL=http://localhost:5000/api
  ```
- Restart both servers: `npm run dev`

### Problem: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
npm run install-all
```

## 📚 Next Steps

1. **Read the docs:**
   - `README.md` - Full overview
   - `QUICKSTART.md` - Detailed setup
   - `FEATURES_CHECKLIST.md` - Test all features
   - `ARCHITECTURE.md` - How it works

2. **Customize:**
   - Modify AI personality in `server/services/claudeService.js`
   - Adjust colors in `client/tailwind.config.js`
   - Change grace period logic in `server/services/streakService.js`

3. **Deploy:**
   - See `DEPLOYMENT.md` for production deployment
   - Deploy to Railway, Vercel, or Heroku

## 🆘 Still Stuck?

1. Check the full `README.md` for detailed documentation
2. Look at `FEATURES_CHECKLIST.md` to verify setup
3. Review `TROUBLESHOOTING` section in README
4. Check browser console (F12) for frontend errors
5. Check terminal for backend errors

## 🎯 Quick Test Checklist

- [ ] MongoDB connected (see "✅ MongoDB connected" in terminal)
- [ ] Server running on port 5000
- [ ] Frontend running on port 3000
- [ ] Browser opened to `http://localhost:3000`
- [ ] Auth modal appears
- [ ] Can log in with name/email
- [ ] Chat interface loads
- [ ] Can send message and get AI response
- [ ] Can open side panel with 🎯 icon
- [ ] Can add a goal
- [ ] Can mark goal as done
- [ ] Streak increases to 1
- [ ] Can add a note
- [ ] All features working!

---

**🎉 Congratulations! You're ready to start making better decisions and building better habits with Life OS.**

**Need help?** All documentation is in the `life-os/` folder:
- README.md
- QUICKSTART.md
- ARCHITECTURE.md
- FEATURES_CHECKLIST.md
- DEPLOYMENT.md
- CONTRIBUTING.md
- VISUAL_GUIDE.md

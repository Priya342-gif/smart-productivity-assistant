# Life OS - Quick Start Guide

Get Life OS running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd life-os
npm run install-all
```

This installs dependencies for both backend and frontend.

## Step 2: Set Up MongoDB

### Option A: Local MongoDB (Recommended for testing)

1. **Install MongoDB** from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

2. **Start MongoDB**:
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. Keep default connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/life-os
   ```

### Option B: MongoDB Atlas (Cloud - Free tier)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string (replace `<password>`)
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:<password>@cluster.mongodb.net/life-os
   ```

## Step 3: Get Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up / Log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

## Step 4: Configure Environment

1. The `.env` file should already exist in `life-os/` directory
2. Open `life-os/.env` and add your Claude API key:
   ```
   MONGODB_URI=mongodb://localhost:27017/life-os
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   PORT=5000
   NODE_ENV=development
   ```

## Step 5: Run the Application

```bash
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:3000`

Your browser should automatically open to `http://localhost:3000`

## Step 6: First Time Setup

1. Enter your name and email (simple auth for MVP)
2. Start chatting! Try:
   - "I have 3 tasks due tomorrow, an exam next week, and a project pending"
   - "I want to start exercising daily"
3. Click 🎯 icon to open Goals & Notes panel
4. Add a goal and mark it done daily to build streaks!

## Common Issues

### "MongoDB connection error"
- Verify MongoDB is running: `mongod` or check service
- Test connection: `mongosh` (should connect without errors)

### "Anthropic API error"
- Double-check API key in `.env`
- Ensure no extra spaces or quotes around the key
- Verify you have API credits in Anthropic Console

### "Port 5000 already in use"
- Change PORT in `.env` to 5001 or another available port
- Or kill the process: `npx kill-port 5000`

### Frontend won't start
```bash
cd client
npm install
npm start
```

### Backend won't start
```bash
npm install
npm run server
```

## Testing the AI

Once running, try these prompts:

**Decision Making:**
> "I have 3 hours today. Should I study for exam, work on project, or exercise?"

**Goal Setting:**
> "I want to read more books"

Bot should ask "Why?" — answer to create meaningful goal.

**Daily Check-in:**
> "Yesterday I completed 2 of 3 tasks"

Bot calibrates and suggests improvements.

## What's Next?

- Add daily goals in the 🎯 panel
- Mark them done each day to build streaks
- Write reflections in Notes
- Chat with the bot about decisions — it remembers everything!
- Celebrate when you hit 7-day, 30-day milestones 🔥

## Need Help?

Check the main README.md for:
- Full API documentation
- Database schema details
- Architecture overview
- Troubleshooting guide

---

**You're all set! Start building better habits and making smarter decisions with Life OS.** 🎯

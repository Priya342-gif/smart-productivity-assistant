# 🚀 Life OS - Quick Reference Card

Keep this handy while using Life OS!

## ⚡ Quick Start Commands

```bash
# Start everything
npm run dev

# Backend only
npm run server

# Frontend only  
npm run client

# Initialize database
npm run init-db

# Install dependencies
npm run install-all
```

## 🔑 Required Setup

1. **MongoDB:** Running locally or Atlas connection string
2. **API Key:** Anthropic API key in `.env`
3. **Ports:** 5000 (backend), 3000 (frontend)

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

## 📊 Environment Variables

**Backend (`.env`):**
```bash
MONGODB_URI=mongodb://localhost:27017/life-os
ANTHROPIC_API_KEY=sk-ant-api03-...
PORT=5000
NODE_ENV=development
```

**Frontend (`client/.env`):**
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Core Features

| Feature | Icon | Location |
|---------|------|----------|
| Chat | 💬 | Main screen |
| Goals | 🎯 | Top-right icon |
| Notes | 📝 | Goals panel → Notes tab |
| Streaks | 🔥 | In each goal card |

## 🔥 Streak Milestones

- **7 days** → "Building real consistency!"
- **30 days** → "This is becoming a habit!"
- **50 days** → "You're unstoppable!"
- **100 days** → "Legendary discipline!"

## 📝 Note Types

- **📝 Quick** - Fast notes, reminders
- **💭 Reflection** - Daily reflections, journaling
- **🔗 Task-Linked** - Notes connected to specific tasks

## 💬 Chat Tips

**Good Prompts:**
- "I have 3 tasks due tomorrow and an exam next week. What should I prioritize?"
- "I want to start exercising daily. How should I begin?"
- "What did I decide last time about [situation]?"
- "How did yesterday's plan go?"

**Bot Will:**
- ✅ Show trade-offs ("Prioritizing X means Y gets delayed")
- ✅ Give time-blocked schedules
- ✅ Reference your goals and past decisions
- ✅ Ask "why" for new goals
- ✅ Be supportive, never guilt-trip

## 🗄️ Database Collections

```javascript
users         // User accounts
goals         // User goals with "why"
goalLogs      // Daily completion records
notes         // Journal entries
decisions     // Decision history with reasoning
conversations // Chat message history
```

## 🔌 API Quick Reference

### Users
```bash
POST   /api/users/auth              # Login/signup
GET    /api/users/:userId           # Get user
```

### Chat
```bash
GET    /api/chat/history/:userId    # Get messages
POST   /api/chat/message            # Send message
DELETE /api/chat/clear/:userId      # Clear chat
```

### Goals
```bash
GET    /api/goals/:userId           # Get all goals
POST   /api/goals                   # Create goal
POST   /api/goals/:goalId/toggle    # Mark done/undone
DELETE /api/goals/:goalId           # Delete goal
```

### Notes
```bash
GET    /api/notes/:userId           # Get all notes
POST   /api/notes                   # Create note
GET    /api/notes/:userId/search?q= # Search notes
DELETE /api/notes/:noteId           # Delete note
```

## 🐛 Common Issues & Fixes

### "MongoDB connection error"
```bash
# Check if running
mongod --version

# Start MongoDB (Windows)
net start MongoDB

# Start MongoDB (macOS)
brew services start mongodb-community
```

### "Anthropic API error"
- Check `.env` has valid API key
- No spaces/quotes around key
- Verify at console.anthropic.com

### "Port 5000 already in use"
```bash
npx kill-port 5000
# Or change PORT=5001 in .env
```

### "Module not found"
```bash
npm run install-all
```

### Frontend can't reach backend
- Check `client/.env` has `REACT_APP_API_URL=http://localhost:5000/api`
- Restart with `npm run dev`

## 🎨 Color Reference

```javascript
Primary:   warm-gray-800 (#292524)
Secondary: warm-gray-600 (#57534e)
Border:    warm-gray-200 (#e7e5e4)
Success:   green-500 (#10b981)
Streak:    orange-600 (#f97316)
Danger:    red-600 (#ef4444)
```

## ⌨️ Keyboard Shortcuts

- **Enter** (in chat) → Send message
- **Shift+Enter** → New line in message
- **Esc** → Close side panel (future enhancement)

## 📱 Mobile Usage

- Tap 🎯 to open panel
- Panel slides from right
- Swipe or tap X to close
- All features work on mobile

## 🧪 Quick Test

1. ✅ Send chat message → Get AI response
2. ✅ Add goal → Appears in panel
3. ✅ Mark goal done → Streak = 1
4. ✅ Add note → Appears in notes
5. ✅ Refresh page → Data persists

## 🚀 Deployment Quick Steps

1. Build frontend: `npm run build`
2. Deploy to Railway/Vercel
3. Set environment variables
4. Run `npm run init-db` on production DB
5. Test deployed URL

## 📚 Documentation Map

| Need | Read This |
|------|-----------|
| First-time setup | START_HERE.md |
| Quick setup | QUICKSTART.md |
| Feature details | README.md |
| Testing guide | TEST_SCRIPT.md |
| Architecture | ARCHITECTURE.md |
| Deploy to production | DEPLOYMENT.md |
| Contribute code | CONTRIBUTING.md |

## 🎯 Daily Usage Flow

**Morning:**
1. Open Life OS
2. Review goals in panel
3. Chat: "What should I focus on today?"
4. Mark goals as done throughout the day

**Evening:**
1. Complete final goals
2. Add reflection note
3. Chat: "How did today go?"
4. Review bot's feedback

**Weekly:**
1. Review streak progress
2. Adjust goals if needed
3. Read past notes for patterns
4. Celebrate milestones

## 💡 Pro Tips

1. **Be specific in chat** - More context = better advice
2. **Always answer "why"** - Helps bot understand your motivation
3. **Mark goals consistently** - Build streaks for motivation
4. **Review notes weekly** - Spot patterns and growth
5. **Trust the grace period** - One missed day won't break streak
6. **Celebrate milestones** - Acknowledge your progress

## 🔧 Customization Quick Edits

**Change AI personality:**
- Edit: `server/services/claudeService.js`
- Find: `SYSTEM_PROMPT`

**Change colors:**
- Edit: `client/tailwind.config.js`
- Update: `theme.extend.colors`

**Change grace period:**
- Edit: `server/services/streakService.js`
- Modify: `allowGracePeriod` parameter

**Add API endpoint:**
- Create: `server/routes/yourRoute.js`
- Register in: `server/server.js`

## 📞 Emergency Contacts

- **MongoDB Issues:** mongosh → check connection
- **API Issues:** Check Anthropic Console
- **Build Issues:** Delete node_modules, reinstall
- **Data Loss:** MongoDB backup → mongoexport

## ✅ Daily Health Check

```bash
# Backend running?
curl http://localhost:5000/health

# Frontend accessible?
curl http://localhost:3000

# MongoDB connected?
mongosh --eval "db.runCommand({ping:1})"
```

## 🎉 Success Indicators

- ✅ Chat responds within 5 seconds
- ✅ Goals save immediately
- ✅ Streaks calculate correctly
- ✅ Notes appear after adding
- ✅ No console errors
- ✅ Mobile works smoothly

---

**Keep this reference handy! Bookmark for quick access.** 🚀

*For full details, see the comprehensive documentation in the project folder.*

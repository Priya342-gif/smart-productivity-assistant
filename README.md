# Life OS

A personal decision-making and goal-tracking chatbot assistant — NOT a generic to-do app. Life OS is your personal decision engine + accountability counselor that remembers context and gives reasoned, personalized advice.

## 🎯 What Makes Life OS Different

- **Decision Memory System**: Every decision is stored with reasoning and referenced in future conversations
- **Trade-Off Analysis**: Every suggestion includes visible trade-offs (e.g., "Prioritizing X means Y gets delayed by 2 hours")
- **Counselor Personality**: Supportive, curious, non-judgmental tone — celebrates wins, reframes failures gently
- **Goal Streaks with Grace Period**: Track daily habits with 1-day grace period option
- **Conflict Detection**: Proactively flags scheduling conflicts before overwriting plans
- **Context-Aware AI**: Claude reads your goals, past decisions, and notes before responding

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js/Express
- **Database**: MongoDB with Mongoose ODM
- **AI**: Claude API (Anthropic) for intelligent responses
- **State**: Persistent storage per user

## 📋 Core Features

### 1. Main Chat Interface
- Clean, minimal ChatGPT-style UI
- AI analyzes priorities and gives time-blocked action plans
- Every suggestion shows trade-offs
- Conversation history persists across sessions

### 2. Goals & Notes Panel
- Slide-in side panel (🎯 icon)
- Add goals with "why" reasoning
- Daily checkbox + streak counter with 🔥 icon
- Milestone celebrations (7-day, 30-day, 50-day streaks)
- Simple notes section for journaling/reflections

### 3. Decision Memory System
- Stores every decision with reasoning
- MongoDB text search retrieves similar past decisions
- Bot references past patterns naturally in conversation

### 4. Conflict Detection
- Flags when new tasks conflict with existing plans
- Asks for priority before overwriting

### 5. Daily Check-in
- Bot asks how yesterday went
- Uses feedback to calibrate future suggestions
- Gently explores reasons for missed goals (never guilt-trips)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Anthropic API key (get from [Anthropic Console](https://console.anthropic.com/))

### Installation

1. **Clone and navigate to project**
   ```bash
   cd life-os
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```
   This installs dependencies for both server and client.

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```
   MONGODB_URI=mongodb://localhost:27017/life-os
   ANTHROPIC_API_KEY=your_claude_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running locally:
   ```bash
   # On Windows (if installed as service)
   net start MongoDB
   
   # On macOS/Linux
   mongod
   ```
   
   Or use MongoDB Atlas (cloud):
   - Get connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Replace `MONGODB_URI` in `.env`

5. **Run the application**
   ```bash
   npm run dev
   ```
   
   This starts both:
   - Backend server on `http://localhost:5000`
   - React frontend on `http://localhost:3000`

### Alternative: Run separately

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

## 📁 Project Structure

```
life-os/
├── server/
│   ├── models/           # MongoDB schemas (User, Goal, Note, Decision, etc.)
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic (streak calculation, Claude integration)
│   └── server.js         # Express app entry point
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js        # Main app component
│   │   └── index.css     # Tailwind styles
│   └── package.json
├── .env.example          # Environment variables template
└── package.json          # Root package with scripts
```

## 🗄️ Database Schema

### Collections

- **users**: Basic user info (name, email)
- **goals**: User goals with title, reason, active status
- **goalLogs**: Daily completion logs for streak tracking
- **notes**: Free-text notes (quick, reflection, task-linked)
- **decisions**: Stored decisions with situation, action, reasoning
- **conversations**: Chat message history

### Text Indexes

MongoDB text indexes enabled for:
- `notes.text` — search notes
- `decisions.situationSummary` and `decisions.reasoning` — find similar past decisions

## 🤖 AI Behavior

The Claude chatbot follows these rules:

1. **Always check context** (goals, past decisions, notes) before responding
2. **Always show trade-offs** when suggesting plans
3. **Always include time-blocked schedules** in action plans
4. **Never be preachy** — ground advice in user's actual data
5. **Ask "why"** when learning about new goals
6. **Reference past decisions** when similar situations arise
7. **Celebrate milestones** (7-day, 30-day streaks) with warm messages
8. **Reframe failures gently** — suggest smaller versions instead of criticizing

## 🎨 Design Philosophy

- **Clean, warm, non-corporate** — personal tool feel
- **Mobile-responsive** design
- **Integrated panel** — slides in from right, not a separate page
- **Prominent streaks** — 🔥 icon + count visually highlighted
- **Minimal friction** — quick actions, no unnecessary steps

## 🔧 API Endpoints

### Users
- `POST /api/users/auth` - Simple auth (get or create user)
- `GET /api/users/:userId` - Get user info

### Chat
- `GET /api/chat/history/:userId` - Get conversation history
- `POST /api/chat/message` - Send message, get AI response
- `DELETE /api/chat/clear/:userId` - Clear conversation

### Goals
- `GET /api/goals/:userId` - Get all goals with streaks
- `POST /api/goals` - Create new goal
- `POST /api/goals/:goalId/toggle` - Toggle daily completion
- `DELETE /api/goals/:goalId` - Delete goal (soft delete)

### Notes
- `GET /api/notes/:userId` - Get all notes
- `POST /api/notes` - Create new note
- `GET /api/notes/:userId/search?q=query` - Search notes
- `DELETE /api/notes/:noteId` - Delete note

## 📝 MVP Scope

This is v1 — focuses on core functionality:

✅ Chat interface + Claude API integration  
✅ Goals panel with add/mark-done/streak  
✅ Simple notes section  
✅ Basic decision memory (MongoDB text search)  
✅ Streak calculation with grace period  
✅ Milestone celebrations  

**Future enhancements** (not in v1):
- Vector search with embeddings
- Calendar integration
- Push notifications
- Multi-user sharing
- Advanced analytics

## 🐛 Troubleshooting

**MongoDB connection error**
- Ensure MongoDB is running: `mongod` or service is started
- Check `MONGODB_URI` in `.env`

**Claude API errors**
- Verify `ANTHROPIC_API_KEY` in `.env`
- Check API key is valid on Anthropic Console
- Ensure you have API credits

**Port already in use**
- Change `PORT` in `.env` (default: 5000)
- Or kill process using port: `npx kill-port 5000`

## 📄 License

MIT License - feel free to use and modify for personal projects.

## 🙏 Credits

Built with Claude Sonnet 4.5 as a personal productivity tool focused on thoughtful decision-making rather than checkbox completion.

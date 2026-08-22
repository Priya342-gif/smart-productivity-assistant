# Life OS - Project Summary

## 🎯 Project Overview

**Life OS** is a personal decision-making and goal-tracking chatbot assistant powered by Claude AI. Unlike generic to-do apps, Life OS acts as a personal decision engine and accountability counselor that remembers context and provides reasoned, personalized advice.

## ✨ Key Differentiators

1. **Decision Memory System** - Every decision is stored with reasoning and referenced in future conversations
2. **Trade-Off Analysis** - All suggestions include visible trade-offs (e.g., "Prioritizing X means Y gets delayed by 2 hours")
3. **Counselor Personality** - Warm, supportive, non-judgmental AI that celebrates wins and reframes failures gently
4. **Context-Aware AI** - Claude reads your goals, past decisions, and notes before responding
5. **Intelligent Streaks** - Daily habit tracking with 1-day grace period and milestone celebrations

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 + Tailwind CSS
- **Backend:** Node.js/Express
- **Database:** MongoDB with Mongoose ODM
- **AI:** Anthropic Claude API (Sonnet 4.5)
- **State Management:** Local component state + localStorage

### Project Structure
```
life-os/
├── server/
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── Goal.js
│   │   ├── GoalLog.js
│   │   ├── Note.js
│   │   ├── Decision.js
│   │   └── Conversation.js
│   ├── routes/           # Express API routes
│   │   ├── users.js      # Auth endpoints
│   │   ├── chat.js       # Chat endpoints
│   │   ├── goals.js      # Goal management
│   │   └── notes.js      # Note management
│   ├── services/         # Business logic
│   │   ├── claudeService.js     # AI integration
│   │   └── streakService.js     # Habit tracking
│   ├── scripts/
│   │   └── initDatabase.js      # DB initialization
│   └── server.js         # Express app entry
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.js
│   │   │   ├── ChatInterface.js
│   │   │   ├── SidePanel.js
│   │   │   ├── GoalsSection.js
│   │   │   └── NotesSection.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── .env                  # Environment variables
├── .env.example          # Template for env vars
├── package.json          # Root package
├── README.md             # Main documentation
├── QUICKSTART.md         # Quick setup guide
├── ARCHITECTURE.md       # Technical architecture
├── FEATURES_CHECKLIST.md # Testing checklist
├── CONTRIBUTING.md       # Contribution guidelines
└── DEPLOYMENT.md         # Deployment guide
```

## 🔑 Core Features Implemented

### 1. Chat Interface
- Clean, minimal ChatGPT-style UI
- Conversation history persistence
- Real-time AI responses with loading states
- Time-blocked action plans with trade-offs
- Auto-scroll to latest message

### 2. Goals & Streaks
- Add goals with "why" reasoning
- Daily completion checkbox
- Streak counter with 🔥 icon
- 1-day grace period (configurable)
- Milestone celebrations (7, 30, 50+ days)
- Goal deletion with confirmation

### 3. Notes & Journaling
- Three note types: quick, reflection, task-linked
- Chronological display (newest first)
- Type-based icons (📝, 💭, 🔗)
- Delete with confirmation
- Full-text search capability

### 4. AI Intelligence
- **Context awareness:** Claude reads goals, decisions, notes before responding
- **Decision memory:** Stores decisions with reasoning, retrieves similar past decisions
- **Trade-off analysis:** Every suggestion shows what you're sacrificing
- **Counselor tone:** Supportive, curious, never preachy
- **Adaptive feedback:** Uses your responses to calibrate future suggestions

### 5. Decision Memory
- Auto-saves decision-making conversations
- MongoDB text search for similar situations
- References past patterns: "Last time you prioritized X because Y"
- Outcome tracking for continuous improvement

### 6. Conflict Detection
- Flags when new tasks conflict with existing plans
- Asks for priority before overwriting
- Prevents silent commitment overriding

## 🗄️ Database Schema

### Collections

**users**
```javascript
{ _id, name, email, createdAt }
```

**goals**
```javascript
{ _id, userId, title, reason, isActive, createdAt }
```

**goalLogs** (for streak tracking)
```javascript
{ _id, goalId, userId, date (YYYY-MM-DD), completed, createdAt }
```

**notes**
```javascript
{ _id, userId, text, type, linkedGoalId, createdAt }
// Text index on: text
```

**decisions** (for AI memory)
```javascript
{ _id, userId, situationSummary, chosenAction, reasoning, outcomeFeedback, createdAt }
// Text index on: situationSummary, reasoning
```

**conversations**
```javascript
{ _id, userId, messages[{role, content, timestamp}], createdAt, updatedAt }
```

### Indexes
- Text search on `notes.text`
- Text search on `decisions.situationSummary` and `decisions.reasoning`
- Compound index on `goalLogs.goalId + date` for efficient streak queries

## 🤖 AI Behavior Design

### System Prompt Principles
1. **Always check context** - Goals, past decisions, notes loaded before each response
2. **Always show trade-offs** - "Prioritizing A means B gets delayed"
3. **Always include time blocks** - "9-10am: Study, 10-12pm: Project"
4. **Never be preachy** - Ground advice in user's actual data
5. **Ask why** - When new goals are mentioned, ask for motivation
6. **Reference past decisions** - "Last time you chose X because Y"
7. **Celebrate milestones** - Warm, specific messages for streaks
8. **Reframe failures gently** - Suggest smaller versions, never guilt-trip

### Context Window Strategy
- **Goals:** All active goals with reasons
- **Decisions:** Last 30 days of stored decisions
- **Notes:** Last 14 days of notes
- **Similar decisions:** Text search results for current query
- **Conversation:** Last 10 messages for continuity

## 📊 API Endpoints

### Users
- `POST /api/users/auth` - Simple auth (get or create user)
- `GET /api/users/:userId` - Get user info

### Chat
- `GET /api/chat/history/:userId` - Load conversation history
- `POST /api/chat/message` - Send message, get AI response
- `DELETE /api/chat/clear/:userId` - Clear conversation

### Goals
- `GET /api/goals/:userId` - Get goals with streaks and completion status
- `POST /api/goals` - Create new goal (requires title + reason)
- `POST /api/goals/:goalId/toggle` - Toggle daily completion
- `DELETE /api/goals/:goalId` - Soft delete goal

### Notes
- `GET /api/notes/:userId` - Get all notes (limit 50)
- `POST /api/notes` - Create note (quick/reflection/task-linked)
- `GET /api/notes/:userId/search?q=query` - Search notes
- `DELETE /api/notes/:noteId` - Delete note

## 🔧 Configuration

### Environment Variables
```bash
MONGODB_URI=mongodb://localhost:27017/life-os
ANTHROPIC_API_KEY=sk-ant-api03-your-key
PORT=5000
NODE_ENV=development
```

### Frontend Environment
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Anthropic API key

### Quick Start
```bash
# 1. Navigate to project
cd life-os

# 2. Install dependencies
npm run install-all

# 3. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and Anthropic API key

# 4. Initialize database indexes
npm run init-db

# 5. Run development servers
npm run dev
```

Server: `http://localhost:5000`  
Frontend: `http://localhost:3000`

## 📈 Future Enhancements (Not in MVP)

### Near-term (v2)
- [ ] Proper authentication (JWT/OAuth)
- [ ] Vector embeddings for semantic search
- [ ] Calendar view for streak history
- [ ] Export data (CSV/JSON)
- [ ] Dark mode
- [ ] Mobile app (React Native)

### Long-term
- [ ] Voice input for chat
- [ ] Calendar integration (Google Calendar)
- [ ] Advanced analytics (pattern detection)
- [ ] Goal templates library
- [ ] Weekly reflection automation
- [ ] Progress visualizations

### Explicitly Out of Scope
- ❌ Enterprise features (teams, permissions)
- ❌ Social features (sharing, competition)
- ❌ Gamification beyond streaks (points, levels)
- ❌ Rigid scheduling (calendar grid)
- ❌ Notifications (keeps it zen)

## 🎨 Design Philosophy

### Visual Design
- **Color palette:** Warm grays (not cold blue-grays)
- **Typography:** System fonts, readable sizes
- **Layout:** Clean, spacious, mobile-responsive
- **Interactions:** Smooth animations, clear hover states
- **Icons:** Emoji-based (🎯, 📝, 🔥) for warmth

### UX Principles
1. **Integrated, not bolted-on** - Side panel slides in, doesn't navigate away
2. **Minimal friction** - Quick actions, no confirmation dialogs unless destructive
3. **Context preservation** - Chat always visible, panel is overlay
4. **Streaks front-and-center** - 🔥 icon + count prominently displayed
5. **Celebratory moments** - Toast notifications for milestones

## 🧪 Testing Strategy

### Manual Testing (MVP)
- Use FEATURES_CHECKLIST.md for comprehensive testing
- Test all user flows end-to-end
- Verify mobile responsiveness
- Check error handling edge cases

### Automated Testing (v2)
- Unit tests for streak calculation (Jest)
- API integration tests (Supertest)
- Component tests (React Testing Library)
- E2E tests for critical paths (Cypress)

## 🔒 Security Considerations

### Current (MVP)
- ✅ Environment variables for secrets
- ✅ Basic input validation
- ✅ MongoDB injection prevention (Mongoose)
- ⚠️ Simple name/email auth (not secure for production)

### Production Requirements
- [ ] JWT or OAuth authentication
- [ ] Rate limiting (express-rate-limit)
- [ ] Helmet.js for security headers
- [ ] CORS restrictions (not open to all)
- [ ] Input sanitization (express-validator)
- [ ] HTTPS enforcement
- [ ] Secure session management

## 📚 Documentation

- **README.md** - Main overview and setup
- **QUICKSTART.md** - 5-minute setup guide
- **ARCHITECTURE.md** - Technical deep dive
- **FEATURES_CHECKLIST.md** - Testing and verification
- **CONTRIBUTING.md** - Contribution guidelines
- **DEPLOYMENT.md** - Production deployment guide
- **PROJECT_SUMMARY.md** - This file (high-level summary)

## 🎯 Success Metrics (If Deployed)

### User Engagement
- Daily active users
- Messages sent per user
- Goals created per user
- Average streak length
- Milestone achievement rate

### AI Quality
- Response relevance (user feedback)
- Decision memory hit rate (how often past decisions are referenced)
- Trade-off clarity (qualitative assessment)
- User retention (do people come back?)

### System Health
- API response times (< 500ms target)
- Claude API success rate (> 99%)
- Database query performance (< 100ms)
- Error rate (< 1%)

## 🙏 Credits & License

**Built with:**
- React (UI framework)
- Tailwind CSS (styling)
- Express (backend API)
- MongoDB (database)
- Anthropic Claude (AI)

**License:** MIT

**Created by:** Claude Sonnet 4.5 (AI assistant)

**Philosophy:** Life OS is intentionally simple, personal, and supportive. It's designed to help individuals make better decisions and build better habits through thoughtful AI assistance, not through notifications, gamification, or social pressure.

---

## 📞 Quick Links

- **Setup:** See QUICKSTART.md
- **Architecture:** See ARCHITECTURE.md
- **Testing:** See FEATURES_CHECKLIST.md
- **Contributing:** See CONTRIBUTING.md
- **Deployment:** See DEPLOYMENT.md

**Ready to build better habits and make smarter decisions? Start with `npm run dev`!** 🚀

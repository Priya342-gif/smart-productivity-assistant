# Life OS - Architecture Overview

## System Design Philosophy

Life OS is designed as a **personal decision engine** rather than a generic task manager. Every architectural decision prioritizes:

1. **Context retention** - remembering user patterns and past decisions
2. **Reasoning transparency** - showing why suggestions are made
3. **Gentle accountability** - tracking progress without guilt-tripping
4. **Conversational intelligence** - Claude AI grounds responses in user's actual data

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │ Chat         │  │ Goals Panel   │  │ Notes Panel     │  │
│  │ Interface    │  │ (Streaks)     │  │ (Journaling)    │  │
│  └──────────────┘  └───────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express API)                     │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │ Chat Routes  │  │ Goals Routes  │  │ Notes Routes    │  │
│  └──────────────┘  └───────────────┘  └─────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Services Layer                           │  │
│  │  • claudeService (AI integration)                     │  │
│  │  • streakService (habit tracking)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
┌─────────────▼────────┐    ┌────────────▼───────────┐
│   MongoDB Database   │    │   Anthropic Claude API  │
│   • Users            │    │   (Decision reasoning)  │
│   • Goals            │    └─────────────────────────┘
│   • GoalLogs         │
│   • Notes            │
│   • Decisions        │
│   • Conversations    │
└──────────────────────┘
```

## Core Components

### 1. Frontend (React + Tailwind)

**Components:**
- `App.js` - Main container, manages auth and panel visibility
- `AuthModal.js` - Simple name/email authentication
- `ChatInterface.js` - Main conversational UI
- `SidePanel.js` - Slide-in panel container
- `GoalsSection.js` - Goal management with streaks
- `NotesSection.js` - Note-taking and journaling

**State Management:**
- Local component state (React hooks)
- localStorage for user persistence
- No Redux/Context needed for MVP (keeps it simple)

**Styling:**
- Tailwind CSS with warm color palette
- Custom scrollbar styles
- Mobile-responsive design

### 2. Backend (Node.js + Express)

**API Routes:**

```javascript
/api/users
  POST /auth              // Get or create user
  GET /:userId            // Get user info

/api/chat
  GET /history/:userId    // Load conversation history
  POST /message           // Send message, get AI response
  DELETE /clear/:userId   // Clear conversation

/api/goals
  GET /:userId            // Get goals with streaks
  POST /                  // Create new goal
  POST /:goalId/toggle    // Toggle daily completion
  DELETE /:goalId         // Delete goal

/api/notes
  GET /:userId            // Get all notes
  POST /                  // Create note
  GET /:userId/search     // Search notes (text search)
  DELETE /:noteId         // Delete note
```

**Services:**

- **claudeService.js** - Claude API integration
  - `getUserContext()` - Fetches goals, decisions, notes
  - `getChatResponse()` - Calls Claude with context
  - `findSimilarDecisions()` - MongoDB text search
  - `tryExtractAndSaveDecision()` - Auto-saves decisions

- **streakService.js** - Habit tracking logic
  - `calculateStreak()` - Counts consecutive days with grace period
  - `markGoalDone()` - Records daily completion
  - `getStreaksForGoals()` - Batch streak calculation

### 3. Database (MongoDB)

**Collections:**

```javascript
users {
  _id, name, email, createdAt
}

goals {
  _id, userId, title, reason, isActive, createdAt
}

goalLogs {
  _id, goalId, userId, date (YYYY-MM-DD), completed, createdAt
}

notes {
  _id, userId, text, type, linkedGoalId, createdAt
  // Text index on: text
}

decisions {
  _id, userId, situationSummary, chosenAction, 
  reasoning, outcomeFeedback, createdAt
  // Text index on: situationSummary, reasoning
}

conversations {
  _id, userId, messages[{role, content, timestamp}], 
  createdAt, updatedAt
}
```

**Indexes:**
- Text search on `notes.text`
- Text search on `decisions.situationSummary` and `decisions.reasoning`
- Compound index on `goalLogs.goalId + date`

### 4. AI Integration (Claude API)

**System Prompt Design:**

The Claude system prompt defines the counselor personality:
- Always check context (goals, past decisions, notes)
- Always show trade-offs
- Always include time-blocked schedules
- Never be preachy
- Ask "why" for new goals
- Reference past decisions naturally
- Celebrate milestones warmly
- Reframe failures gently

**Context Building:**

Before each response, Claude receives:
1. **Active goals** with reasons
2. **Recent decisions** (last 30 days) with outcomes
3. **Recent notes** (last 14 days)
4. **Similar past decisions** (MongoDB text search results)

This ensures responses are grounded in user's actual patterns.

## Data Flow Examples

### Example 1: User Sends Message

```
1. Frontend: User types message in ChatInterface
2. Frontend: POST /api/chat/message { userId, message }
3. Backend: chat.js route handler
4. Backend: claudeService.getUserContext(userId)
   ├─ Fetch active goals
   ├─ Fetch recent decisions (30 days)
   ├─ Fetch recent notes (14 days)
   └─ Search similar decisions (text search)
5. Backend: Format context + message for Claude
6. Backend: Call Anthropic API
7. Backend: tryExtractAndSaveDecision() (auto-save if decision-like)
8. Backend: Save user + assistant messages to conversation
9. Backend: Return response to frontend
10. Frontend: Display assistant message
```

### Example 2: Mark Goal Done

```
1. Frontend: User clicks checkbox in GoalsSection
2. Frontend: POST /api/goals/:goalId/toggle { userId }
3. Backend: Check if already completed today
4. Backend: If not, create GoalLog entry for today (YYYY-MM-DD)
5. Backend: streakService.calculateStreak()
   ├─ Fetch all goalLogs for this goal
   ├─ Sort by date descending
   ├─ Count consecutive completed days
   └─ Apply 1-day grace period if enabled
6. Backend: Return { completedToday: true, streak: 7 }
7. Frontend: Update UI with new streak
8. Frontend: If milestone (7, 30, 50 days), show celebration toast
```

### Example 3: Streak Calculation Algorithm

```javascript
// Pseudo-code for streak calculation with grace period
function calculateStreak(goalLogs, allowGracePeriod = true) {
  streak = 0
  currentDate = today
  gracePeriodUsed = false
  completedDates = Set(goalLogs.map(log => log.date))
  
  while (true) {
    if (completedDates.has(currentDate)) {
      streak++
      currentDate = previousDay(currentDate)
      gracePeriodUsed = false // Reset grace
    } else {
      // Day was missed
      if (allowGracePeriod && !gracePeriodUsed) {
        gracePeriodUsed = true
        currentDate = previousDay(currentDate)
        continue // Skip this missed day once
      } else {
        break // Streak ends
      }
    }
  }
  
  return streak
}
```

## Key Design Decisions

### 1. Why MongoDB Text Search (Not Vector Embeddings)?

**MVP Choice:** MongoDB's built-in `$text` search is:
- ✅ Simple to set up (just create index)
- ✅ No additional API costs
- ✅ Good enough for keyword matching
- ✅ Fast for small datasets

**Future:** Can upgrade to vector embeddings (Pinecone, Weaviate) if:
- Need semantic similarity (not just keywords)
- Dataset grows large (>10k decisions)
- Want to find conceptually similar decisions

### 2. Why Store Streaks in GoalLogs (Not Goal Model)?

**Choice:** Streaks are calculated dynamically from `goalLogs` entries.

**Pros:**
- ✅ Source of truth is daily completion logs
- ✅ Can recalculate streaks with different rules (e.g., toggle grace period)
- ✅ Audit trail of all completions
- ✅ No denormalization bugs

**Cons:**
- ❌ Slightly more expensive query (but negligible for MVP)

### 3. Why Simple Name/Email Auth (Not OAuth)?

**MVP Choice:** Minimal auth for single-user experience.

**Future:** Add proper auth if:
- Multi-user households need separate accounts
- Want to sync across devices
- Need security/privacy guarantees

For MVP, localStorage + simple user model is sufficient.

### 4. Why Store Date as String (YYYY-MM-DD)?

**Choice:** `goalLogs.date` is stored as string, not Date object.

**Pros:**
- ✅ Easy to query specific day: `date: "2026-08-22"`
- ✅ No timezone issues
- ✅ Human-readable in database
- ✅ Simple comparison for consecutive days

### 5. Why Slide-In Panel (Not Separate Route)?

**Choice:** Goals/Notes are in a slide-in overlay, not separate pages.

**Reasoning:**
- ✅ Keeps context visible (chat still visible)
- ✅ Faster access (no navigation)
- ✅ Feels integrated, not bolted-on
- ✅ Mobile-friendly (can swipe closed)

## Performance Considerations

### Current Scale (MVP)
- **Users:** 1-100
- **Goals per user:** 5-20
- **Notes per user:** 100-500
- **Decisions per user:** 50-200
- **Messages per conversation:** 100-500

### Optimizations in Place
1. **Indexes** on frequently queried fields (userId, date, goalId)
2. **Text indexes** for search functionality
3. **Lean queries** (`.lean()`) for read-only operations
4. **Batch operations** (getStreaksForGoals fetches all at once)
5. **Limited result sets** (last 30 days decisions, last 14 days notes)

### Future Optimizations (If Needed)
- Add Redis for session/cache
- Paginate conversation history
- Compress old conversations
- Move to vector DB for semantic search

## Security Considerations (Production TODOs)

⚠️ **MVP has minimal security - OK for personal use, NOT production-ready**

**Before deploying publicly:**
1. Add proper authentication (JWT, OAuth, or Passport.js)
2. Implement rate limiting (express-rate-limit)
3. Sanitize user inputs (express-validator)
4. Add HTTPS/TLS
5. Environment variable validation
6. CORS restrictions (not open to all origins)
7. Helmet.js for security headers
8. MongoDB injection protection (validate IDs)

## Testing Strategy (Not in MVP)

**Recommended for v2:**
- Unit tests for streak calculation logic
- Integration tests for API endpoints
- E2E tests for critical user flows (Cypress)
- AI response quality tests (eval framework)

## Deployment (Future)

**Recommended Stack:**
- **Frontend:** Vercel or Netlify
- **Backend:** Heroku, Railway, or DigitalOcean
- **Database:** MongoDB Atlas (free tier)
- **Environment Variables:** Platform secrets management

## Monitoring & Observability (Future)

**Recommended Tools:**
- Error tracking: Sentry
- Logging: Winston + LogDNA/Papertrail
- API monitoring: Datadog or New Relic
- User analytics: Mixpanel or PostHog

---

**This architecture prioritizes simplicity and core functionality for MVP, with clear upgrade paths for scale and features.**

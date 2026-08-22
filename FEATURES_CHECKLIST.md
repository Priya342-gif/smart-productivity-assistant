# Life OS - Features Checklist

Use this checklist to verify all features are working correctly.

## ✅ Core Features

### 1. Authentication & User Management
- [ ] User can enter name and email on first visit
- [ ] User data persists in localStorage
- [ ] User can logout and log back in
- [ ] MongoDB stores user with correct schema

### 2. Chat Interface
- [ ] Clean, minimal ChatGPT-style UI loads
- [ ] User can type and send messages
- [ ] Messages display in conversation format
- [ ] User messages aligned right (dark background)
- [ ] Bot messages aligned left (light background with border)
- [ ] Loading animation shows while waiting for response
- [ ] Conversation history persists across page refreshes
- [ ] Timestamps show for each message
- [ ] Text wraps properly in message bubbles
- [ ] Scroll automatically goes to latest message

### 3. Claude AI Integration
- [ ] Bot responds to messages (not just echoing)
- [ ] Bot's responses are contextual and relevant
- [ ] Bot shows trade-offs when suggesting plans
- [ ] Bot includes time-blocked schedules in action plans
- [ ] Bot references user's goals in responses
- [ ] Bot references past decisions when relevant
- [ ] Bot asks "why" when user mentions wanting to do something new
- [ ] Bot's tone is warm, non-judgmental, supportive

### 4. Goals Panel
- [ ] 🎯 icon button opens goals panel from right
- [ ] Panel slides in smoothly with animation
- [ ] Close button (X) closes the panel
- [ ] "Add New Goal" button shows form
- [ ] Goal form has title and reason fields
- [ ] Cannot submit without filling both fields
- [ ] New goal appears in list immediately after adding
- [ ] Goals show title and reason ("why") text
- [ ] Checkbox appears next to each goal
- [ ] Clicking checkbox marks goal as done for today
- [ ] Checkbox shows checkmark when completed
- [ ] Clicking again unmarks the goal

### 5. Streak Tracking
- [ ] Streak counter shows 🔥 icon + number
- [ ] Streak is 0 for new goals
- [ ] Streak increases to 1 when marked done first time
- [ ] Streak increases each consecutive day goal is marked done
- [ ] Streak resets if a day is missed (after grace period)
- [ ] Grace period allows 1 missed day without breaking streak
- [ ] Streak displays prominently below goal title
- [ ] "Started" date shows when goal was created

### 6. Milestone Celebrations
- [ ] Notification appears when reaching 7-day streak
- [ ] Notification appears when reaching 30-day streak
- [ ] Notification appears for 50+ day streaks
- [ ] Celebration messages are warm and specific
- [ ] Notification auto-dismisses after 3 seconds

### 7. Notes Panel
- [ ] Tab switcher shows "Goals" and "Notes" options
- [ ] Clicking "Notes" tab switches to notes view
- [ ] Text area for adding new notes
- [ ] Dropdown to select note type (quick/reflection/task-linked)
- [ ] "Add Note" button creates note
- [ ] Notes appear in reverse chronological order (newest first)
- [ ] Each note shows icon based on type (📝/💭/🔗)
- [ ] Each note shows date and time created
- [ ] Delete button removes note after confirmation
- [ ] Empty state message shows when no notes exist

### 8. Decision Memory System
- [ ] Bot automatically saves decisions during conversations
- [ ] Saved decisions appear in MongoDB `decisions` collection
- [ ] Decisions include: situationSummary, chosenAction, reasoning
- [ ] When user describes similar situation, bot references past decision
- [ ] Bot says something like "Last time you prioritized X because Y"
- [ ] Text search finds relevant past decisions

### 9. Conflict Detection
- [ ] Bot flags when new task conflicts with existing plan
- [ ] Bot asks which should take priority
- [ ] Bot doesn't silently overwrite previous commitments

### 10. Daily Check-in (Soft Feature)
- [ ] Bot occasionally asks how previous day went
- [ ] Bot uses feedback to calibrate suggestions
- [ ] If goals repeatedly missed, bot asks about reasons gently
- [ ] Bot never guilt-trips or criticizes

### 11. Mobile Responsiveness
- [ ] App works on mobile viewport (320px+)
- [ ] Chat interface is usable on mobile
- [ ] Side panel slides in properly on mobile
- [ ] Buttons and inputs are touch-friendly
- [ ] Text is readable without zooming

## 🛠️ Technical Checks

### Backend (Node.js + Express)
- [ ] Server starts without errors: `npm run server`
- [ ] Health check endpoint works: `GET http://localhost:5000/health`
- [ ] MongoDB connection successful (see console)
- [ ] All routes registered: `/api/users`, `/api/chat`, `/api/goals`, `/api/notes`
- [ ] CORS enabled (frontend can call backend)
- [ ] Error handling middleware catches errors gracefully

### Frontend (React)
- [ ] Frontend starts without errors: `npm run client`
- [ ] No console errors in browser dev tools
- [ ] Tailwind CSS loads (warm gray colors visible)
- [ ] Custom scrollbar styles apply
- [ ] API calls use correct base URL

### Database (MongoDB)
- [ ] MongoDB running and accessible
- [ ] Text indexes created: `npm run init-db`
- [ ] Collections exist: users, goals, goalLogs, notes, decisions, conversations
- [ ] Data persists after server restart

### AI (Claude API)
- [ ] ANTHROPIC_API_KEY set in `.env`
- [ ] Claude API calls succeed (check server console)
- [ ] Responses are coherent and relevant
- [ ] Context (goals, decisions, notes) included in prompts
- [ ] No rate limit or API errors

## 🎯 User Experience Tests

### Test Scenario 1: New User Onboarding
1. [ ] Open app for first time
2. [ ] See auth modal with welcoming message
3. [ ] Enter name and email
4. [ ] Click "Get Started"
5. [ ] See empty chat with welcome message
6. [ ] Welcome message explains what Life OS does
7. [ ] Example prompts suggest how to start

### Test Scenario 2: Add Goal & Build Streak
1. [ ] Click 🎯 icon
2. [ ] Click "Add New Goal"
3. [ ] Enter goal: "Exercise daily"
4. [ ] Enter reason: "To improve health and energy"
5. [ ] Click "Add Goal"
6. [ ] Goal appears in list with streak = 0
7. [ ] Click checkbox to mark done
8. [ ] Streak updates to 1 with 🔥 icon
9. [ ] Wait until tomorrow, mark done again
10. [ ] Streak updates to 2
11. [ ] Continue for 7 days
12. [ ] See celebration notification on 7th day

### Test Scenario 3: Decision Making with Context
1. [ ] Add goal: "Study for exam" (reason: "Need to pass course")
2. [ ] Add goal: "Work on project" (reason: "Client deadline approaching")
3. [ ] In chat, type: "I have 3 hours today. What should I prioritize?"
4. [ ] Bot response includes:
   - [ ] References both goals
   - [ ] Shows time-blocked schedule
   - [ ] Explains trade-offs (e.g., "Prioritizing exam means project gets delayed")
   - [ ] Reasoning is grounded in user's goals
5. [ ] Later, ask similar question
6. [ ] Bot references previous decision: "Last time you prioritized..."

### Test Scenario 4: Note Taking & Reflection
1. [ ] Open Notes panel
2. [ ] Type: "Felt productive today, completed all tasks"
3. [ ] Select type: "Reflection"
4. [ ] Click "Add Note"
5. [ ] Note appears with 💭 icon
6. [ ] In chat, mention feeling unproductive
7. [ ] Bot may reference past reflection about being productive

### Test Scenario 5: Streak with Grace Period
1. [ ] Mark goal done on Day 1 → Streak = 1
2. [ ] Mark goal done on Day 2 → Streak = 2
3. [ ] Skip Day 3 (don't mark done)
4. [ ] Mark goal done on Day 4 → Streak = 3 (grace period used)
5. [ ] Skip Day 5 again
6. [ ] Check Day 6 → Streak should reset to 0 or 1 (no more grace)

### Test Scenario 6: Conversation Persistence
1. [ ] Chat with bot about multiple topics
2. [ ] Close browser tab
3. [ ] Reopen app
4. [ ] See entire conversation history loaded
5. [ ] Bot remembers context from previous messages

## 🐛 Edge Cases & Error Handling

### Error Scenarios to Test
- [ ] MongoDB not running → Shows helpful error, doesn't crash
- [ ] Invalid Anthropic API key → Shows error, doesn't crash
- [ ] Network error during message send → Shows error message
- [ ] Very long message (1000+ chars) → Handles gracefully
- [ ] Empty message → Send button disabled
- [ ] Rapid clicking send button → Only sends once
- [ ] Delete goal with existing logs → Deletes cleanly
- [ ] Two users with same email → Uses existing user
- [ ] Missing environment variables → Fails with clear error

### Performance Tests
- [ ] 100+ messages in chat → Scrolling smooth
- [ ] 20+ goals → Panel doesn't lag
- [ ] 100+ notes → Loads reasonably fast
- [ ] Long note (5000 chars) → Displays correctly
- [ ] Multiple API calls at once → No race conditions

## 📊 Data Integrity Checks

### Check MongoDB Data
```javascript
// Connect to MongoDB and verify:
db.users.find()            // Users created
db.goals.find()            // Goals with userId references
db.goalLogs.find()         // Daily completion logs
db.notes.find()            // Notes with correct types
db.decisions.find()        // Auto-saved decisions
db.conversations.find()    // Message history

// Check indexes:
db.notes.getIndexes()      // Should include text index on 'text'
db.decisions.getIndexes()  // Should include text index on situationSummary & reasoning
```

## 🎨 Visual Design Checks

- [ ] Warm gray color palette (not cold blue/gray)
- [ ] Rounded corners on buttons and cards
- [ ] Hover states on interactive elements
- [ ] Focus states on inputs (blue ring)
- [ ] Consistent spacing (Tailwind's default scale)
- [ ] Readable font sizes (not too small)
- [ ] Sufficient contrast for accessibility
- [ ] Icons are clear and recognizable

## 🚀 Final Verification

Before considering MVP complete:
1. [ ] All core features work end-to-end
2. [ ] No console errors in browser or server
3. [ ] Data persists correctly in MongoDB
4. [ ] Claude API integration working
5. [ ] Mobile responsive design verified
6. [ ] README.md and QUICKSTART.md accurate
7. [ ] `.env.example` has all required variables
8. [ ] Can run `npm run dev` and start using immediately

---

**Once all items checked, Life OS MVP is complete! 🎉**

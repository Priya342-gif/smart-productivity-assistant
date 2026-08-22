# Life OS - Test Script

Use this script to manually test all features after setup.

## 🧪 Pre-Test Setup

1. **Ensure servers are running:**
   ```bash
   npm run dev
   ```
   
2. **Open browser to:** `http://localhost:3000`

3. **Open browser console:** Press F12 (check for errors)

4. **Open server terminal:** Watch for backend logs

---

## Test 1: Authentication ✅

**Steps:**
1. See auth modal with "Life OS" title
2. Enter name: "Test User"
3. Enter email: "test@lifeOS.com"
4. Click "Get Started"

**Expected Result:**
- ✅ Modal closes
- ✅ Chat interface appears
- ✅ Header shows "Hi, Test User"
- ✅ Welcome message displays with 🎯 icon

**Verify in MongoDB:**
```bash
# Connect to MongoDB
mongosh
use life-os
db.users.find()
# Should show the test user
```

---

## Test 2: First Chat Message ✅

**Steps:**
1. Type in chat input: "I have 3 tasks due tomorrow and an exam next week. What should I prioritize?"
2. Click "Send"

**Expected Result:**
- ✅ User message appears (right-aligned, dark background)
- ✅ Loading dots animation appears
- ✅ Bot responds within 3-5 seconds
- ✅ Bot message appears (left-aligned, white background with border)
- ✅ Response is contextual and helpful
- ✅ Response shows trade-offs
- ✅ Response includes time-blocked suggestions

**Check Backend Terminal:**
- Should see: API call to Claude
- No errors

---

## Test 3: Add First Goal ✅

**Steps:**
1. Click 🎯 icon in header (top-right)
2. Panel slides in from right
3. Click "+ Add New Goal"
4. Title: "Exercise daily"
5. Why: "To improve health and energy levels"
6. Click "Add Goal"

**Expected Result:**
- ✅ Form closes
- ✅ Goal appears in list
- ✅ Shows checkbox (unchecked)
- ✅ Shows title and reason
- ✅ Shows "🔥 0 day streak"
- ✅ Shows "Started" with today's date
- ✅ Shows delete button (trash icon)

---

## Test 4: Mark Goal Complete ✅

**Steps:**
1. Click checkbox next to "Exercise daily"

**Expected Result:**
- ✅ Checkbox shows green checkmark
- ✅ Streak updates to "🔥 1 day streak"
- ✅ No errors in console

**Try clicking again:**
- ✅ Checkbox unchecks
- ✅ Streak updates back to "🔥 0 day streak"

**Click checkbox once more to mark complete again**

---

## Test 5: Add Multiple Goals ✅

**Steps:**
1. Add goal: "Read books" - "To learn and grow"
2. Add goal: "Meditate" - "To reduce stress"
3. Add goal: "Drink water" - "To stay hydrated"

**Expected Result:**
- ✅ All 4 goals appear in list
- ✅ Each has independent streak counter
- ✅ Panel is scrollable if needed

---

## Test 6: Chat References Goals ✅

**Steps:**
1. Close goals panel (X button)
2. In chat, type: "Should I focus on my health goals today?"
3. Send message

**Expected Result:**
- ✅ Bot response mentions your actual goals (exercise, water, meditate)
- ✅ Bot gives personalized advice based on your stored goals
- ✅ Response is contextual, not generic

---

## Test 7: Add Notes ✅

**Steps:**
1. Open side panel (🎯 icon)
2. Click "Notes" tab
3. Type: "Had a productive morning. Completed all workout exercises."
4. Select type: "Reflection"
5. Click "Add Note"

**Expected Result:**
- ✅ Note appears with 💭 icon
- ✅ Shows note text
- ✅ Shows "Reflection • [Today's date] [Time]"
- ✅ Shows delete button

**Add more notes:**
- "Remember to call mom" (Quick)
- "Project deadline moved to next week" (Task-linked)

---

## Test 8: Decision Memory ✅

**Steps:**
1. Switch back to chat
2. Type: "I need to decide between working on my project or studying for exam. I have 4 hours."
3. Send message
4. Read bot's response (it should give reasoned advice)
5. Wait a moment, then type: "What did I decide last time I had a similar situation?"

**Expected Result:**
- ✅ First response gives trade-off analysis
- ✅ First response stored as decision in MongoDB
- ✅ Second response references the decision just made
- ✅ Bot says something like "Just now, you were considering..."

---

## Test 9: Conversation Persistence ✅

**Steps:**
1. Refresh the page (F5)
2. Log in again if needed

**Expected Result:**
- ✅ All previous messages load in chat
- ✅ Conversation history intact
- ✅ Scroll to bottom shows latest message

---

## Test 10: Streak Simulation ✅

**Note:** This tests the streak calculation logic. To truly test multi-day streaks, you'd need to manually update the database or wait for actual days.

**Steps:**
1. Open MongoDB:
   ```bash
   mongosh
   use life-os
   
   # Find your goal ID
   db.goals.find().pretty()
   # Copy the _id of "Exercise daily"
   
   # Manually create logs for past days
   db.goalLogs.insertMany([
     {
       goalId: ObjectId("your-goal-id-here"),
       userId: ObjectId("your-user-id-here"),
       date: "2026-08-20",
       completed: true,
       createdAt: new Date()
     },
     {
       goalId: ObjectId("your-goal-id-here"),
       userId: ObjectId("your-user-id-here"),
       date: "2026-08-21",
       completed: true,
       createdAt: new Date()
     },
     {
       goalId: ObjectId("your-goal-id-here"),
       userId: ObjectId("your-user-id-here"),
       date: "2026-08-22",
       completed: true,
       createdAt: new Date()
     }
   ])
   ```

2. Refresh the frontend
3. Open goals panel

**Expected Result:**
- ✅ "Exercise daily" now shows "🔥 3 day streak"

---

## Test 11: Milestone Celebration ✅

**Steps:**
1. In MongoDB, add 7 consecutive day logs for a goal
2. Refresh frontend
3. Toggle the goal (uncheck then check)

**Expected Result:**
- ✅ Green toast notification appears (top-right)
- ✅ Message says "🎉 7-day streak! You're building real consistency!"
- ✅ Toast auto-dismisses after 3 seconds

---

## Test 12: Delete Goal ✅

**Steps:**
1. Click trash icon on "Drink water" goal
2. Confirm deletion in dialog

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Goal removed from list
- ✅ Other goals remain intact

---

## Test 13: Delete Note ✅

**Steps:**
1. Switch to Notes tab
2. Click trash icon on a note
3. Confirm deletion

**Expected Result:**
- ✅ Note removed from list
- ✅ Other notes intact

---

## Test 14: Mobile Responsiveness ✅

**Steps:**
1. Press F12 in browser
2. Click device toolbar icon (toggle device toolbar)
3. Select "iPhone 12 Pro" or similar
4. Test interface

**Expected Result:**
- ✅ Layout adjusts to mobile width
- ✅ Side panel becomes full-screen overlay
- ✅ Chat messages readable
- ✅ Buttons/inputs are touch-friendly (not too small)
- ✅ All features work on mobile

---

## Test 15: Error Handling ✅

**Test 15a: Empty Message**
1. Try clicking "Send" with empty input
- ✅ Send button is disabled

**Test 15b: Very Long Message**
1. Type 1000+ character message
2. Send it
- ✅ Handles gracefully, no crash

**Test 15c: Network Error Simulation**
1. Stop backend server (Ctrl+C in terminal)
2. Try sending a message in frontend
- ✅ Error message displays
- ✅ Frontend doesn't crash

**Restart backend:**
```bash
npm run server
```

---

## Test 16: Logout & Re-login ✅

**Steps:**
1. Click "Logout" in header
2. Auth modal reappears
3. Log in with different name/email

**Expected Result:**
- ✅ Previous user's data not visible
- ✅ New user starts with empty state
- ✅ No cross-contamination of data

---

## Test 17: Database Verification ✅

**Check all collections have data:**

```bash
mongosh
use life-os

db.users.countDocuments()        # Should have users
db.goals.countDocuments()        # Should have goals
db.goalLogs.countDocuments()     # Should have logs
db.notes.countDocuments()        # Should have notes
db.decisions.countDocuments()    # Should have decisions
db.conversations.countDocuments() # Should have conversations

# Check indexes exist
db.notes.getIndexes()
# Should include text index

db.decisions.getIndexes()
# Should include text index
```

---

## Test 18: AI Personality Check ✅

**Steps:**
1. In chat, type: "I failed to exercise today. I feel bad about it."
2. Send message

**Expected Result:**
- ✅ Bot response is supportive, NOT guilt-tripping
- ✅ Bot suggests smaller version or explores why
- ✅ Tone is warm and non-judgmental
- ✅ Bot might say things like "That's okay, what made it difficult?"

**Try another:**
1. Type: "I completed all my goals for 7 days straight!"

**Expected Result:**
- ✅ Bot celebrates genuinely
- ✅ Acknowledges the discipline and consistency
- ✅ Warm, specific praise (not generic)

---

## ✅ Final Checklist

After completing all tests:

- [ ] Authentication works
- [ ] Chat sends/receives messages with AI
- [ ] Goals can be added
- [ ] Goals can be marked done/undone
- [ ] Streaks calculate correctly
- [ ] Notes can be added
- [ ] Notes can be deleted
- [ ] Conversation persists on refresh
- [ ] Side panel opens/closes smoothly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No backend errors
- [ ] Database has all expected data
- [ ] AI personality is supportive
- [ ] Milestone celebrations work
- [ ] Decision memory references past choices

---

## 🎉 Test Results

**If all tests pass:**
✅ Life OS MVP is complete and working!

**If some tests fail:**
1. Check FEATURES_CHECKLIST.md for debugging tips
2. Review server logs for backend errors
3. Check browser console for frontend errors
4. Verify .env variables are correct
5. Ensure MongoDB is running
6. Verify Anthropic API key is valid

---

## 📊 Performance Baseline

Record these for future comparison:

- **Message response time:** ______ seconds (should be < 5s)
- **Page load time:** ______ seconds (should be < 2s)
- **Side panel animation:** Smooth? YES / NO
- **Scroll performance:** Smooth with 50+ messages? YES / NO
- **MongoDB query time:** Check server logs (should be < 100ms)

---

**Testing complete! 🚀**

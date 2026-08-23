# 🐛 Debug Notes & Timer Features

## ✅ What Works
- Chatbot ✅
- Goals ✅ (probably)
- Login/Signup ✅

## ❌ What Doesn't Work
- Notes section
- Timer/Focus session

---

## 🔍 **DIAGNOSTIC STEPS:**

### **Step 1: Check Browser Console**

1. Open your deployed frontend URL
2. Press **F12** (Developer Tools)
3. Click **"Console"** tab
4. Click on **Notes** icon/button
5. **What errors appear in console?**

**Common errors:**
- `404 Not Found` = API route not found
- `500 Internal Server Error` = Backend issue
- `Network Error` = Connection issue
- `CORS Error` = Backend not allowing requests

---

### **Step 2: Test Backend Endpoints Directly**

Open these URLs in your browser (replace with YOUR backend URL):

**Test 1: Notes API**
```
https://smart-productivity-assistant.onrender.com/api/notes/test123
```
**Expected:** Empty array `{"notes":[]}` or actual notes

**Test 2: Focus API**
```
https://smart-productivity-assistant.onrender.com/api/focus/ongoing/test123
```
**Expected:** `{"session":null}` or actual session

**What do you see?** If you get errors, that's the problem!

---

### **Step 3: Check Backend Logs**

1. Go to https://dashboard.render.com
2. Click your **backend service**
3. Click **"Logs"** tab
4. **Screenshot errors** (red text)
5. Look for:
   - MongoDB connection errors
   - Route errors
   - Model errors

---

## 🔧 **POSSIBLE FIXES:**

### **Fix 1: Models Not Loaded**

The backend might not be loading Note and FocusSession models. Check `server.js`:

**Solution:** I'll add explicit model loading

---

### **Fix 2: Routes Not Registered**

The backend might not have notes/focus routes. Check `server.js`:

Should have:
```javascript
app.use('/api/notes', require('./routes/notes'));
app.use('/api/focus', require('./routes/focus'));
```

---

### **Fix 3: MongoDB Collections Not Created**

MongoDB might not have the collections yet.

**Solution:** I'll create an initialization script

---

## 📝 **TELL ME:**

1. **What errors show in browser console?**
2. **What happens when you test the URLs above?**
3. **Any errors in Render backend logs?**

Once you tell me these 3 things, I'll know exactly what to fix! 🎯

---

## ⚡ **QUICK FIX TO TRY:**

### **Manually trigger backend redeploy:**

1. Go to Render Dashboard
2. Click backend service
3. Click **"Manual Deploy"** → "Deploy latest commit"
4. Wait 5-10 minutes
5. Test notes and timer again

Sometimes the backend needs to restart to load new routes!

---

## 🎯 **Expected Behavior:**

**Notes:**
- Should show "No notes yet" message
- Can type and add notes
- Notes appear in list below
- Can delete notes

**Timer:**
- Shows big circular timer (25:00)
- Can select different durations (15, 25, 30, 45, 60, 90 min)
- Can start timer
- Timer counts down
- Can pause/resume/stop
- Can link to a goal

---

**Let me know what you find and I'll fix it!** 🔧

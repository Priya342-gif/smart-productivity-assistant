# 🔧 TROUBLESHOOTING GUIDE

## ✅ Changes Made

1. **Improved CORS** - Backend now accepts requests from any origin
2. **Added debugging endpoints** - `/health` and `/api/test` for testing
3. **Created client `.env`** - Frontend knows where to connect
4. **Pushed to GitHub** - Render will auto-deploy

---

## 🎯 STEP-BY-STEP FIX

### **Step 1: Find Your Backend URL**

1. Go to: https://dashboard.render.com
2. Click on your **backend Web Service** (not the Static Site)
3. Look at the top - you'll see a URL like:
   ```
   https://life-os-backend-xxxx.onrender.com
   ```
   **OR**
   ```
   https://smart-productivity-assistant.onrender.com
   ```
4. **COPY THIS EXACT URL!**

---

### **Step 2: Test Your Backend**

Open your backend URL + `/health` in browser:
```
https://YOUR-BACKEND-URL.onrender.com/health
```

**You should see:**
```json
{
  "status": "ok",
  "message": "Life OS server is running",
  "mongodb": "connected"
}
```

**If you see this = Backend is working! ✅**

**If you get an error:**
- Backend might still be deploying (wait 5-10 minutes)
- Check Render logs for errors
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)

---

### **Step 3: Update Frontend Environment Variable**

1. Go to Render Dashboard
2. Click on your **frontend Static Site**
3. Click **"Environment"** in left sidebar
4. **Delete the old** `REACT_APP_API_URL` if it exists
5. **Add new one:**
   ```
   Key: REACT_APP_API_URL
   Value: YOUR-BACKEND-URL-FROM-STEP-1/api
   ```
   
   **EXAMPLE:**
   ```
   https://smart-productivity-assistant.onrender.com/api
   ```
   
   ⚠️ **CRITICAL:** Must end with `/api`

6. Click **"Save Changes"**
7. Frontend will **auto-redeploy** (5-10 minutes)

---

### **Step 4: Wait for Redeployment**

Both services should redeploy:
- **Backend:** From GitHub push (should be done already)
- **Frontend:** From environment variable change (5-10 minutes)

**Check deployment status:**
- Go to each service in Render
- Look for green "Live" badge
- Check "Events" tab for deployment progress

---

### **Step 5: Test Your Live App**

1. **Open frontend URL** (your Static Site URL)
2. **Open browser console** (F12 → Console tab)
3. **Try to login/signup**
4. **Check console for errors**

**What to look for:**
- ✅ No red errors = Working!
- ❌ "Network Error" = Backend URL wrong
- ❌ "CORS Error" = Wait for backend to redeploy
- ❌ "404 Not Found" = Missing `/api` in URL

---

## 🐛 Common Issues & Fixes

### **Issue 1: "Network Error" or "ERR_CONNECTION_REFUSED"**

**Cause:** Frontend can't reach backend

**Fix:**
1. Check backend URL in frontend environment variables
2. Make sure it ends with `/api`
3. Test backend `/health` endpoint directly
4. Check if backend is "Live" in Render

---

### **Issue 2: "CORS Error"**

**Cause:** Backend not allowing frontend domain

**Fix:**
- Wait for backend to redeploy with new CORS settings
- Check backend logs in Render
- Should see: "Server running on port 10000"

---

### **Issue 3: "Cannot POST /api/users/register"**

**Cause:** Backend routes not working

**Fix:**
1. Check MongoDB connection in backend logs
2. Go to MongoDB Atlas → Network Access
3. Add IP: 0.0.0.0/0 (allow all)
4. Restart backend service in Render

---

### **Issue 4: Frontend loads but buttons don't work**

**Cause:** JavaScript errors or API URL missing

**Fix:**
1. Open browser console (F12)
2. Look for red errors
3. Check if `REACT_APP_API_URL` is set in Render
4. Redeploy frontend after adding variable

---

### **Issue 5: "API key invalid" or AI not responding**

**Cause:** Gemini API key not set in backend

**Fix:**
1. Go to backend service in Render
2. Environment tab
3. Check `GEMINI_API_KEY` is set to your actual API key
4. Save and redeploy if needed

---

## 🔍 Debugging Commands

### **Test Backend Health:**
```
https://YOUR-BACKEND-URL.onrender.com/health
```

### **Test Backend API:**
```
https://YOUR-BACKEND-URL.onrender.com/api/test
```

### **Check Frontend Console:**
1. Open your frontend URL
2. Press F12
3. Click "Console" tab
4. Look for errors (red text)
5. Screenshot and share if needed

---

## ✅ Success Checklist

After fixing, verify:
- [ ] Backend `/health` shows "ok" and "connected"
- [ ] Backend `/api/test` shows success message
- [ ] Frontend loads with login page
- [ ] Can create account (check browser console)
- [ ] Can login
- [ ] Can send chat message
- [ ] AI responds
- [ ] Can add goal
- [ ] Timer works
- [ ] Voice button appears

---

## 🆘 Still Not Working?

### **Provide this info:**

1. **Backend URL:** _________________
2. **Frontend URL:** _________________
3. **Backend `/health` response:** (screenshot or copy-paste)
4. **Frontend browser console errors:** (screenshot)
5. **Backend logs from Render:** (screenshot)

### **Where to find logs:**
- Render Dashboard → Click service → "Logs" tab
- Browser console → F12 → Console tab

---

## 📋 Current Configuration

**Backend should have these environment variables:**
```
MONGODB_URI = your_mongodb_connection_string
GEMINI_API_KEY = your_gemini_api_key
NODE_ENV = production
PORT = 10000
```

**Frontend should have:**
```
REACT_APP_API_URL = https://your-backend-url.onrender.com/api
```

---

## 🎯 Quick Test Script

Open browser console on frontend and run:
```javascript
// Test if API URL is set
console.log('API URL:', process.env.REACT_APP_API_URL);

// Test backend connection
fetch('YOUR-BACKEND-URL/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Error:', e));
```

Replace `YOUR-BACKEND-URL` with actual URL.

---

**Good luck! You're almost there! 🚀**

# 🆓 Get Your FREE Google Gemini API Key

## ✨ Good News: Gemini is 100% FREE!

Google Gemini API offers a **generous free tier** with:
- ✅ **No credit card required**
- ✅ **60 requests per minute**
- ✅ **1 million tokens per day** (way more than you need!)
- ✅ **Unlimited projects**
- ✅ **Never expires**

Perfect for Life OS! 🎉

---

## 🚀 Get Your Free API Key (2 Minutes)

### Step 1: Go to Google AI Studio

Open your browser and go to:
```
https://aistudio.google.com/app/apikey
```

### Step 2: Sign In with Google

- Click "Sign in" (top-right)
- Use any Google account (Gmail, etc.)
- No payment info needed!

### Step 3: Create API Key

1. Click **"Create API Key"** button
2. Choose **"Create API key in new project"**
3. Wait 5 seconds while it creates

### Step 4: Copy Your Key

1. Your API key will appear (starts with `AIza...`)
2. Click the **Copy** icon
3. Keep this key safe!

**Example key format:**
```
AIzaSyAbc123_ExampleKey_xyz789
```

---

## 🔧 Add Key to Life OS

### Step 1: Open .env File

Navigate to:
```
life-os/.env
```

Open it in any text editor (Notepad, VS Code, etc.)

### Step 2: Update GEMINI_API_KEY

Find this line:
```
GEMINI_API_KEY=your_free_gemini_api_key_here
```

Replace with your actual key:
```
GEMINI_API_KEY=AIzaSyAbc123_ExampleKey_xyz789
```

### Step 3: Save the File

Save and close `.env`

---

## ✅ You're Ready!

Your `.env` file should now look like:
```
MONGODB_URI=mongodb://admin:YourPassword@ac-lfb2yyn...
GEMINI_API_KEY=AIzaSyAbc123_ExampleKey_xyz789
PORT=5000
NODE_ENV=development
```

---

## 🚀 Launch Life OS

Now run:
```bash
cd life-os
npm run init-db
npm run dev
```

Open: `http://localhost:3000`

---

## 📊 Gemini Free Tier Limits

**What you get for FREE:**
- **Requests:** 60 per minute (1 per second)
- **Tokens:** 1 million per day
- **Model:** Gemini 1.5 Flash (fast & smart)
- **Cost:** $0.00 forever!

**Is this enough for Life OS?**
- ✅ YES! Even with heavy use, you won't hit limits
- Average message: ~500 tokens
- You can send ~2000 messages per day
- That's way more than anyone needs!

---

## 🔒 Security Tips

### Keep Your API Key Safe
- ❌ Don't share it publicly
- ❌ Don't commit to GitHub (already in .gitignore)
- ✅ Keep it in `.env` file only

### If Your Key Gets Exposed
1. Go to https://aistudio.google.com/app/apikey
2. Delete the old key
3. Create a new one
4. Update `.env` file

### API Key Restrictions (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Find your API key
3. Add restrictions:
   - IP restrictions (whitelist your IP)
   - API restrictions (only Generative AI)

---

## 🆚 Gemini vs Claude

| Feature | Gemini (Free) | Claude (Paid) |
|---------|--------------|---------------|
| Cost | **FREE forever** | $5-20/month |
| Speed | ⚡ Very fast | Fast |
| Quality | Excellent | Excellent |
| Limit | 1M tokens/day | Based on plan |
| Setup | No card needed | Credit card required |

**For Life OS:** Gemini is perfect! Same great experience, zero cost.

---

## 🧪 Test Your API Key

After adding the key, test it:

```bash
cd life-os
npm run dev
```

Then in the app:
1. Enter name and email
2. Send a message: "Hello, test message"
3. If AI responds → ✅ Working!
4. If error → Check key in `.env` file

---

## 🐛 Troubleshooting

### Error: "API key not valid"

**Solution:**
1. Check for typos in `.env` file
2. Make sure no spaces around the key
3. Key should start with `AIza`
4. Regenerate key at aistudio.google.com

### Error: "GEMINI_API_KEY is not defined"

**Solution:**
1. Make sure `.env` file exists in `life-os/` folder
2. Check the variable name is exactly `GEMINI_API_KEY`
3. Restart the server: `npm run dev`

### Error: "Rate limit exceeded"

**Solution:**
- Very unlikely! Free tier allows 60/min
- If you hit it, wait 1 minute and try again
- Consider adding small delay between requests

### Error: "Resource exhausted"

**Solution:**
- You've used 1 million tokens today (extremely rare)
- Resets at midnight Pacific Time
- Or create another free API key with different Google account

---

## 💡 Pro Tips

1. **One key is enough:** No need for multiple keys
2. **Free forever:** Google confirms no plans to charge
3. **No card ever:** You won't be asked for payment
4. **Unlimited keys:** Can create multiple if needed
5. **Works globally:** No geographic restrictions

---

## 📚 Additional Resources

**Gemini API Documentation:**
https://ai.google.dev/tutorials/get_started_web

**Pricing & Limits:**
https://ai.google.dev/pricing

**Google AI Studio:**
https://aistudio.google.com

**API Key Management:**
https://aistudio.google.com/app/apikey

---

## ✅ Quick Checklist

Before launching Life OS:
- [ ] Visited aistudio.google.com/app/apikey
- [ ] Signed in with Google account
- [ ] Created new API key
- [ ] Copied the key (starts with AIza)
- [ ] Pasted into life-os/.env file
- [ ] Saved .env file
- [ ] Ready to run npm run dev!

---

## 🎉 That's It!

You now have a **FREE, unlimited AI** for Life OS!

**No credit card. No charges. Ever.** 🎊

Next steps:
1. Add MongoDB password to `.env`
2. Run `npm run init-db`
3. Run `npm run dev`
4. Start using Life OS!

---

## ❓ FAQ

**Q: Will I be charged?**
A: No! Free tier is permanent, no card required.

**Q: What if I exceed limits?**
A: Very unlikely! 1M tokens/day = ~2000 messages.

**Q: Can I upgrade later?**
A: Yes, but you won't need to for personal use.

**Q: Is Gemini as good as Claude?**
A: Yes! Same quality, just free!

**Q: How long does the key last?**
A: Forever! No expiration.

---

**Ready to get started? Visit https://aistudio.google.com/app/apikey now!** 🚀

*Updated: August 22, 2026*
*Gemini 1.5 Flash - FREE forever*

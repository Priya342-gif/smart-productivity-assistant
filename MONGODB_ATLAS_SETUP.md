# MongoDB Atlas Configuration - Life OS

## ✅ MongoDB Atlas Configured

Your `.env` file has been updated with MongoDB Atlas connection string.

### 📊 Current Configuration

**Database Provider:** MongoDB Atlas (Cloud)  
**Database Name:** `chatbot`  
**Cluster:** `ac-lfb2yyn...ykx50zz.mongodb.net`  
**Features:** SSL/TLS, Replica Set, Authentication, Auto-backups

---

## 🔐 REQUIRED: Complete Your Setup

### Step 1: Add Your Database Password

1. **Open the file:**
   ```
   life-os/.env
   ```

2. **Find this line:**
   ```
   MONGODB_URI=mongodb://admin:<db_password>@...
   ```

3. **Replace `<db_password>` with your actual MongoDB password:**
   ```
   MONGODB_URI=mongodb://admin:YourActualPassword@...
   ```
   
   ⚠️ **Remove the angle brackets** `< >`  
   ⚠️ **Use your MongoDB user password** (from Atlas dashboard)

### Step 2: Add Your Anthropic API Key

1. **Get your API key:**
   - Go to: https://console.anthropic.com
   - Sign up / Log in
   - Navigate to API Keys
   - Create new key (starts with `sk-ant-api03-`)

2. **Update `.env` file:**
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   ```

---

## 🚀 Initialize and Start

### 1. Initialize Database Indexes

```bash
cd life-os
npm run init-db
```

**Expected output:**
```
✅ Connected to MongoDB
✅ Created text index on notes.text
✅ Created text index on decisions...
🎉 Database initialization complete!
```

### 2. Start the Application

```bash
npm run dev
```

**You should see:**
```
✅ MongoDB connected
🚀 Server running on port 5000
```

### 3. Open Browser

Navigate to: `http://localhost:3000`

---

## 🔍 Verify MongoDB Atlas Connection

### Using MongoDB Compass (GUI)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Use your connection string (with password filled in)
3. Connect and browse your `chatbot` database

### Using mongosh (CLI)

```bash
mongosh "mongodb://admin:YourPassword@ac-lfb2yyn-shard-00-00.ykx50zz.mongodb.net:27017/chatbot?ssl=true&replicaSet=atlas-jwtckk-shard-0&authSource=admin"

# Once connected:
use chatbot
show collections
db.users.find()
```

---

## 📦 Collections Created

After running the app, these collections will be created in `chatbot` database:

1. **users** - User accounts
2. **goals** - User goals with reasons
3. **goalLogs** - Daily completion records
4. **notes** - Journal entries (with text index)
5. **decisions** - Decision history (with text index)
6. **conversations** - Chat message history

---

## 🌐 MongoDB Atlas Dashboard

Access your database at: https://cloud.mongodb.com

**What you can do:**
- View data in Collections tab
- Monitor performance in Metrics
- Set up alerts
- Download backups
- Manage users and permissions
- Scale your cluster (if needed)

---

## 🔒 Security Best Practices

### Current Setup ✅
- ✅ SSL/TLS encryption enabled
- ✅ Authentication required (admin user)
- ✅ Replica set for availability

### Recommended for Production
1. **IP Whitelist:**
   - In Atlas: Network Access
   - Add specific IPs instead of 0.0.0.0/0

2. **Create Database-Specific User:**
   - Don't use `admin` user in production
   - Create user with limited permissions:
     ```
     User: lifeOS_app
     Role: readWrite on chatbot database
     ```

3. **Rotate Passwords:**
   - Change password periodically
   - Use strong passwords (16+ chars)

4. **Enable Audit Logs:**
   - Available in Atlas (paid tiers)
   - Track all database operations

---

## 🐛 Troubleshooting

### Error: "Authentication failed"

**Cause:** Wrong password or username

**Solution:**
1. Check password in `.env` (no angle brackets)
2. Verify user exists in Atlas: Database Access
3. Ensure user has permissions on `chatbot` database

### Error: "Connection timeout"

**Cause:** IP not whitelisted

**Solution:**
1. Go to Atlas: Network Access
2. Add your IP address
3. Or use `0.0.0.0/0` for testing (allow all IPs)

### Error: "SSL/TLS error"

**Cause:** Missing SSL in connection string

**Solution:**
- Ensure `ssl=true` is in connection string
- Already configured in your `.env`

### Error: "Cannot connect to replica set"

**Cause:** Network issues or wrong replica set name

**Solution:**
- Check all shard addresses are reachable
- Verify `replicaSet=atlas-jwtckk-shard-0` is correct
- Test from MongoDB Compass first

---

## 📊 Database Performance

### Expected Performance (Atlas Free Tier M0)
- **Storage:** 512 MB included
- **RAM:** 512 MB shared
- **Connections:** 500 max concurrent
- **Backups:** Automatic daily backups
- **Uptime:** 99.95% SLA

### Monitoring
1. Go to Atlas Dashboard
2. Click "Metrics" tab
3. Monitor:
   - Query execution time
   - Connection count
   - Storage usage
   - Network traffic

---

## 💡 Pro Tips

1. **Use Connection Pooling:**
   - Already configured in Mongoose
   - Default pool size: 100 connections

2. **Enable Indexes:**
   - Run `npm run init-db` after first deploy
   - Indexes improve search performance

3. **Monitor Storage:**
   - Free tier: 512 MB limit
   - Check usage in Atlas dashboard
   - Clean old data if needed

4. **Backup Strategy:**
   - Atlas does automatic daily backups
   - Export important data manually: `mongoexport`

---

## 🔄 Migration from Local MongoDB

If you were using local MongoDB and want to migrate data:

```bash
# Export from local
mongoexport --db=life-os --collection=users --out=users.json
mongoexport --db=life-os --collection=goals --out=goals.json
# ... repeat for all collections

# Import to Atlas
mongoimport --uri="mongodb://admin:password@..." --db=chatbot --collection=users --file=users.json
mongoimport --uri="mongodb://admin:password@..." --db=chatbot --collection=goals --file=goals.json
# ... repeat for all collections
```

---

## 📞 Need Help?

**MongoDB Atlas Documentation:**
https://docs.atlas.mongodb.com/

**Support:**
- Atlas: support.mongodb.com
- Life OS: See README.md and TROUBLESHOOTING section

**Connection String Format:**
```
mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
```

---

## ✅ Quick Verification Checklist

Before starting the app:
- [ ] `.env` file has database password (no `<db_password>`)
- [ ] `.env` file has Anthropic API key
- [ ] MongoDB Atlas IP whitelist includes your IP (or 0.0.0.0/0)
- [ ] Database user has readWrite permissions on `chatbot` database
- [ ] Connection string includes `/chatbot` for database name
- [ ] `npm run init-db` executed successfully
- [ ] No connection errors in terminal

---

## 🎉 You're Ready!

Your MongoDB Atlas database is configured and ready to use with Life OS.

**Next Steps:**
1. Edit `.env` with your password and API key
2. Run `npm run init-db`
3. Run `npm run dev`
4. Start using Life OS!

**Your data is now stored securely in the cloud with automatic backups!** ☁️

---

*Database: chatbot*  
*Provider: MongoDB Atlas*  
*Region: (Check Atlas dashboard)*  
*Updated: August 22, 2026*

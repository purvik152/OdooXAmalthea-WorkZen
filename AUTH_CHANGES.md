# 🔄 Authentication System - JSON File Storage (TEMPORARY)

## ✅ What Changed

The authentication system has been updated to use **JSON file storage** instead of localStorage. This is a **temporary solution** for development/demo purposes.

## 📦 How It Works Now

### **1. User Data Storage**
- All user data is stored in `/data/users.json`
- File is automatically created on first use
- Data persists between server restarts

### **2. API Routes**
New API endpoint created: `/app/api/auth/route.js`
- Handles login, signup, update, and delete operations
- Reads/writes to JSON file on server-side
- Returns JSON responses

### **3. Authentication Flow**

#### **Signup Process:**
```javascript
// User fills signup form → Submit
// Frontend calls: POST /api/auth with action="signup"
// Backend saves user to users.json
// Returns success with generated Login ID
```

#### **Login Process:**
```javascript
// User enters email/loginId + password → Submit
// Frontend calls: POST /api/auth with action="login"
// Backend verifies credentials from users.json
// Returns user data (without password)
// Cookie set with 24-hour expiry
```

#### **Session Management:**
- User info stored in browser cookie (not localStorage)
- Cookie checked on page load to restore session
- Cookie cleared on logout

## 🧪 Testing

### **Default Test Account**
```
Login ID: OIADMI20250001
Email: admin@odoo.com
Password: Admin@123
Role: Admin
```

### **Test Signup Flow**
1. Go to `/signup`
2. Fill in all fields:
   - Company Name: Test Company
   - Name: Test User
   - Email: test@test.com
   - Phone: 1234567890
   - Password: Test@123
3. Click "SIGN UP"
4. Note the auto-generated Login ID
5. Login using email or Login ID + password

## 🔍 Viewing Stored Data

You can view all registered users in:
```
/data/users.json
```

**Note**: This file is in `.gitignore` so it won't be committed to Git.

## 📁 Files Modified

1. **`/app/api/auth/route.js`** (NEW)
   - Server-side API handling all auth operations
   - CRUD operations on users.json

2. **`/app/context/auth-context.jsx`** (UPDATED)
   - `login()` now calls API instead of localStorage
   - `signup()` now calls API instead of localStorage
   - Session restored from cookie instead of localStorage

3. **`/app/page.jsx`** (UPDATED)
   - Login handler now awaits API response
   - Better error handling with try-catch

4. **`/app/signup/page.jsx`** (UPDATED)
   - Signup handler now awaits API response
   - Better error handling with try-catch

5. **`/.gitignore`** (UPDATED)
   - Added `/data` to ignore list

6. **`/data/users.json`** (NEW)
   - Initial user data file with default admin account

## ⚠️ Important Warnings

### **This is TEMPORARY - DO NOT USE IN PRODUCTION**

**Why this approach is NOT production-ready:**
1. ❌ Passwords stored in **plain text** (not hashed)
2. ❌ No encryption for sensitive data
3. ❌ File-based storage doesn't scale
4. ❌ No concurrent write protection
5. ❌ No backup/recovery mechanism
6. ❌ Security vulnerabilities (cookie-based auth without JWT)

### **For Production, You MUST:**
1. ✅ Use a proper database (MongoDB, PostgreSQL, MySQL)
2. ✅ Hash passwords with bcrypt/argon2
3. ✅ Implement JWT tokens for authentication
4. ✅ Add rate limiting and CSRF protection
5. ✅ Use environment variables for secrets
6. ✅ Implement proper session management
7. ✅ Add input sanitization and validation
8. ✅ Use HTTPS only

## 🚀 Migration Path to Production

When ready to move to production:

1. **Choose a Database**
   - MongoDB (NoSQL - easy to start)
   - PostgreSQL (SQL - robust)
   - Supabase (Firebase alternative)

2. **Update API Routes**
   - Replace file operations with database queries
   - Keep the same endpoint structure (`/api/auth`)

3. **Add Security**
   ```javascript
   import bcrypt from 'bcrypt'
   import jwt from 'jsonwebtoken'
   
   // Hash password
   const hashedPassword = await bcrypt.hash(password, 10)
   
   // Generate JWT
   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
   ```

4. **Environment Variables**
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_secret_key
   ```

## 📊 Current File Structure

```
WorkZen/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── route.js         # Auth API handler
│   ├── context/
│   │   └── auth-context.jsx     # Updated to use API
│   ├── page.jsx                  # Login page (updated)
│   └── signup/
│       └── page.jsx              # Signup page (updated)
├── data/
│   └── users.json               # User data storage (gitignored)
├── .gitignore                    # Added /data to ignore
├── DATA_STORAGE.md              # Storage documentation
└── AUTH_CHANGES.md              # This file
```

## 🎯 Summary

- ✅ Authentication now uses JSON file storage
- ✅ All user data persists between server restarts
- ✅ API-based approach (ready for database migration)
- ✅ Better error handling and validation
- ⚠️ **TEMPORARY solution for demo purposes only**
- 🚀 Easy to migrate to production database later

**Test the system with the default admin account and create new users via signup!**

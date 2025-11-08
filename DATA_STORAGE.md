# WorkZen - Temporary JSON File Storage

## 📁 Data Storage Location

User authentication data is temporarily stored in a JSON file:
- **Path**: `/data/users.json`
- **Format**: JSON file with array of user objects

## 🔐 Default Test User

For testing purposes, a default admin account is included:

```
Login ID: OIADMI20250001
Email: admin@odoo.com
Password: Admin@123
Role: Admin
```

## 📝 User Data Structure

Each user object contains:

```json
{
  "loginId": "OIADMI20250001",
  "companyName": "Odoo India",
  "name": "Admin User",
  "email": "admin@odoo.com",
  "phone": "+91 9876543210",
  "password": "Admin@123",
  "logo": null,
  "role": "Admin",
  "avatar": "A",
  "createdAt": "2025-11-08T00:00:00.000Z"
}
```

## 🔧 API Endpoints

### **POST** `/api/auth`
- **Login**: `{ "action": "login", "email": "user@example.com", "password": "pass123" }`
- **Signup**: `{ "action": "signup", ...userData }`

### **GET** `/api/auth`
- Get all users: `/api/auth`
- Get specific user: `/api/auth?email=user@example.com` or `/api/auth?loginId=OIADMI20250001`

### **PUT** `/api/auth`
- Update user: `{ "loginId": "OIADMI20250001", ...updates }`

### **DELETE** `/api/auth`
- Delete user: `/api/auth?loginId=OIADMI20250001`

## ⚠️ Important Notes

1. **This is a TEMPORARY solution for demo/development purposes only**
2. **Do NOT use in production** - Passwords are stored in plain text
3. The `/data` directory is in `.gitignore` to prevent committing user data
4. File will be auto-created if it doesn't exist
5. For production, migrate to a proper database (MongoDB, PostgreSQL, etc.)

## 🚀 How It Works

1. **Signup**: User data is saved to `users.json` via POST `/api/auth`
2. **Login**: Credentials are verified against `users.json` data
3. **Session**: User info stored in browser cookie (24-hour expiry)
4. **Logout**: Cookie is cleared

## 🔄 Migration to Database

To migrate to a real database:
1. Keep the same API endpoints (`/api/auth`)
2. Replace file system operations with database queries
3. Add proper password hashing (bcrypt)
4. Implement JWT tokens instead of cookies
5. Add rate limiting and security measures

## 📊 File Location

```
WorkZen/
├── app/
│   └── api/
│       └── auth/
│           └── route.js    # API handler
├── data/
│   └── users.json          # User data storage (auto-created)
└── DATA_STORAGE.md         # This file
```

## 🧪 Testing

You can test the system by:
1. Logging in with the default admin account
2. Creating new users via the signup page
3. Viewing the `data/users.json` file to see stored data

**Remember**: This is a hackathon/demo solution. Always use proper database solutions in production!

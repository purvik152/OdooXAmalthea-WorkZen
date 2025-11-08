# Backup of Removed Features for Hackathon

This file contains all the code that was removed/commented for the hackathon demo.
You can restore these features later when needed.

## Sidebar Navigation Items (components/sidebar.jsx)

### Removed Menu Items:
```jsx
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Clock, label: "Attendance", href: "/attendance" },
  { icon: Clock, label: "Leave Management", href: "/leave" },     // REMOVED
  { icon: Banknote, label: "Payroll", href: "/payroll" },        // REMOVED
  { icon: BarChart3, label: "Reports", href: "/reports" },       // REMOVED
]
```

## Routes to Keep for Hackathon Demo:
- ✅ `/` - Login page
- ✅ `/dashboard` - Dashboard
- ✅ `/attendance` - Attendance Management
- ✅ `/users` - User Management (Admin only)

## Routes Temporarily Hidden:
- ❌ `/leave` - Leave Management
- ❌ `/payroll` - Payroll Management
- ❌ `/reports` - Reports
- ❌ `/settings` - Settings (if implemented)
- ❌ `/profile` - User Profile (if implemented)

## To Restore Later:
1. Uncomment the lines in `components/sidebar.jsx`
2. The page files still exist in:
   - `app/leave/page.jsx`
   - `app/payroll/page.jsx`
   - `app/reports/page.jsx`
3. Ensure imports in sidebar are still present:
   - `Banknote` icon for Payroll
   - `BarChart3` icon for Reports

## Notes:
- All page files are kept intact, just hidden from navigation
- Users can't accidentally navigate to hidden pages via sidebar
- Direct URL access would still work if someone knows the routes
- Consider adding middleware to block access to these routes during demo if needed

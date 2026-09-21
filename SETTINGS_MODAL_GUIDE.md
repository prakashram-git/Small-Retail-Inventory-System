# ⚙️ Settings Modal - Quick Guide

## What Changed?

✅ **Settings Tab Removed** - No longer takes up navigation space
✅ **Settings Icon Activated** - Click the gear icon in the header to access all admin features
✅ **Compact Modal Design** - All settings in one clean, organized popup window

---

## 📍 How to Access Settings

### Method 1: Click Settings Icon (Recommended)
1. Look at the header top-right area
2. Find the **gear icon** ⚙️ (next to Notification bell 🔔)
3. Click it to open the settings modal
4. Settings modal pops up with all admin features

### Method 2: Keyboard
- No keyboard shortcut (coming soon)

---

## 🎯 Navigation Inside Settings Modal

The modal has **3 tabs** at the top:

### 📺 Display Tab
- **Dark/Light Mode Toggle**
  - Enable/Disable dark theme
  - Button changes based on current state
  - Changes apply instantly

### 🏢 Brand Tab
- **Brand Name** (e.g., "RedHill Inventory")
- **Shop Location** (e.g., "Singapore Central Mall")
- Each has a Save button
- Updates reflect across the app immediately

### 👥 Users Tab
- **User Count** displayed at the top
- **Add User Button** (green)
- **User List** - all active users with:
  - Name and email
  - Role selector (Staff/Manager/Admin)
  - Status toggle (Active/Inactive)
  - Delete button (trash icon)

---

## ✨ Features at a Glance

| Feature | Location | Action |
|---------|----------|--------|
| Dark Mode | Display Tab | Toggle button |
| Brand Name | Brand Tab | Edit & Save |
| Shop Location | Brand Tab | Edit & Save |
| Add User | Users Tab | Click "Add User" |
| Change Role | Users Tab | Dropdown select |
| Toggle Status | Users Tab | Click status icon |
| Delete User | Users Tab | Click trash icon |

---

## 📊 User Management Workflow

### Add a New User
1. Click Settings icon ⚙️
2. Go to **Users** tab
3. Click **"Add User"** button
4. Fill in the form:
   - Full Name
   - Email
   - Role (Staff/Manager/Admin)
5. Click **"Create"** button
6. User appears in the list immediately

### Change User Role
1. In **Users** tab
2. Find the user in the list
3. Click the role dropdown
4. Select new role
5. Changes apply instantly

### Disable a User
1. In **Users** tab
2. Find the user
3. Click the status icon (✓ or ○)
4. Status toggles between Active/Inactive
5. Inactive users cannot log in

### Delete a User
1. In **Users** tab
2. Click the red trash icon
3. Confirm in dialog
4. User is permanently removed

---

## 👥 User Roles Quick Reference

### 🔴 Admin
```
✅ Full system access
✅ Manage all users
✅ Edit all settings
✅ View all reports
✅ Delete inventory
```
**Best for:** Shop owners, senior managers

### 🔵 Manager
```
✅ Manage inventory
✅ View analytics
✅ Create reports
✅ View activities
❌ Cannot manage users
❌ Cannot edit settings
```
**Best for:** Store managers, supervisors

### ⚪ Staff
```
✅ Update stock
✅ Log movements
✅ View products
✅ Create basic reports
❌ Cannot edit settings
❌ Cannot manage users
```
**Best for:** Sales staff, clerks

---

## 🎨 UI/UX Details

### Modal Design
- **Size**: Takes up ~60-70% of screen width
- **Max Height**: 90% of viewport (scrollable inside)
- **Backdrop**: Semi-transparent dark overlay
- **Close Button**: X button in top-right corner
- **Click Outside**: Close by clicking modal backdrop (coming soon)

### Tabs
- **Active Tab**: Blue color with underline
- **Inactive Tab**: Gray text
- **Tab Switch**: Instant, no lag
- **Tab Labels**: Display badges (e.g., "Users (4)")

### Forms
- **Input Fields**: Standard text inputs
- **Dropdowns**: Role selectors
- **Buttons**: Color-coded (Green=Add, Blue=Save, Red=Delete)
- **Feedback**: Toast notifications confirm actions

---

## 📱 Responsive Design

### Desktop (1920px+)
- Full width modal
- All content visible
- No scrolling needed (usually)

### Tablet (768px)
- Slightly narrower modal
- Some content may scroll
- Touch-friendly buttons

### Mobile (375px)
- Full screen modal (almost)
- Scrollable content
- Large touch targets

---

## 🔐 Security Notes

✅ Settings modal only accessible to Admin users
✅ User creation/deletion logged
✅ Role changes are immediate
✅ Status toggle prevents login without deletion

---

## 💡 Tips & Best Practices

### Efficiency
1. **Batch Operations**: Add multiple users at once
2. **Quick Role Changes**: No need to delete/recreate
3. **Status Toggle**: Use this instead of deletion for temporary disable
4. **Email Consistency**: Use format: firstname@redhill.com

### Monitoring
- Check user count in Users tab
- Review "Last Login" dates
- Archive inactive users monthly
- Update brand info seasonally

---

## 🔄 Keyboard Shortcuts (Future)

Coming soon:
- `Esc` - Close modal
- `Tab` - Navigate between fields
- `Enter` - Submit form
- `Ctrl+S` - Save settings

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal won't open | Click settings icon again, refresh if needed |
| Changes not saving | Check for error messages in toast notifications |
| User not appearing | Verify email is filled correctly |
| Can't delete user | Confirm user exists and you have admin access |
| Dark mode not working | Refresh page, check browser compatibility |

---

## 📞 Support

For issues, check:
1. Toast notifications for error messages
2. Browser console for JavaScript errors
3. Ensure you have admin access
4. Try refreshing the page

---

## 🎉 Summary

The settings modal replaces the settings tab with a cleaner, more compact design. All admin features (dark mode, brand settings, user management) are now accessible from the gear icon in the header, keeping the navigation clean and organized.

**Access it now:** Click ⚙️ icon in the top-right corner!

---

**Version**: 2.0 (Modal Edition)
**Last Updated**: September 22, 2026

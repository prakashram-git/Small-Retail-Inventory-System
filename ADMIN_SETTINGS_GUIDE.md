# 🏪 Admin Settings & User Management Guide

## Overview
The Admin Settings page provides shop owners and administrators with full control over system configuration, brand settings, and user management with role-based access control.

---

## 📍 Accessing Settings

1. Click the **Settings** tab in the header navigation (7th tab)
2. URL: `http://localhost:3000/settings`
3. Only accessible by admin users

---

## 🎨 Display Settings

### Dark/Light Mode Toggle
- **What it does**: Switch between light and dark themes
- **Current Status**: Shows whether dark mode is enabled or disabled
- **How to use**: Click "Enable" or "Disable" button to toggle
- **Features**:
  - Persists across page navigation
  - Affects entire application UI
  - Light theme (default): Easy on the eyes for daily use
  - Dark theme: Reduces eye strain in low-light environments

---

## 🏢 Brand Settings

### Brand Name
- **Field**: Input text box
- **Default**: "RedHill Inventory"
- **How to update**:
  1. Modify the brand name in the text field
  2. Click "Save" button
  3. Brand name updates immediately across the app
  4. Success notification displayed

### Shop Location
- **Field**: Input text box
- **Default**: "Singapore Central Mall"
- **How to update**:
  1. Modify the location in the text field
  2. Click "Save" button
  3. Location updates in dashboard and reports
  4. Success notification displayed

---

## 👥 User Management

### Overview Section
Shows real-time stats:
- **Total Users**: Count of active users
- **Admins**: Number of admin accounts
- **Staff**: Number of staff members

### Adding New Users

#### Step-by-Step:
1. Click **"Add User"** button (green button)
2. Fill in the form:
   - **Full Name**: User's complete name
   - **Email Address**: Company email (e.g., name@redhill.com)
   - **Role**: Select from dropdown:
     - Staff (basic access)
     - Manager (enhanced access)
     - Admin (full access)
3. Click **"Create User"** button
4. User appears in the users table immediately

#### Example:
```
Name: Vikram Singh
Email: vikram@redhill.com
Role: Manager
```

---

## 👤 User Roles & Privileges

### Admin Role 🔴
**Full System Control**
- ✅ Full system access
- ✅ Manage all users
- ✅ Edit all settings
- ✅ View all reports
- ✅ Delete/modify inventory
- ✅ Access system logs
- **Best for**: Shop owners, senior managers

### Manager Role 🔵
**Inventory & Operations Management**
- ✅ Manage inventory (add/update/delete products)
- ✅ View analytics and reports
- ✅ Create and export reports
- ✅ View user activity
- ✅ Manage stock movements
- ❌ Cannot manage users
- ❌ Cannot access settings
- **Best for**: Store managers, supervisors

### Staff Role ⚪
**Basic Operations**
- ✅ Update stock levels
- ✅ Log stock movements
- ✅ View product information
- ✅ Create basic reports
- ❌ Cannot edit settings
- ❌ Cannot manage users
- ❌ Cannot delete products
- **Best for**: Sales staff, inventory clerks

---

## 📋 User Management Table

### Columns Explained:

| Column | Description |
|--------|-------------|
| **Name** | User's full name |
| **Email** | Company email address |
| **Role** | Current role (Staff/Manager/Admin) |
| **Status** | Active (✓) or Inactive (○) |
| **Last Login** | Date of most recent login |
| **Actions** | Delete button (red) |

### Actions Available:

#### Change User Role
1. Click the role dropdown for any user
2. Select new role: Staff, Manager, or Admin
3. Changes apply immediately
4. Success notification shown

#### Toggle User Status
1. Click the status icon (checkmark or circle)
2. Switches between Active ✓ and Inactive ○
3. Inactive users cannot log in
4. Useful for temporary disabling without deletion

#### Delete User
1. Click the red trash icon
2. Confirm deletion in dialog
3. User is removed from system
4. Cannot be undone - be careful!

---

## 🔐 Security Features

### Access Control
- Settings page only accessible by Admin users
- Role-based permissions enforced
- User activities are logged

### Best Practices
1. **Admin Accounts**: Create 2-3 admin users for redundancy
2. **Manager Access**: Assign managers to handle daily operations
3. **Staff Access**: Grant staff only what they need
4. **Inactive Users**: Mark users as inactive instead of deleting
5. **Regular Audits**: Review user list monthly

---

## 📊 Example Admin Setup

### Small Shop (1-5 employees)
```
Admin:     You (Shop Owner) + 1 backup
Manager:   Store Manager
Staff:     2-3 Sales/Inventory staff
```

### Medium Shop (5-15 employees)
```
Admin:     Shop Owner + 1 backup manager
Manager:   2-3 Department heads
Staff:     8-10 Sales/Operations staff
```

### Large Shop (15+ employees)
```
Admin:     Owner + Regional Manager
Manager:   5-6 Section managers
Staff:     15+ Distributed across sections
```

---

## 💡 Tips & Tricks

### Efficiently Managing Users
1. **Bulk Add**: Can add users one at a time (consider building a bulk import)
2. **Quick Role Change**: Change roles without deleting/recreating
3. **Status Toggle**: Use this instead of deleting for temporary disable
4. **Email Format**: Use consistent email format: firstname@redhill.com

### Monitoring
1. Check "Last Login" column to identify inactive users
2. Review user count monthly
3. Archive inactive users after 90 days
4. Update brand info annually

---

## 🚨 Important Notes

⚠️ **Deletion is Permanent**: Deleted users cannot be recovered
⚠️ **Last Admin Warning**: Keep at least 1 active admin account
⚠️ **Email Uniqueness**: Each email should be unique
⚠️ **Access Control**: Respect role-based permissions

---

## 📞 Support

For issues with:
- **Dark Mode**: Refresh page if styles don't update
- **User Not Showing**: Verify email is entered correctly
- **Permission Denied**: Confirm you have admin access
- **Settings Not Saving**: Check for error notifications

---

## 🔄 Future Features (Planned)

- [ ] Bulk user import from CSV
- [ ] Two-factor authentication (2FA)
- [ ] Activity audit logs
- [ ] Password reset functionality
- [ ] Email notifications for user actions
- [ ] Department/section assignments
- [ ] Shift schedule management
- [ ] Custom role creation

---

**Last Updated**: September 21, 2026
**Version**: 1.0

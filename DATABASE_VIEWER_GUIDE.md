# Database Viewer Guide

## 📍 Access Database Viewer

**Location:** Admin Settings → Database Manager (bottom of page)

**How to Access:**
1. Log in to the application
2. Click **Settings** in the sidebar (gear icon)
3. Scroll to bottom of page
4. Find "Database Manager" section
5. Click **Show** to expand

---

## 🎯 Features

### 1. **Statistics Overview** (Collapsed View)

When collapsed, displays quick stats in boxes:
- **Products:** Total number of products
- **Movements:** Stock movement entries
- **Suppliers:** Number of suppliers
- **Total Value:** Total inventory value in currency

### 2. **Full Database View** (Expanded View)

When expanded, shows:

#### Statistics
- Product count
- Movement history
- Purchase Orders
- Goods Receipts
- Invoices
- Stocktakes
- Suppliers
- Total Inventory Value
- Last Saved timestamp

#### Database Content
Two view modes:
- **Formatted Summary:** Human-readable list of data
- **Raw JSON:** Full JSON with syntax highlighting (toggle with eye icon)

#### Action Buttons

| Button | Action | Purpose |
|--------|--------|---------|
| **Fetch from Server** | GET /api/inventory/load | Load latest data from database file |
| **Download JSON** | Downloads file | Save database as `inventory_YYYY-MM-DD.json` |
| **Copy to Clipboard** | Copies JSON | Paste into another system or backup |
| **Clear Database** | Clears all data | Delete all saved data (confirmation required) |

---

## 📊 What's Shown in Statistics

### Basic Counts
```
Products:          10
Movements:         50
Purchase Orders:   3
Goods Receipts:    3
Invoices:          15
Stocktakes:        2
Suppliers:         3
```

### Financial Data
```
Total Inventory Value: $5,234.56
Last Saved: 2026-09-22 at 14:30:45
```

---

## 💾 How to Use Each Feature

### View Database Content

**Collapsed View (Quick Peek):**
1. Settings → Database Manager
2. See summary stats without expanding

**Expanded View (Detailed):**
1. Click **Show** button
2. View formatted summary or raw JSON
3. Toggle eye icon to switch between formats

### Fetch Latest Data from Server

```
1. Click "Fetch from Server" button
2. Wait for loading to complete
3. Toast shows "Database loaded from server"
4. Check browser console (F12) for data
```

**Use when:**
- You want to see what's saved on the server
- You made changes on another device
- You want to verify server sync

### Download Database

```
1. Click "Download JSON" button
2. File "inventory_2026-09-22.json" downloads
3. File ready for backup or transfer
```

**Use when:**
- Creating a backup
- Transferring data to another system
- Auditing what's been saved
- Sharing data with another team

### Copy Database to Clipboard

```
1. Click "Copy to Clipboard" button
2. Wait for "Copied!" confirmation
3. Paste anywhere (editor, message, etc)
```

**Use when:**
- Pasting into email or chat
- Saving to another document
- Testing/debugging

### Clear Database

```
1. Click "Clear Database" button
2. Confirm in dialog: "Are you sure?"
3. All data deleted
4. Toast shows "Database cleared"
5. App starts fresh with mock data
```

⚠️ **Warning:** This cannot be undone! Clear only if you intend to start over.

---

## 🔍 Reading the JSON View

### Structure

```json
{
  "products": [
    {
      "id": "prod-1234567890",
      "sku": "CHOC-001",
      "name": "Dark Chocolate Bar",
      "currentStock": 12,
      "unitPrice": 4.50,
      ...
    }
  ],
  "movements": [
    {
      "id": "mov-1234567890",
      "productId": "prod-1",
      "type": "sale",
      "quantity": -5,
      "timestamp": "2026-09-22T14:30:00Z",
      ...
    }
  ],
  "purchaseOrders": [...],
  "goodsReceipts": [...],
  "invoices": [...],
  "stocktakes": [...],
  "suppliers": [...],
  "lastSaved": "2026-09-22T14:30:00Z"
}
```

### What Each Section Contains

| Section | Contains |
|---------|----------|
| `products` | All products with details |
| `movements` | All stock movements (history) |
| `purchaseOrders` | All purchase orders |
| `goodsReceipts` | All goods receipt notes |
| `invoices` | All customer invoices |
| `stocktakes` | All physical count records |
| `suppliers` | All supplier information |
| `lastSaved` | When data was last auto-saved |

---

## 🛠️ Common Tasks

### Task 1: Backup Your Data

```
1. Settings → Database Manager → Show
2. Click "Download JSON"
3. Save file to safe location
4. Repeat weekly for regular backups
```

### Task 2: Check What's Saved

```
1. Settings → Database Manager → Show
2. View statistics at the top
3. See product count, movement history, etc
4. Check "Last Saved" time
```

### Task 3: Verify Data Sync

```
1. Make a change (add product)
2. Wait 30 seconds
3. Settings → Database Manager
4. Click "Fetch from Server"
5. Check if product appears in data
```

### Task 4: Export for Another System

```
1. Settings → Database Manager → Show
2. Click "Copy to Clipboard"
3. Open target system
4. Paste the JSON
5. Import as needed
```

### Task 5: Start Fresh

```
1. Settings → Database Manager → Show
2. Click "Clear Database"
3. Confirm deletion
4. App restarts with mock data
5. Begin entering new data
```

---

## 📱 Mobile View

On mobile devices:
- Database Manager appears at bottom of settings
- Collapsed by default to save space
- Click **Show** to expand full features
- All buttons remain functional
- JSON view scrollable horizontally

---

## ⚡ Quick Tips

### Best Practices
- ✅ Download backups weekly
- ✅ Check "Last Saved" to confirm auto-save is working
- ✅ Use "Fetch from Server" to verify sync
- ✅ Copy data before major changes
- ✅ Monitor Total Inventory Value

### Troubleshooting
- ❌ Data not showing? Click "Fetch from Server"
- ❌ Want to restore? Use downloaded backup file
- ❌ Check Last Saved time - should be recent
- ❌ Clear cache (F12 → Storage → Clear All) if stuck

---

## 📊 Statistics Meaning

| Stat | Meaning |
|------|---------|
| **Products** | Total product SKUs in inventory |
| **Movements** | Total transactions (sales, purchases, adjustments) |
| **Purchase Orders** | Total PO documents created |
| **Invoices** | Total customer invoices |
| **Stocktakes** | Physical count audits completed |
| **Suppliers** | Total vendor records |
| **Total Inventory Value** | (Current Stock × Unit Price) summed across all products |
| **Last Saved** | Timestamp of most recent auto-save |

---

## 🔐 Security Notes

### What's Included
- ✅ All product data (SKU, prices, stock)
- ✅ Complete movement history
- ✅ All transaction records
- ✅ Supplier information

### What's NOT Included
- ✗ User credentials
- ✗ Passwords
- ✗ Authentication tokens
- ✗ System logs

### When Downloading
- Ensure you're on a secure network
- Don't share files with unauthorized people
- Store backups securely
- Delete temporary exports after use

---

## 💡 Use Cases

### Case 1: Regular Backup
**Weekly backup:**
1. Every Monday morning
2. Click "Download JSON"
3. Save with current date
4. Keep 4 weeks of backups

### Case 2: Disaster Recovery
**If data corruption:**
1. Find backup file
2. Clear current database (Settings)
3. Manually reimport from backup
4. Verify data integrity

### Case 3: Data Migration
**Moving to new system:**
1. Download database
2. Open JSON in text editor
3. Understand the structure
4. Migrate to target system
5. Verify all data imported

### Case 4: Auditing
**Monthly audit:**
1. Check product count
2. Verify total inventory value
3. Review movement history
4. Compare against manual records

### Case 5: Testing
**Before major changes:**
1. Download current database
2. Make changes in app
3. If issues occur, clear and reimport
4. Resume with data intact

---

## ❓ FAQ

**Q: How often is data auto-saved?**
A: Every 30 seconds automatically

**Q: Will clearing the database delete my files?**
A: No, it only clears the in-memory store. Backups remain safe.

**Q: Can I undo a clear?**
A: Only if you have a downloaded backup. There's no undo.

**Q: Where is the database stored?**
A: File: `/data/inventory.json` and browser localStorage

**Q: Is the JSON encrypted?**
A: No. It's plain text. Keep backups secure.

**Q: Can I edit the JSON and reimport?**
A: You can edit the file, but manual reimport isn't automated yet. Use the app UI to add data.

**Q: What if "Last Saved" is very old?**
A: Data may not be syncing. Check server status or manually fetch.

**Q: Can I schedule automatic backups?**
A: Not yet. Use the download feature for manual backups.

---

## 📞 Support

**Issue: Database not showing data**
→ Click "Fetch from Server" to reload

**Issue: Statistics look wrong**
→ Check "Last Saved" time, refresh browser

**Issue: Can't download**
→ Check browser download settings, try copying instead

**Issue: Worried about data loss**
→ Download backup regularly, keep multiple copies

---

## ✅ Summary

The Database Manager in Settings gives you complete visibility and control over your inventory data:

- **View** what's saved with statistics
- **Download** for backups and transfer
- **Copy** data for sharing
- **Fetch** latest from server
- **Clear** to start fresh

**Status:** ✅ Ready to use in production


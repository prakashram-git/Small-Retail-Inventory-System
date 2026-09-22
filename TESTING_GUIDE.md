# Comprehensive Testing Guide

## Complete Retail Workflow Testing

This guide walks you through testing the entire professional retail inventory system end-to-end.

---

## 1. DASHBOARD TESTING

### Expected Features:
- ✅ Total Products count
- ✅ Total Inventory Value (cost × qty)
- ✅ Low Stock Alerts (items ≤ reorder level)
- ✅ Sales (Last 30 Days)
- ✅ Top Moving Products
- ✅ Low Stock Table with center-aligned values
- ✅ Debug info showing product count

### Test Steps:
1. Go to **Dashboard** (home page)
2. **Verify Metrics:**
   - Should show "10 products" (from mock data)
   - Inventory value should be > $0
   - Low stock count should show items with qty ≤ reorder level
   - Sales value should display in currency format
   - All numeric values should be centered except SKU/Product columns

3. **Check Recent Movements:**
   - Should show last 4 movements with icons
   - Purchase = green ↗ icon
   - Sale = red ↘ icon
   - Adjustment = yellow − icon
   - Return/Damage/Theft = colored icons

4. **Verify Responsive Design:**
   - On mobile: table columns should collapse
   - On desktop: all columns visible

---

## 2. PRODUCTS PAGE TESTING

### Expected Features:
- ✅ Professional form with sections (Basic Info, Pricing, Stock, Organization)
- ✅ Add, Edit, Delete products
- ✅ Real-time search by name/SKU
- ✅ Sort by any column (name, SKU, stock, price, margin)
- ✅ Filter by status / low-stock
- ✅ Profit margin % calculation
- ✅ Stock status badges (Critical/Low/Healthy/Overstocked)
- ✅ Supplier and location info

### Test Steps:

**Add a New Product:**
1. Click "Add Product" button
2. Fill form sections:
   - **Basic Info:** SKU (TEST-001), Name (Test Product), Description
   - **Pricing:** Cost ($5), Selling Price ($12)
   - **Stock:** Current (10), Min (5), Reorder (20), Max (100)
   - **Organization:** Category, Supplier, Location
   - **Status:** Active
3. Click "Save Product"
4. **Verify:**
   - Toast shows "Product added"
   - Product appears in table
   - Profit margin shows ~140%
   - Stock status shows "Healthy" badge
   - Dashboard "Total Products" increased

**Edit Product:**
1. Click pencil icon on any product
2. Change values (e.g., increase stock)
3. Click "Update Product"
4. **Verify:** Changes appear in table

**Search:**
1. Type "chocolate" in search box
2. **Verify:** Only Dark Chocolate Bar shows

**Sort:**
1. Click "Price" column header
2. **Verify:** Products sorted by price ascending
3. Click again to sort descending

**Filter:**
1. Select "Low Stock" filter
2. **Verify:** Only products ≤ reorder level show
3. Select "Active Only"
4. **Verify:** Only active products show

**Delete:**
1. Click trash icon
2. Confirm deletion
3. **Verify:** Toast shows success, product disappears

---

## 3. SUPPLIERS PAGE TESTING

### Expected Features:
- ✅ Add/Edit supplier information
- ✅ Performance metrics (on-time %, quality %)
- ✅ Star rating system
- ✅ Lead time tracking
- ✅ Contact information
- ✅ Search functionality

### Test Steps:

**Add Supplier:**
1. Click "Add Supplier" button
2. Fill form:
   - Company: "Test Supplier Co"
   - Lead Time: 5 days
   - Contact Person, Email, Phone
   - Address details
   - Payment Terms: "Net 30"
3. Click "Add Supplier"
4. **Verify:** Card appears with info

**View Performance:**
1. Check supplier card
2. **Verify:** Shows
   - Lead time (5 days)
   - On-Time delivery % (0% initially)
   - Quality score (initially 0%)
   - Star rating

**Edit Supplier:**
1. Click pencil icon
2. Change lead time to 3 days
3. Click "Update Supplier"
4. **Verify:** Card updates

**Search:**
1. Type "Fresh" in search
2. **Verify:** Shows "Fresh Beverages Inc."

---

## 4. STOCKTAKE PAGE TESTING

### Expected Features:
- ✅ Create new stocktake
- ✅ Filter by category
- ✅ Physical count entry
- ✅ Variance calculation (real vs system)
- ✅ Recent stocktakes history
- ✅ Variance analysis

### Test Steps:

**Create Stocktake:**
1. Click "Start Stocktake"
2. Keep "All Products" selected
3. Enter counts for some products:
   - Dark Chocolate: 15 (system: 12) → +3 variance
   - Orange Juice: 25 (system: 28) → -3 variance
   - Others: leave blank (will use system qty)
4. Click "Create Stocktake"
5. **Verify:**
   - Toast shows "Stocktake created"
   - Summary cards update
   - Stocktake appears in "Recent Stocktakes"

**Review Variance:**
1. Check "Variance Analysis" section
2. **Verify:** Shows items with non-zero variance
   - Dark Chocolate: +3 (blue highlight)
   - Orange Juice: -3 (red highlight)

**Filter by Category:**
1. Create new stocktake
2. Filter by "Beverages"
3. **Verify:** Only beverage products show
4. Make changes
5. Create stocktake
6. **Verify:** Only counted items in stocktake

---

## 5. REPORTS PAGE TESTING

### Expected Features:
- ✅ Dynamic KPI cards
- ✅ Sales by category chart
- ✅ Low stock items list
- ✅ Profit margins ranking
- ✅ Supplier performance metrics
- ✅ Inventory aging analysis
- ✅ Date range selector

### Test Steps:

**KPI Cards:**
1. Verify cards show:
   - Total Inventory Value (sum of stock × price)
   - Total Sales (30-day period)
   - Low Stock Items (count)
   - Inventory Turnover (ratio)

**Sales by Category:**
1. Check chart with categories
2. **Verify:** Shows sales distribution
   - Beverages should be highest
   - Bar widths proportional to sales

**Low Stock Report:**
1. **Verify:** Shows products ≤ reorder level
   - Dark Chocolate (12 ≤ 50)
   - Gummy Bears (5 ≤ 40)
   - Instant Coffee (8 ≤ 45)

**Profit Margins:**
1. Top items should show highest %
2. **Verify:** Profit margin % calculated correctly
   - Water: (2.50-1.20)/1.20 = 108%
   - Gummy Bears: (5.99-3.50)/3.50 = 71%

**Supplier Performance:**
1. Shows top suppliers with:
   - Company name
   - Star rating
   - On-time delivery %
   - Quality score %

**Inventory Aging:**
1. Shows oldest stock first
2. Items > 30 days show red highlighting
3. Shows stock value for each item

**Date Range:**
1. Select "Last 7 Days"
2. **Verify:** Sales decrease (fewer sales in 7 days)
3. Select "Last 365 Days"
4. **Verify:** Sales increase (annual sales)

---

## 6. STOCK MOVEMENTS PAGE TESTING

### Expected Features:
- ✅ All movement history
- ✅ Filter by type (Purchase/Sale/Adjustment/Return/Damage/Theft)
- ✅ Display icons for each type
- ✅ Reference tracking (PO/Invoice ID)
- ✅ Quantity and timestamp

### Test Steps:

1. Go to **Stock Movements**
2. **Verify** shows table with:
   - Product name
   - SKU
   - Quantity (+ for in, - for out)
   - Movement type with icon
   - Timestamp
   - Reference ID (if applicable)

3. Click on a movement
4. **Verify:** Shows details

---

## 7. QUICK ACTIONS (MODALS) TESTING

### 7.1 Sale Modal

**Test Sale Transaction:**
1. Click Dashboard → Quick Actions → "Sale"
2. Select product: "Orange Juice"
3. Quantity: 5
4. Click "Record Sale"
5. **Verify:**
   - Toast: "Sale recorded"
   - Dashboard: "Sales (Last 30 Days)" increased
   - Orange Juice stock decreased (28 → 23)
   - Movement added to Stock Movements

### 7.2 Purchase Modal

**Test Purchase Transaction:**
1. Click Dashboard → "Purchase"
2. Select product: "Dark Chocolate"
3. Quantity: 20
4. Cost per unit: $2.50
5. Supplier: "Premium Sweets Inc."
6. Click "Record Purchase"
7. **Verify:**
   - Toast: "Purchase recorded"
   - Stock increased (12 → 32)
   - Movement shows with reference

### 7.3 Adjust Modal

**Test Stock Adjustment:**
1. Click Dashboard → "Adjust"
2. Select product: "Gummy Bears"
3. Quantity: -3 (damage)
4. Reason: "Damaged units"
5. Click "Adjust Stock"
6. **Verify:**
   - Stock decreased (5 → 2)
   - Movement records reason
   - Dashboard low stock badge still shows (2 ≤ 40)

### 7.4 Stocktake Modal

**Test Stocktake Adjustment:**
1. Click Dashboard → "Stocktake"
2. Select product: "Coffee"
3. Counted quantity: 5 (system: 8)
4. Click "Apply Adjustment"
5. **Verify:**
   - Stock adjusted (8 → 5)
   - Movement shows "Stocktake adjustment"

---

## 8. DARK MODE TESTING

### Test Theme Toggle:
1. Click moon icon in header
2. **Verify:** Entire page turns dark
3. All text remains readable
4. Colors adjust appropriately
5. Refresh page
6. **Verify:** Dark mode persists (localStorage working)
7. Click sun icon
8. **Verify:** Returns to light mode

---

## 9. RESPONSIVE DESIGN TESTING

### Mobile (375px width):
1. Open on phone or use browser dev tools
2. **Verify:**
   - All inputs are touch-friendly
   - Tables collapse or scroll horizontally
   - Buttons remain clickable
   - Form elements stack vertically
   - No horizontal scroll

### Tablet (768px width):
1. **Verify:**
   - 2-column layouts appear
   - Grid adjusts to 2 columns
   - All content visible

### Desktop (1920px width):
1. **Verify:**
   - Full grid layouts
   - All columns visible
   - Optimal spacing

---

## 10. COMPLETE WORKFLOW TEST (End-to-End)

### Scenario: Replenish Low Stock Product

**Day 1: Identify Need**
1. Dashboard shows Chocolate is low (12 ≤ 50)
2. Go to Products page
3. Click on "Dark Chocolate" → see stock status "Critical"

**Day 1: Create Purchase Order** (via Quick Action)
1. Click Purchase modal
2. Select Dark Chocolate
3. Qty: 50 @ $2.50 = $125
4. Supplier: Premium Sweets
5. Confirm

**Day 1: Verify Stock Updated**
1. Products page: Dark Chocolate now 62
2. Dashboard: No longer shows in Low Stock
3. Reports: Profit margin still 80%

**Day 2: Sell Some Units**
1. Sale modal → Dark Chocolate
2. Qty: 10
3. Stock: 62 → 52

**Day 3: Stocktake**
1. Stocktake page → Start
2. Filter: All
3. Count Dark Chocolate: 51 (1 missing)
4. Create stocktake
5. Variance: -1 (shows in red)

**Day 3: Adjust Variance**
1. Click "Complete Stocktake"
2. Verify adjustment applied
3. Stock: 52 → 51

**Day 4: Check Reports**
1. Reports page
2. Low Stock: Chocolate should not appear (51 > 50)
3. Sales Report: Shows 10 units sold
4. Inventory Value: Updated
5. Turnover Ratio: Improved

---

## 11. EXPECTED MOCK DATA STATE

After all tests, system should have:
- **10 Original Products** (with added products)
- **Mock Movements** (purchases, sales, adjustments)
- **3 Suppliers** (with performance data)
- **Stocktakes** (with variances)
- **All Metrics** calculated from real data

---

## 12. VALIDATION CHECKLIST

- [ ] Dashboard shows correct metrics
- [ ] Products add/edit/delete work
- [ ] Search and filters functional
- [ ] Suppliers connect to store
- [ ] Stocktake creates and calculates variance
- [ ] Reports show real data
- [ ] All modals work (Sale, Purchase, Adjust, Stocktake)
- [ ] Stock movements tracked correctly
- [ ] Dark mode toggles and persists
- [ ] Responsive on mobile/tablet/desktop
- [ ] All toasts appear on actions
- [ ] No console errors
- [ ] Build completes without errors

---

## 13. KNOWN LIMITATIONS

1. **No Database:** Data resets on page refresh (RAM-based)
2. **No Authentication:** All users have full access
3. **No Barcode Scanner:** Mock barcode component only
4. **No Email Alerts:** Notifications are UI-only
5. **No API Integration:** All data is local
6. **No User Roles:** All users treated as admin

These can be added in future phases.

---

## 14. SUPPORT

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify all fields are filled in forms
3. Ensure JavaScript is enabled
4. Try hard refresh (Cmd+Shift+R on Mac)
5. Check that npm run dev is still running

---

## ✅ All tests passing = Production Ready!


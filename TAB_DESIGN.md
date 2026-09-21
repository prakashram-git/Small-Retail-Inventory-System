# Mall Shop Owner - Tab Features Design

## 🏪 Tab Overview

### 1. **Dashboard** (Already Built)
- Quick summary metrics
- Low stock alerts
- Recent movements
- Quick actions
- Quick SKU scanner

---

## 2. **Products** (Already Built)
- ✅ Add products (auto-generate SKU, auto-fill category)
- ✅ Edit products
- ✅ Delete products
- ✅ Import CSV with auto SKU & category
- ✅ Search & filter by category
- View profit margin
- View stock status

---

## 3. **Stock Movements** 📊
### What a Shop Owner Needs:
- **View all movements** (Purchases, Sales, Adjustments)
- **Filter options:**
  - By Type (Purchase/Sale/Adjustment)
  - By Date Range
  - By Product/Category
  - By Supplier
  - By Amount Range
- **Sort by:** Date, Product, Amount, Type
- **Quick Insights:**
  - Total purchases this month
  - Total sales this month
  - Total adjustments (damaged, lost)
- **Export:** Export movements to CSV/Excel
- **Create Movement:** Manually log stock movement
- **Movement Details:**
  - Product name & SKU
  - Quantity in/out
  - Transaction date & time
  - Type badge (colored)
  - Notes/reason
  - User who logged it

---

## 4. **Suppliers** 👥
### Supplier Information:
- **Add Supplier:**
  - Supplier name
  - Contact person
  - Phone number
  - Email
  - Address
  - City/State
  - Payment terms (30 days, COD, etc.)
  - Lead time (days to deliver)
  - Minimum order quantity
  - Rating (1-5 stars)

### **Supplier Management:**
- View all suppliers with contact info
- Search supplier
- Filter by rating
- View products supplied by each
- View order history with supplier
- Edit supplier details
- Mark favorite/preferred suppliers
- Performance: Average delivery time
- Performance: Quality rating
- Delete supplier

### **Order Tracking:**
- View pending orders
- Create purchase order
- Track delivery status
- View invoice history
- Payment status

---

## 5. **Reports** 📈
### Shop Owner Reports:

#### **Sales Report**
- Total sales by date/week/month
- Top selling products
- Sales by category
- Revenue trend
- Export to PDF/Excel

#### **Stock Report**
- Current stock levels by category
- Total inventory value
- Stock aging (oldest stock)
- Items with no movement (30+ days)
- Stock distribution by location

#### **Profit Analysis**
- Profit by product
- Profit by category
- Profit margin %
- Cost vs Selling price comparison
- High profit vs High volume products

#### **Low Stock Report**
- Items below reorder level
- Urgency status (critical/warning)
- Suggested order quantities
- Cost to restock

#### **Supplier Performance**
- On-time delivery %
- Quality issues
- Price comparison
- Average lead time

#### **Inventory Aging**
- Products not sold in 60+ days
- Slow-moving items
- Overstocked items
- Storage cost estimate

---

## 6. **Stocktake** 📋
### Stocktake Features:

#### **Start New Stocktake**
- Select products or category
- Generate counting sheet (printable)
- Assign to staff member
- Set deadline

#### **During Stocktake**
- Scan barcode or enter SKU
- Enter counted quantity
- See variance (counted vs system)
- Flag discrepancies
- Add notes/reason

#### **Stocktake History**
- View past stocktakes
- Date & time
- By whom
- Items counted
- Total variance
- Accuracy %

#### **Variance Analysis**
- Items with major discrepancies
- Likely causes (damage, theft, error)
- Generate adjustment entries
- Approval workflow

#### **Reports**
- Stocktake accuracy report
- Variance by category
- Variance trends over time

---

## 🎯 Common Features Across All Tabs

### **Universal Features:**
1. **Search & Filter** - Fast lookup
2. **Export** - CSV/PDF for record keeping
3. **Date Range** - Quick filters (Today, This Week, This Month, Custom)
4. **Sorting** - Sort by any column
5. **Print** - Print reports/lists
6. **Bulk Actions** - Select multiple items
7. **Status Indicators** - Color-coded badges
8. **Quick Stats** - Summary at top/bottom

### **Mobile-Friendly:**
- Touch-friendly buttons
- Swipe actions
- Collapsible sections
- Responsive tables

---

## 📱 Shop Owner Workflow

### **Daily:**
1. Check **Dashboard** for low stock alerts
2. Use **Products** → Search to find items
3. Use **Quick Actions** to log sales/purchases
4. Check **Stock Movements** for today's activity

### **Weekly:**
1. Review **Reports** → Sales Report
2. Check **Stock Movements** summary
3. Check **Suppliers** for pending orders
4. Identify slow movers in **Reports**

### **Monthly:**
1. Generate **Profit Analysis** report
2. Review **Supplier Performance**
3. Run **Stocktake** on rotating basis
4. Export **Inventory Aging** report
5. Plan reorders based on **Low Stock Report**

### **Quarterly:**
1. Full stock count (**Stocktake**)
2. Complete **Profit Analysis**
3. Review all **Supplier Performance**
4. Analyze **Inventory Aging** trends

---

## 💡 Key Metrics for Shop Owner

### **Always Visible:**
- Total Inventory Value
- Number of Products
- Low Stock Count
- This Month's Sales
- This Month's Profit
- Average Profit Margin

### **In Reports:**
- Best Sellers (Top 5)
- Slow Movers (Bottom 5)
- Profit by Category
- Stock Turnover Rate
- Dead Stock (No sales 60+ days)

---

## 🔧 Technical Features (Backend)

All tabs need:
- **Real-time updates** when data changes
- **Audit trail** - who changed what, when
- **Undo capability** for recent actions
- **Backup/restore** for critical data
- **Data validation** - no invalid entries
- **Permission levels** - Owner vs Staff
- **Notifications** - Low stock, new orders, etc.

---

## Priority Build Order

1. ✅ **Dashboard** - Overview & quick actions
2. ✅ **Products** - Core inventory management
3. **Stock Movements** - Track in/out
4. **Suppliers** - Manage vendors
5. **Reports** - Insights & analysis
6. **Stocktake** - Periodic inventory count

---

This design ensures a mall shop owner can manage their entire inventory from one system!

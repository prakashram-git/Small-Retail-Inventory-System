# 🧪 Mall Inventory System - Testing Guide

## ✅ Server Status
- **URL:** http://localhost:3001
- **Status:** ✅ Running
- **All Routes:** ✅ Working (200 OK)

---

## 📋 Test Checklist

### **1. Dashboard** (Home Page)
**URL:** http://localhost:3001

- [ ] Check 4 metric cards display correctly
  - Total Products: 3
  - Total Inventory Value: ~$31
  - Sales (Last 30 Days): ~$1,475
  - Low Stock Alerts: 1-2
- [ ] Verify low stock table shows items below reorder level
- [ ] Check quick actions buttons (Sale, Purchase, Adjust, Count, Scan)
- [ ] Verify recent movements feed displays latest 4 movements
- [ ] Test responsive design (resize browser)

---

### **2. Products Tab**
**URL:** http://localhost:3001/products

#### **View & Filter**
- [ ] See 3 existing products in table:
  - PROD-001: Dark Chocolate Bar | Confectionery | Cost: $2.50 | Sell: $4.50
  - PROD-002: Orange Juice | Beverages | Cost: $1.80 | Sell: $3.20
  - PROD-003: Potato Chips | Snacks | Cost: $1.50 | Sell: $2.80
- [ ] Search by SKU (e.g., "CHOC")
- [ ] Search by product name (e.g., "Chocolate")
- [ ] View profit calculations (Profit, Margin %)
- [ ] Check table columns: SKU, Name, Category, Cost, Sell Price, Profit, Margin, Stock, Reorder

#### **Add Product Manually**
- [ ] Click "Add Product" button
- [ ] Fill in:
  - SKU: (leave empty to test auto-generation)
  - Product Name: "Coca Cola 500ml"
  - Cost: 1.20
  - Selling Price: 2.50
  - Current Stock: 100
  - Reorder Level: 50
- [ ] Click "Add Product"
- [ ] Verify:
  - SKU auto-generated as "PROD-004"
  - Category auto-filled as "Beverages"
  - Product appears in table
  - Profit calculated: +$1.30
  - Margin calculated: 52.0%

#### **Test Auto-Fill Category**
- [ ] Click "Add Product" again
- [ ] Type product name: "Almond Nuts"
- [ ] Verify category suggestion appears: "Snacks"
- [ ] Type product name: "Milk Carton"
- [ ] Verify category suggestion: "Dairy"

#### **Test CSV Import**
- [ ] Click "Import CSV" button
- [ ] Create test CSV file:
  ```
  Name,Cost,Selling Price,SKU,Category,Stock,Reorder Level
  Sprite 500ml,1.00,2.00,BEVER-002,Beverages,80,40
  Muffin Pack,0.80,1.50,BAKE-001,Bakery,30,20
  ```
- [ ] Upload file
- [ ] Verify:
  - 2 new products added
  - SKUs auto-generated where empty
  - Categories auto-filled from CSV
  - Products appear in table

---

### **3. Stock Movements Tab**
**URL:** http://localhost:3001/stock-movements

#### **View & Filter**
- [ ] See summary cards:
  - Purchases: 50+ units
  - Sales: 8+ units
  - Adjustments: 3+ units
- [ ] View 3 sample movements in table
- [ ] Filter by Type:
  - "All Types" shows all
  - "Purchases" shows only purchases
  - "Sales" shows only sales
  - "Adjustments" shows only adjustments
- [ ] Search by SKU (e.g., "CHOC")
- [ ] Search by product name

#### **Log New Movement**
- [ ] Click "Log Movement" button
- [ ] Test Purchase:
  - SKU: PROD-001
  - Product Name: Dark Chocolate Bar
  - Type: Purchase
  - Quantity: 25
  - Supplier: My Supplier
  - Notes: Restocking
  - Click "Log Movement"
  - Verify new row appears with +25 units
  - Purchases total increases

- [ ] Test Sale:
  - SKU: PROD-002
  - Product Name: Orange Juice
  - Type: Sale
  - Quantity: 5
  - Notes: Customer purchase
  - Click "Log Movement"
  - Verify new row appears with -5 units
  - Sales total increases

- [ ] Test Adjustment:
  - SKU: PROD-003
  - Product Name: Potato Chips
  - Type: Adjustment
  - Quantity: 2
  - Notes: Damaged units
  - Click "Log Movement"
  - Verify new row appears

#### **Delete Movement**
- [ ] Click trash icon on any movement
- [ ] Confirm deletion
- [ ] Verify row is removed

---

### **4. Suppliers Tab**
**URL:** http://localhost:3001/suppliers

#### **View Existing Suppliers**
- [ ] See 2 existing suppliers as cards:
  - Fresh Beverages Inc. (⭐⭐⭐⭐⭐)
  - Snacks & Treats Ltd (⭐⭐⭐⭐)
- [ ] Each card shows:
  - Supplier name
  - Contact person
  - Phone, Email, Address
  - Payment terms, Lead time
  - Star rating

#### **Add New Supplier**
- [ ] Click "Add Supplier" button
- [ ] Fill in:
  - Supplier Name: "Premium Confections"
  - Contact Person: "Mike Davis"
  - Phone: +65-6789-0123
  - Email: mike@premiumconfections.com
  - Address: 789 Business Ave, Singapore
  - Payment Terms: Net 45
  - Lead Time: 5
  - Rating: ⭐⭐⭐⭐⭐
- [ ] Click "Add Supplier"
- [ ] Verify new supplier appears as card

#### **Mark Preferred**
- [ ] Click star icon on a supplier card
- [ ] Star should fill with yellow
- [ ] Click again to unmark

#### **Delete Supplier**
- [ ] Click trash icon on a supplier card
- [ ] Confirm deletion
- [ ] Verify card is removed

#### **Search Supplier**
- [ ] Type in search box: "Fresh"
- [ ] Verify only "Fresh Beverages" shows
- [ ] Clear search
- [ ] All suppliers show again

---

### **5. Reports Tab**
**URL:** http://localhost:3001/reports

#### **Verify Report Types Available**
- [ ] See 6 report cards:
  1. Sales Report
  2. Profit Analysis
  3. Low Stock Report
  4. Supplier Performance
  5. Inventory Aging
  6. Stock Report
- [ ] Each has icon, title, description
- [ ] Each has "Generate Report" button (not functional yet)

---

### **6. Stocktake Tab**
**URL:** http://localhost:3001/stocktake

#### **Start New Stocktake**
- [ ] See "Start New Stocktake" section
- [ ] Select category dropdown shows options
- [ ] "Begin Stocktake" button ready to click

#### **View Recent Stocktakes**
- [ ] See 3 sample stocktakes:
  - 15 Sept 2026: 25 items, 98% accurate
  - 08 Sept 2026: 32 items, 96% accurate
  - 01 Sept 2026: 28 items, 99% accurate

#### **Variance Analysis**
- [ ] See table with sample data:
  - CHOC-001: System 12, Counted 15, Variance +3 (red)
  - BEVER-001: System 28, Counted 25, Variance -3 (red)
  - SNACK-001: System 45, Counted 45, Variance ✓ (green)

---

### **7. Responsive Design Tests**

#### **Mobile (375px width)**
- [ ] All pages display correctly
- [ ] Buttons are touch-friendly
- [ ] Tables scroll horizontally
- [ ] No text overflow
- [ ] Proper spacing

#### **Tablet (768px width)**
- [ ] 2-column layouts work
- [ ] Cards stack properly
- [ ] Readable text sizes

#### **Desktop (1920px width)**
- [ ] Full 3-4 column layouts
- [ ] Proper spacing and alignment
- [ ] All features visible

---

### **8. Header Navigation**

#### **Test All Tab Links**
- [ ] Dashboard link → http://localhost:3001
- [ ] Products link → http://localhost:3001/products
- [ ] Stock Movements link → http://localhost:3001/stock-movements
- [ ] Suppliers link → http://localhost:3001/suppliers
- [ ] Reports link → http://localhost:3001/reports
- [ ] Stocktake link → http://localhost:3001/stocktake

#### **Test Header Features**
- [ ] Logo/Brand visible
- [ ] All tabs clickable
- [ ] Notification bell shows badge count
- [ ] Settings icon clickable
- [ ] User profile dropdown works

---

## 🎯 Feature Test Summary

| Feature | Status |
|---------|--------|
| Dashboard metrics | ✅ Ready |
| Products CRUD | ✅ Ready |
| Auto-generate SKU | ✅ Ready |
| Auto-fill category | ✅ Ready |
| CSV import | ✅ Ready |
| Stock movements log | ✅ Ready |
| Movement filtering | ✅ Ready |
| Suppliers CRUD | ✅ Ready |
| Supplier ratings | ✅ Ready |
| Preferred flag | ✅ Ready |
| Reports dashboard | ✅ Ready |
| Stocktake tracking | ✅ Ready |
| Responsive design | ✅ Ready |
| Header navigation | ✅ Ready |

---

## 🚀 Next Steps After Testing

1. **Report any bugs or issues**
2. **Suggest feature improvements**
3. **Plan database integration** (currently using mock data)
4. **Implement missing report generation** (Reports tab)
5. **Add user authentication**
6. **Deploy to production**

---

## 📝 Notes

- All data is stored in memory (mock data)
- Page refresh will reset all data
- Perfect for testing UI/UX and workflows
- Ready for backend integration

---

**Happy Testing! 🎉**

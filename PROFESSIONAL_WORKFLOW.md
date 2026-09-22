# RedHill Inventory System - Professional Retail Workflow Guide

## System Overview
This is a professional-grade retail inventory management system supporting complete end-to-end workflows from purchase to sale to replenishment.

---

## 1. PURCHASE WORKFLOW

### Step 1: Create Purchase Order (PO)
- Navigate to **Dashboard** → **Quick Actions** → **Purchase**
- **Required Fields:**
  - Supplier Name / ID
  - PO Number (auto-generated or manual)
  - Expected Delivery Date
  - Line Items:
    - Product SKU
    - Quantity to order
    - Unit Cost
- **System Actions:**
  - PO created with status: `pending`
  - Notification sent to warehouse
  - Lead time calculated based on supplier profile

### Step 2: Receive Goods (Goods Receipt Note - GRN)
- When stock arrives: Go to **Dashboard** → **Receive Stock**
- **Record for Each Item:**
  - Quantity Received
  - Damage Quantity (if any)
  - Batch/Lot Number (optional)
  - Expiry Date (if applicable)
  - Location/Bin Assignment
- **System Actions:**
  - GRN auto-generated (e.g., GRN-202609)
  - Stock automatically added to inventory
  - Stock movement recorded with reference to PO
  - Quality issues flagged if damage detected
  - PO status updated to `received`

### Step 3: Verify Receipt (Quality Check)
- Quality Inspector reviews received goods
- Click **Verify** on GRN to confirm quality
- Mark as `verified` status
- Any discrepancies noted for supplier follow-up

---

## 2. INVENTORY MAINTENANCE

### Daily Inventory Checks
**Dashboard Shows:**
- **Total Products:** Active SKUs in system
- **Total Inventory Value:** Cost × Quantity
- **Low Stock Alerts:** Products below reorder level
- **Overstocked Items:** Products above max level
- **Top Moving Products:** Best sellers
- **Slow Moving Products:** Items to clear

### Stock Adjustments
Navigate to **Dashboard** → **Adjust Stock** for:
- **Damage/Spoilage:** Remove damaged units with reason
- **Inventory Discrepancy:** Reconcile physical vs system count
- **Returns from Customers:** Add back to inventory
- **Theft/Loss:** Track missing items by category

**Each Adjustment Records:**
- Product & Quantity
- Adjustment Type/Reason
- Notes for audit trail
- Timestamp & User

### Stock Movement Tracking
**View All Movement History:**
- Go to **Stock Movements** tab
- Filter by:
  - Date range
  - Product
  - Type (Purchase/Sale/Adjustment/Return/Damage)
  - Reference (PO/Invoice number)

---

## 3. SALES WORKFLOW

### Process a Sale
- Click **Dashboard** → **Quick Actions** → **Sale**
- **Record:**
  - Customer Name (optional)
  - Select Products & Quantities
  - Unit Price (auto-populated)
  - Apply Discounts (if any)
  - Payment Method

**System Actions:**
- Invoice auto-generated (e.g., INV-202609)
- Stock immediately deducted
- Sale recorded in movements
- Last sold date updated for product
- Revenue tracked for reports

### Track Sales Performance
- **Dashboard Metrics:** "Sales (Last 30 Days)"
- **Products Tab:** See `last30Days` sales per product
- **Reports Tab:** Detailed sales by category and period

---

## 4. INVENTORY VERIFICATION (STOCKTAKE)

### Physical Inventory Count
- Navigate to **Stocktake** tab
- **Create New Stocktake:**
  - Assign counting teams
  - Print product list with current system quantities
  - Physically count all items by location/bin

### Record Counts
- Enter actual count for each product
- System calculates **variance:**
  - Variance = Physical Count - System Count
  - Positive = Unaccounted surplus
  - Negative = Missing units

### Analyze Discrepancies
- Review variance reasons:
  - Counting error (recount)
  - Damage/Spoilage
  - Theft/Loss
  - Data entry error
- Document variances for management review

### Apply Adjustments
- Click **Complete Stocktake**
- Verify with manager signature
- Variances automatically adjusted in system
- Movements recorded for audit trail

---

## 5. REPLENISHMENT

### Automatic Reorder Point
- **Dashboard** identifies low stock items
- Each product has:
  - Minimum Stock (min_stock)
  - Reorder Level (reorderLevel) - triggers alert
  - Maximum Stock (maxStock)

### Suggested Order Quantity
**Formula:**
```
Suggested Qty = (Last 30 Days Sales × 1.2) - Current Stock
```
- Ensures 20% safety buffer
- Accounts for lead time

### Replenishment Process
1. **Identify Need:**
   - Low Stock Alerts on Dashboard
   - Check supplier availability
   - Review supplier lead times

2. **Create Purchase Order:**
   - Use suggested quantity
   - Select supplier with best rating/lead time
   - Schedule delivery before stock-out

3. **Receive & Stock:**
   - Follow Goods Receipt workflow
   - Update location assignments
   - Verify expiry dates

---

## 6. REPORTING & ANALYTICS

### Dashboard KPIs
- **Total Products:** Count of active inventory
- **Total Inventory Value:** Sum of (currentStock × unitPrice)
- **Low Stock Alerts:** Count of items ≤ reorderLevel
- **Sales (Last 30 Days):** Revenue from sales
- **Top Moving Products:** Highest unit sales
- **Inventory Turnover:** Sales ÷ Average Inventory

### Product-Level Metrics
**In Products Tab, each product shows:**
- Current Stock with status badge
- Stock Status: Critical/Low/Healthy/Overstocked
- Profit Margin %: (Price - Cost) ÷ Cost
- Supplier Name & Lead Time
- Last Restock Date
- Days in Stock (how old)

### Available Reports
1. **Stock Valuation Report**
   - Total value by category
   - High-value items
   - Aging analysis

2. **Sales Report**
   - Daily/Weekly/Monthly sales
   - Sales by category
   - Top performers

3. **Supplier Performance**
   - On-time delivery %
   - Quality score
   - Rating trend
   - Cost efficiency

4. **Stocktake Variance Report**
   - Variance by category
   - Loss reasons
   - Trends over time

5. **Movement History**
   - Complete audit trail
   - Filtered by date/type/product
   - Traceability for compliance

---

## 7. SUPPLIER MANAGEMENT

### Add Suppliers
- **Settings** → **Suppliers**
- Record:
  - Company Name
  - Contact Person & Phone
  - Lead Time (days)
  - Payment Terms
  - Rating (1-5 stars)

### Track Supplier Performance
- **On-time Delivery %:** Deliveries before expected date
- **Quality Score:** Based on damage/discrepancy rates
- **Rating:** Overall supplier rating
- **Total Spend:** Cumulative purchase amount

### Choose Best Supplier
- When creating PO, system recommends:
  - Fastest lead time
  - Best on-time delivery record
  - Highest quality rating
  - Lowest cost

---

## 8. COMPLETE WORKFLOW EXAMPLE

### Scenario: Replenish Low Stock Chocolate

**Day 1: Monday Morning**
1. Manager checks Dashboard
2. Sees "Dark Chocolate Bar" at 12 units (below reorder level of 50)
3. Suggested order: 88 units (based on 30-day sales × 1.2 = 54, minus 12 on hand)
4. Creates PO with supplier "Premium Sweets Inc."
   - Quantity: 88 units
   - Unit Cost: $2.50
   - Expected Delivery: Wednesday (2-day lead time)

**Day 1: 3 PM**
- PO Sent to supplier
- System records PO status: `pending`
- Notification logged for warehouse

**Day 3: Wednesday Afternoon**
1. Goods arrive from Premium Sweets Inc.
2. Warehouse staff:
   - Receives 88 units (all good condition)
   - Scans items, assigns to Shelf A-1
   - Records in GRN
3. System:
   - Creates GRN-202609
   - Adds 88 units to inventory
   - Updates stock from 12 → 100
   - Records movement: +88 purchase
   - Updates PO status to `received`

**Day 3: 4 PM**
- Quality Inspector verifies GRN
- No damage or issues
- Marks as `verified`
- Sends notification to finance for payment

**Day 4-10: Selling Period**
1. Customers buy chocolate
   - Day 4: Sell 10 units → Inventory: 90
   - Day 5: Sell 15 units → Inventory: 75
   - Day 10: Sell 5 units → Inventory: 70
2. Each sale:
   - Creates invoice
   - Deducts stock immediately
   - Records movement with sale type
   - Updates revenue

**End of Month: Reporting**
1. Manager runs Sales Report
   - Sees chocolate: 250 units sold, $1,125 revenue
   - Profit margin: 80% × $2,500 revenue = $2,000 profit
2. Reviews Supplier Performance
   - Premium Sweets: 100% on-time delivery
   - 0% damage rate
   - Rating: 4.5/5 stars
3. Inventory Metrics
   - Turnover ratio improved
   - No stockouts
   - Inventory aging improved

**End of Month: Physical Count**
1. Stocktake scheduled for last Friday
2. Team counts all inventory
   - Chocolate count: 68 units
   - System shows: 70 units
   - Variance: -2 units (likely shelf damage)
3. Investigates and documents variance
4. Applies adjustment
   - Reduces inventory by 2
   - Records reason: "Damage during display"
5. Marks stocktake as verified
   - Manager approves
   - Report generated

---

## 9. KEY BUSINESS METRICS

### Inventory Health
- **Turnover Ratio:** How often inventory sells (higher = better)
- **Stock Age:** Days in inventory (lower = fresher)
- **Stockout Rate:** % of times item was unavailable
- **Overstock Rate:** % of time inventory was excess

### Financial Metrics
- **Inventory Value:** Total $ tied up in stock
- **Carrying Cost:** Cost to store inventory
- **Profit Margin:** Revenue - Cost
- **Return on Inventory:** Profit ÷ Inventory Value

### Operational Metrics
- **Order Fill Rate:** % of orders fulfilled from stock
- **Lead Time:** Days to receive from supplier
- **Supplier Reliability:** On-time delivery %
- **Variance Rate:** % of inventory discrepancies

---

## 10. SYSTEM WORKFLOWS AT A GLANCE

```
PURCHASE WORKFLOW:
Create PO → Pending → Receive Goods (GRN) → Verify → Add to Stock

SALES WORKFLOW:
Create Invoice → Deduct Stock → Record Revenue → Customer Leaves

INVENTORY VERIFICATION:
Physical Count → Compare with System → Analyze Variance → Apply Adjustment

REPLENISHMENT:
Low Stock Alert → Calculate Need → Create PO → Receive → Stock

REPORTING:
Daily Movements → Weekly Reports → Monthly Analysis → Strategic Planning
```

---

## 11. USER ROLES & PERMISSIONS

### Admin
- Full access to all workflows
- Approve POs and stocktakes
- View all reports
- Manage suppliers
- Configure settings

### Manager
- Create/Verify POs
- Authorize stocktakes
- Run reports
- Track performance
- Cannot delete data

### Staff
- Process sales
- Receive goods (GRN)
- Adjust stock
- Count inventory
- View movements

---

## 12. DATA AUDIT TRAIL

Every action is recorded:
- **Who:** User ID
- **What:** Action taken
- **When:** Timestamp
- **Where:** Product & Location
- **Why:** Reference (PO/Invoice/Reason)
- **Before/After:** Quantity changes

This ensures complete traceability for:
- Regulatory compliance
- Loss investigation
- Performance analysis
- Fraud detection

---

## Best Practices

1. **Daily Reviews:** Check dashboard for low stock alerts
2. **Weekly Stocktakes:** Spot-check high-value items
3. **Monthly Verification:** Full physical count of critical items
4. **Supplier Reviews:** Quarterly assessment of performance
5. **Trend Analysis:** Monitor sales trends for forecasting
6. **Clean Data:** Ensure accurate cost and pricing info
7. **Regular Training:** Keep team updated on procedures

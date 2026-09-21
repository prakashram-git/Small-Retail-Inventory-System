# Setup & Getting Started Guide

## Quick Start (3 minutes)

### 1. Install Node.js
If you haven't already, install Node.js 18 or higher:
- Download: https://nodejs.org/
- Recommended: LTS version (v20+)

### 2. Navigate to Project
```bash
cd /Users/ramprakash/Mall_Inventory_System
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser
Visit: **http://localhost:3000**

You should see the RedHill Inventory Dashboard with mock data loaded!

---

## What's Included

### ✅ Pre-configured
- TypeScript setup
- Tailwind CSS with custom brand colors
- Zustand store with 8-10 realistic products
- Mock stock movements and sales data
- All modals and components ready to use

### 🎯 Features Ready to Test
1. **Summary Metrics** - Shows inventory value, product count, sales
2. **Low Stock Table** - Lists items below reorder level
3. **Suggested Orders** - Auto-calculated based on sales velocity
4. **Stocktake Modal** - Count inventory with variance tracking
5. **Barcode Scanner** - Camera or manual SKU entry
6. **Recent Movements** - Live activity feed
7. **Toast Notifications** - Real-time updates

---

## Testing Scenarios

### Test 1: View Low Stock Items
1. Open dashboard at http://localhost:3000
2. Scroll to "Low Stock & Reorder Suggestions" table
3. See 4 items with current stock ≤ reorder level
4. Check suggested order quantities (calculated as `Last 30 Days Sales × 1.2 - Current Stock`)

### Test 2: Perform Stocktake
1. Click "Start Stocktake" button (right panel)
2. Select "Dark Chocolate Bar" (SKU: CHOC-001)
3. System shows: Current Stock = 12
4. Enter Counted Quantity = 15
5. Variance shows: +3 units (surplus)
6. Click "Create Adjustment"
7. Check Recent Movements feed - new adjustment entry appears
8. Low Stock table updates automatically

### Test 3: Barcode Scanner (Manual Mode)
1. Click "Quick SKU Scanner" button (red button)
2. Switch to "Manual" tab
3. Type "WATER-001"
4. See matching product autocomplete
5. Click or press Enter to confirm
6. See success toast notification

### Test 4: Check Notifications
1. Note the bell icon in header
2. Count = number of items with current_stock ≤ reorder_level
3. Updates automatically after stocktake

### Test 5: Mobile Responsive
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test on iPhone SE, iPad, or Android
4. Single column layout adapts properly

---

## Project Structure Overview

```
app/
  layout.tsx           ← Root layout (header stays consistent)
  page.tsx             ← Main dashboard (orchestrates all components)
  globals.css          ← Tailwind imports + custom animations

components/
  Header.tsx           ← Navigation, profile, notifications
  MetricsCard.tsx      ← Reusable card component
  LowStockTable.tsx    ← Low stock items with calculations
  QuickActions.tsx     ← Action buttons
  RecentMovements.tsx  ← Activity feed
  StocktakeModal.tsx   ← Inventory count form
  BarcodeScanner.tsx   ← Camera or manual entry
  Toast.tsx            ← Notification system

lib/
  types.ts             ← TypeScript interfaces (Product, Movement, etc.)
  store.ts             ← Zustand store with all actions
  mock-data.ts         ← 10 products + 5 sample movements + sales data
  utils.ts             ← formatCurrency, formatDate, playAudio, etc.
```

---

## Key Store Functions

### Update Stock
```ts
store.updateStock(productId, quantity, 'purchase', 'optional notes')
// Creates movement, updates product stock, triggers toast
```

### Get Low Stock Items
```ts
store.getLowStockItems()  // Returns products where stock ≤ reorderLevel
```

### Get Suggested Order Qty
```ts
store.getSuggestedOrderQuantity(productId)
// Returns Math.max(0, (last30Days × 1.2) - currentStock)
```

### Create Stocktake Adjustment
```ts
store.createStocktakeAdjustment(productId, countedQuantity)
// Auto-calculates variance and creates 'adjustment' movement
```

---

## Customization Ideas

### Add More Products
Edit `lib/mock-data.ts`:
```ts
export const MOCK_PRODUCTS: Product[] = [
  // ... existing products
  {
    id: '11',
    sku: 'TEA-001',
    name: 'Green Tea (100g)',
    currentStock: 25,
    reorderLevel: 50,
    unitPrice: 8.99,
    category: 'Beverages',
  },
];
```

### Change Brand Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  brand: {
    primary: '#1976D2',    // Change from red to blue
    dark: '#1565C0',
    light: '#E3F2FD',
  }
}
```

### Add Real Database
Replace mock data in `lib/store.ts` with API calls:
```ts
const response = await fetch('/api/products');
const products = await response.json();
```

---

## Troubleshooting

### "npm: command not found"
- Install Node.js: https://nodejs.org/
- Restart terminal after installation

### Port 3000 already in use
```bash
npm run dev -- -p 3001  # Use port 3001 instead
```

### Tailwind styles not loading
```bash
rm -rf .next
npm run dev
```

### Camera permission denied
- Check browser permissions
- Try in incognito mode
- Requires HTTPS in production (localhost works)

---

## Building for Production

```bash
# Build optimized bundle
npm run build

# Start production server
npm start
```

Then deploy to Vercel:
```bash
npm i -g vercel
vercel
```

---

## Need Help?

1. Check component comments in the code
2. Review `types.ts` for data structures
3. Check `store.ts` for available actions
4. Refer to inline documentation in modals

Good luck! 🚀

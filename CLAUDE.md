# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

```bash
# Development
npm run dev              # Start dev server on port 3000 (or next available)
npm run build           # Build for production
npm start               # Run production build
npm run lint            # Run Next.js linter

# Testing locally
# Navigate to http://localhost:3000 (or check terminal for actual port if 3000 in use)
```

## Architecture Overview

### High-Level Design

**RedHill Inventory Dashboard** is a Next.js 14 retail inventory management system with:
- **App Router**: All pages in `app/` directory (Dashboard, Products, Stock Movements, Suppliers, Reports, Stocktake)
- **Client-Side State**: Zustand stores (never server-rendered)
- **Styling**: Tailwind CSS with dark mode using class strategy + localStorage persistence
- **Modals**: Separate modal components for operations (Sale, Purchase, Adjust, Stocktake, Scanner, Settings)

### File Structure Relationships

```
Core State Management:
  lib/store.ts (useInventoryStore)
    ↓ Used by Dashboard + all pages for stock data
  lib/settings-store.ts (useSettingsStore)
    ↓ Used by Header + DashboardClient for theme/user preferences

Main Pages (each has route + optional component):
  app/page.tsx (Dashboard) → imports DashboardClient
  app/products/page.tsx → imports ProductsPage component
  app/stock-movements/page.tsx → imports StockMovementsPage component
  etc.

Component Hierarchy (Dashboard):
  app/page.tsx
    └─ DashboardClient (orchestrator, 'use client')
         ├─ Header (navigation, theme toggle, settings icon)
         │   ├─ SettingsModal (brand name, user management)
         │   └─ SaleModal, PurchaseModal, AdjustModal (opened via QuickActions)
         ├─ MetricsCard (x4 summary stats)
         ├─ LowStockTable (left panel)
         ├─ QuickActions (right panel - opens modals)
         ├─ RecentMovements (activity feed)
         ├─ StocktakeModal
         ├─ BarcodeScanner
         └─ Toast (notifications)
```

## Key Technical Decisions & Patterns

### 1. State Management (Zustand)

**Two separate stores:**
- `useInventoryStore`: Products, movements, stock operations
- `useSettingsStore`: User preferences, brand settings, dark mode toggle

**Critical Pattern - Direct Subscriptions:**
Components **must** subscribe directly to primitives/arrays, not computed functions:
```tsx
// ✅ CORRECT: Reliable updates
const products = useInventoryStore((state) => state.products);

// ❌ WRONG: May miss updates due to reference issues
const lowStockItems = useInventoryStore((state) => state.getLowStockItems());

// ✅ CORRECT: Compute after subscribing
const lowStockItems = products.filter(p => p.currentStock <= p.reorderLevel);
```

**Why:** Zustand's subscription system tracks exact value changes. Computed functions create new array references each call, potentially causing missed updates.

### 2. Dark Mode Implementation

**Strategy:** Tailwind class-based dark mode + client-side toggle

**Key Files:**
- `tailwind.config.ts`: Has `darkMode: 'class'`
- `app/globals.css`: Dark mode CSS rules for `html.dark` selector
- `lib/settings-store.ts`: `toggleDarkMode()` action with localStorage persistence
- `components/DashboardClient.tsx`: useEffect that adds/removes 'dark' class on `<html>` element

**Important Pattern:**
```tsx
// ✅ Wrap theme-dependent JSX in mounted check
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (!mounted) return null;  // or return placeholder
// Render theme-dependent content
```

**Why:** Prevents hydration mismatches when server renders without theme class but client adds it.

### 3. Client vs Server Components

**All interactive components must be 'use client':**
- Pages that use hooks (useState, useEffect)
- Any component accessing Zustand stores
- Modal components
- Components with event handlers

**Layout.tsx and page.tsx routes can be server components**, but they typically wrap 'use client' components (like DashboardClient).

### 4. Modal Pattern

Each operation has its own modal component (not one mega-modal):
- `SaleModal.tsx`: Record customer sales, update inventory
- `PurchaseModal.tsx`: Record supplier purchases
- `AdjustModal.tsx`: Manual stock adjustments with reasons
- `StocktakeModal.tsx`: Physical count reconciliation
- `SettingsModal.tsx`: Brand/user management

Each modal:
1. Takes `isOpen` and `onClose` props
2. Calls store action on submit
3. Closes modal automatically on success
4. Shows toast notification

## Common Development Tasks

### Adding a New Page

1. Create directory: `app/new-page/`
2. Add `page.tsx`:
```tsx
import Header from '@/components/Header';
import NewPageComponent from '@/components/NewPageComponent';

export default function NewPageRoute() {
  return (
    <>
      <Header />
      <NewPageComponent />
    </>
  );
}
```

3. Create component with 'use client' if using hooks/store
4. Add navigation link in Header.tsx

### Updating Zustand Store

1. Add action to `useInventoryStore` in `lib/store.ts`
2. Update TypeScript interface `InventoryState`
3. Actions have access to both `set` (write state) and `get` (read state)
4. Call `updateNotificationBadge()` after stock changes to update badge count

### Adding Dark Mode to a Component

Use these Tailwind patterns:
```tsx
// Background
className="bg-white dark:bg-gray-800"

// Text
className="text-gray-900 dark:text-white"

// Borders
className="border-gray-200 dark:border-gray-700"

// Use transition for smooth changes
className="transition-colors duration-200"
```

## Critical Gotchas & Lessons Learned

### 1. Hydration Mismatches
**Problem:** Server renders without theme, client renders with theme → mismatch error
**Solution:** Check `mounted` state before rendering theme-dependent content (Header already has this fix)

### 2. Stock Update Subscriptions
**Problem:** Components don't re-render when stock updates
**Solution:** Subscribe directly to `state.products` array, not through computed functions

### 3. TypeScript Form State
**Problem:** Form data type mismatches when resetting form state
**Solution:** Ensure all fields are reset, including optional ones like `category`

### 4. Port Conflicts
**Problem:** Port 3000+ already in use, server tries ports 3001, 3002, etc.
**Solution:** Check terminal output for actual port number (might not be 3000)

### 5. Next.js Cache Issues
**Problem:** Tailwind/CSS not loading after changes
**Solution:** `rm -rf .next` then `npm run dev` to force full rebuild

## Store API Reference

### useInventoryStore Actions

```ts
updateStock(productId, quantity, type, notes?)
  // type: 'purchase' | 'sale' | 'adjustment'
  // quantity can be negative (for sales)
  // Auto-creates StockMovement entry

getLowStockItems()
  // Returns products where currentStock <= reorderLevel

getTotalInventoryValue()
  // Sum of (currentStock * unitPrice)

getLast30DaysSales(productId)
  // Looks up MOCK_SALES_DATA

getSuggestedOrderQuantity(productId)
  // Calculates: (last30Days × 1.2) - currentStock

createStocktakeAdjustment(productId, countedQuantity)
  // Auto-calculates variance, creates adjustment movement

addToast(message, type)
  // type: 'success' | 'error' | 'info' | 'warning'
  // Auto-dismisses after 4 seconds
```

### useSettingsStore Actions

```ts
toggleDarkMode()
  // Flips darkMode boolean, saves to localStorage

updateBrandName(name)

updateShopLocation(location)

addUser(name, email, role)
  // role: 'admin' | 'manager' | 'staff'

updateUserRole(userId, role)

toggleUserActive(userId)
```

## Testing Workflows

### Test Dark Mode Toggle
1. Open app at localhost:3000
2. Click moon icon in header → entire page turns dark
3. Refresh page → dark mode persists (localStorage working)
4. Click sun icon → returns to light

### Test Stock Operations
1. Quick Actions panel → Click "Sale"
2. Select product, enter quantity & price
3. Check: Stock updated, Recent Movements shows entry, notification appears

### Test Low Stock Alert
1. Make a purchase to increase stock
2. Observe: Item removed from "Low Stock" table
3. Note: Badge count in bell icon updates

## Performance Notes

- **No Server Database:** All data in Zustand (RAM) - resets on page refresh
- **Client-Side Rendering:** Fast interactions, no backend latency
- **Memoization:** Components properly subscribe to only relevant state slices
- **CSS:** Tailwind compiled, no runtime overhead

## When Adding Features

**DO:**
- Keep modals separate and focused
- Subscribe to store directly in components
- Use Tailwind dark mode patterns
- Test on mobile (responsive design critical)
- Add 'use client' to interactive components

**DON'T:**
- Access Zustand in server components
- Mix computed functions in subscriptions
- Render conditional theme-dependent content before `mounted`
- Forget to update TypeScript interfaces when changing store

## Debugging Tips

1. **Store not updating UI?** Check if component subscribes directly to `state.products` not through functions
2. **Theme toggle not working?** Verify Header has `mounted` state check, check `globals.css` for dark mode rules
3. **Port 3000 in use?** Check terminal for actual port (likely 3000-3006 range)
4. **Build errors?** Run `npm run lint` to catch TypeScript issues
5. **Styles missing?** Clear `.next` folder and rebuild

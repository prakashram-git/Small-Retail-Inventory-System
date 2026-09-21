# RedHill Inventory Dashboard

A responsive, accessible retail inventory management system built for Singapore Central Mall using Next.js, TypeScript, Tailwind CSS, and Zustand.

## Features

### 1. Header & Navigation
- Brand logo with inventory cart icon
- Navigation links (Dashboard, Products, Stock Movements, Suppliers, Reports, Stocktake)
- Notification bell with unread badge
- Settings and user profile dropdown
- Location banner ("Inventory Dashboard - Singapore Central Mall")

### 2. Top Summary Metrics
- **Total Products**: Count of all inventory items
- **Total Inventory Value**: Calculated from stock × unit price
- **Sales (Last 30 Days)**: Revenue from recent sales
- **Low Stock Alerts**: Count of items below reorder level with highlighted badge

### 3. Main Dashboard Panels

#### Left Panel: Low Stock & Reorder Suggestions
- Table of items where `current_stock <= reorder_level`
- Columns: SKU, Product Name, Current Stock (with badge), Reorder Level, Last 30 Days Sales, Suggested Order Quantity
- **Calculation**: `Suggested Order Quantity = Math.max(0, (Last 30 Days Sales × 1.2) - Current Stock)`
- Bulk selection for generating purchase orders
- Responsive scrolling on mobile

#### Right Panel: Quick Actions & Recent Movements
- **Quick Action Buttons**:
  - Log Sale
  - Log Purchase
  - Adjust Stock
  - Start Stocktake
  - Quick SKU Scanner (full-width button)

- **Recent Stock Movements Feed**:
  - Latest 8 transactions displayed
  - Type badges (Purchase, Sale, Adjustment) with color coding
  - Relative timestamps (e.g., "2h ago")
  - Product SKU and notes

### 4. Stocktake Modal
- Product dropdown with SKU and name
- Current stock display from system records
- Counted quantity input field
- Real-time variance calculation: `Variance = Counted Quantity - Current Stock`
- Visual feedback (green for match, yellow for surplus, red for shortage)
- Automatic adjustment ledger entry creation
- Toast notification on success

### 5. Barcode Scanner Modal
- **Two Modes**:
  - **Camera Mode**: Live video feed with animated targeting corners
  - **Manual Mode**: SKU input with autocomplete suggestions

- **Camera Features**:
  - Green targeting frame with animated crosshair
  - Fallback to manual entry if camera unavailable
  - Audio beep feedback on successful scan

- **Manual Mode Features**:
  - Real-time SKU search as you type
  - Clickable product suggestions
  - Keyboard support (Enter to confirm)

### 6. State Management
- **Zustand Store** with actions:
  - `updateStock()`: Update inventory and create movement
  - `getLowStockItems()`: Filter items below reorder level
  - `getTotalInventoryValue()`: Calculate inventory value
  - `getLast30DaysSales()`: Get sales data for products
  - `getSuggestedOrderQuantity()`: Calculate reorder quantity
  - `createStocktakeAdjustment()`: Record stocktake variance
  - `addToast()` / `removeToast()`: Notification management

### 7. Mock Data
- **8-10 Realistic SKUs**: Confectionery, beverages, snacks, etc.
- **Product Categories**: Organized by type
- **Sales Data**: Last 30 days sales for each product
- **Stock Movements**: Recent transactions with timestamps

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4+
- **State Management**: Zustand 4.4+
- **Icons**: Lucide React 0.408+
- **Camera**: Native `navigator.mediaDevices.getUserMedia` API
- **Audio**: Native `AudioContext` API

## Installation

### Prerequisites
- Node.js 18+ or higher
- npm, yarn, pnpm, or bun

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
mall-inventory-system/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── MetricsCard.tsx     # Summary cards
│   ├── LowStockTable.tsx   # Low stock items table
│   ├── QuickActions.tsx    # Action buttons
│   ├── RecentMovements.tsx # Activity feed
│   ├── StocktakeModal.tsx  # Inventory count modal
│   ├── BarcodeScanner.tsx  # Camera/manual scanner
│   └── Toast.tsx           # Notifications
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── store.ts            # Zustand store
│   ├── mock-data.ts        # Sample inventory
│   └── utils.ts            # Helper functions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Key Features & Usage

### Stocktake Workflow
1. Click "Start Stocktake" button
2. Select a product from dropdown
3. Enter counted quantity
4. Review variance calculation
5. Submit to create automatic adjustment

### Barcode Scanning
1. Click "Quick SKU Scanner" button
2. Choose Camera or Manual mode
3. **Camera**: Point at barcode, audio feedback on scan
4. **Manual**: Type SKU or click autocomplete suggestion
5. Product validation and lookup complete

### Stock Updates
All stock updates instantly:
- Recalculate low stock alerts
- Update notification badge
- Add to movement feed
- Display toast notification

## Responsive Design

- **Mobile**: Single column layout, optimized touch targets
- **Tablet**: Two-column layout with stacked sections
- **Desktop**: Full three-column layout with modals

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Focus management in modals

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: Barcode scanner camera feature requires:
- HTTPS connection (or localhost)
- User permission to access camera

## Customization

### Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  brand: {
    primary: '#D32F2F',  // RedHill red
    dark: '#B71C1C',
    light: '#FFCDD2',
  }
}
```

### Mock Data
Update `lib/mock-data.ts` with your products, movements, and sales data.

### Store Actions
Extend `lib/store.ts` to add custom business logic.

## Performance Optimizations

- Client-side state management (no database needed for demo)
- Memoized selectors to prevent unnecessary re-renders
- Lazy modal loading
- CSS animations use GPU-accelerated transforms
- Responsive images and proper sizing

## Future Enhancements

- Real barcode scanning with ZXing library
- Database integration (PostgreSQL, MongoDB)
- Real-time updates with WebSockets
- Export purchase orders as PDF
- Multi-location support
- User authentication & role-based access
- Advanced reporting and analytics

## License

MIT License

## Support

For issues or questions, refer to the documentation in comments throughout the codebase.

# Firebase Setup Guide

This guide will help you set up Firebase Firestore as a cloud database for your Mall Inventory System.

## Prerequisites

- A Google account (free)
- Firebase SDK is already installed in the project

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `Mall Inventory System` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Create a Web App

1. In the Firebase Console, click the **Web icon** (</> symbol)
2. Register app with name: `Mall Inventory App`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**

## Step 3: Get Firebase Credentials

1. Copy the Firebase configuration object shown in the console
2. It should look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "mall-inventory-system.firebaseapp.com",
  projectId: "mall-inventory-system-xxx",
  storageBucket: "mall-inventory-system.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## Step 4: Add Credentials to Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and replace the values with your Firebase credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mall-inventory-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mall-inventory-system-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mall-inventory-system.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (or test mode for development)
4. Choose a location (e.g., `us-central1`)
5. Click **"Enable"**

## Step 6: Set Firestore Security Rules

In Firestore Console, go to **Rules** tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

For development/testing only, you can use:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Step 7: Create Products Collection (Optional)

You can create the collection manually:

1. In Firestore, click **"+ Start collection"**
2. Collection ID: `products`
3. Click **"Next"**
4. Click **"Save"** (to create an empty collection)

Or let the app create it automatically when you add the first product.

## Step 8: Test the Connection

Restart your development server:
```bash
npm run dev
```

The app should now connect to Firebase Firestore when you:
- Create a new product
- View the Master Products table
- Access the products page

## Collection Structure

The `products` collection will have the following fields:

| Field | Type | Description |
|-------|------|-------------|
| sku | string | Stock Keeping Unit (auto-generated) |
| name | string | Product Name |
| category | string | Product Category |
| currentStock | number | Current Stock Quantity |
| unitPrice | number | Price per Unit |
| description | string | Product Description |
| barcode | string | Product Barcode |
| minStock | number | Minimum Stock Level |
| maxStock | number | Maximum Stock Level |
| reorderLevel | number | Reorder Trigger Level |
| cost | number | Cost per Unit |
| supplierId | string | Supplier ID |
| location | string | Storage Location |
| status | string | active/inactive/discontinued |
| profitMargin | number | Profit Margin Percentage |
| createdAt | timestamp | Creation Date |
| updatedAt | timestamp | Last Update Date |

## Available Functions

Use these Firebase functions in your code:

```typescript
import {
  addProduct,
  getAllProducts,
  getProductsByCategory,
  getProductBySKU,
  updateProduct,
  deleteProduct,
  batchImportProducts,
  getLowStockProducts,
  getTotalInventoryValue,
} from '@/lib/firebase-products';

// Add a product
await addProduct({
  sku: 'PRD-001',
  name: 'Product Name',
  category: 'Electronics',
  currentStock: 100,
  // ... other fields
});

// Get all products
const products = await getAllProducts();

// Get products by category
const electronics = await getProductsByCategory('Electronics');

// Get low stock products
const lowStock = await getLowStockProducts();

// Calculate total value
const totalValue = await getTotalInventoryValue();
```

## Firestore Pricing

Firebase Firestore has a **generous free tier**:

- **Read Operations**: 50,000 per day
- **Write Operations**: 20,000 per day
- **Delete Operations**: 20,000 per day
- **Storage**: 1 GB

This is more than enough for small to medium retail operations.

## Switching Between Local and Cloud

The app now supports both:

1. **Local Storage** (Zustand store) - Default, no setup needed
2. **Cloud Storage** (Firebase) - Optional, add credentials to use

To use Firebase, just add the environment variables. To use local storage only, the app will work without them.

## Troubleshooting

### Firebase connection errors
- Check that `.env.local` has correct credentials
- Ensure Firestore Database is enabled in Firebase Console
- Check Firestore Security Rules allow your access

### Credentials not found
- Make sure environment variables start with `NEXT_PUBLIC_`
- Restart dev server after adding `.env.local`
- Verify `.env.local` is not in `.gitignore` (it should be for security)

### Firestore Rules error
- Go to Firestore Console → Rules tab
- Update rules to allow access for your use case

## Next Steps

1. Update Master Products Table to use Firebase
2. Update Products page to use Firebase
3. Add Firebase authentication for multi-user support
4. Set up automatic backups in Firebase Console

For questions, visit the [Firebase Documentation](https://firebase.google.com/docs).

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase-config';
import { Product } from './types';
import { generateDefaultSKU } from './sku-generator';

const PRODUCTS_COLLECTION = 'products';

// Interface for Firestore product (with Timestamp)
export interface FirestoreProduct extends Omit<Product, 'lastRestockDate' | 'lastSoldDate' | 'lastCountDate' | 'expiryDate'> {
  lastRestockDate?: Timestamp | null;
  lastSoldDate?: Timestamp | null;
  lastCountDate?: Timestamp | null;
  expiryDate?: Timestamp | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Add a new product to Firestore
 */
export async function addProduct(product: Omit<Product, 'id'>) {
  try {
    // Auto-generate SKU if not provided
    const sku = product.sku && product.sku.trim()
      ? product.sku
      : generateDefaultSKU(0, product.category);

    const productData: FirestoreProduct = {
      ...product,
      sku,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

/**
 * Get all products from Firestore
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('sku', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreProduct;
      return {
        ...data,
        id: doc.id,
        lastRestockDate: data.lastRestockDate?.toDate(),
        lastSoldDate: data.lastSoldDate?.toDate(),
        lastCountDate: data.lastCountDate?.toDate(),
        expiryDate: data.expiryDate?.toDate(),
      } as Product;
    });
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreProduct;
      return {
        ...data,
        id: doc.id,
        lastRestockDate: data.lastRestockDate?.toDate(),
        lastSoldDate: data.lastSoldDate?.toDate(),
        lastCountDate: data.lastCountDate?.toDate(),
        expiryDate: data.expiryDate?.toDate(),
      } as Product;
    });
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
}

/**
 * Get product by SKU
 */
export async function getProductBySKU(sku: string): Promise<Product | null> {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), where('sku', '==', sku));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data() as FirestoreProduct;
    return {
      ...data,
      id: doc.id,
      lastRestockDate: data.lastRestockDate?.toDate(),
      lastSoldDate: data.lastSoldDate?.toDate(),
      lastCountDate: data.lastCountDate?.toDate(),
      expiryDate: data.expiryDate?.toDate(),
    } as Product;
  } catch (error) {
    console.error('Error getting product by SKU:', error);
    throw error;
  }
}

/**
 * Update product
 */
export async function updateProduct(id: string, updates: Partial<Product>) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Delete product
 */
export async function deleteProduct(id: string) {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Batch import products
 */
export async function batchImportProducts(products: Omit<Product, 'id'>[]) {
  try {
    const collectionRef = collection(db, PRODUCTS_COLLECTION);
    const promises = products.map((product) => {
      const sku = product.sku && product.sku.trim()
        ? product.sku
        : generateDefaultSKU(0, product.category);

      return addDoc(collectionRef, {
        ...product,
        sku,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    });

    await Promise.all(promises);
    return { success: true, count: products.length };
  } catch (error) {
    console.error('Error batch importing products:', error);
    throw error;
  }
}

/**
 * Get low stock products
 */
export async function getLowStockProducts(): Promise<Product[]> {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter((p) => p.currentStock <= p.reorderLevel);
  } catch (error) {
    console.error('Error getting low stock products:', error);
    throw error;
  }
}

/**
 * Calculate total inventory value
 */
export async function getTotalInventoryValue(): Promise<number> {
  try {
    const products = await getAllProducts();
    return products.reduce((total, p) => total + p.currentStock * p.unitPrice, 0);
  } catch (error) {
    console.error('Error calculating total inventory value:', error);
    throw error;
  }
}

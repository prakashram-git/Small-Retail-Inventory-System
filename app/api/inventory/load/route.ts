import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const DATA_FILE = join(process.cwd(), 'data', 'inventory.json');

export async function GET() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    const inventoryData = JSON.parse(data);

    // Parse date strings back to Date objects
    if (inventoryData.products) {
      inventoryData.products = inventoryData.products.map((p: any) => ({
        ...p,
        lastRestockDate: p.lastRestockDate ? new Date(p.lastRestockDate) : undefined,
        lastSoldDate: p.lastSoldDate ? new Date(p.lastSoldDate) : undefined,
        lastCountDate: p.lastCountDate ? new Date(p.lastCountDate) : undefined,
      }));
    }

    if (inventoryData.movements) {
      inventoryData.movements = inventoryData.movements.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
    }

    if (inventoryData.purchaseOrders) {
      inventoryData.purchaseOrders = inventoryData.purchaseOrders.map((po: any) => ({
        ...po,
        orderDate: new Date(po.orderDate),
        expectedDeliveryDate: new Date(po.expectedDeliveryDate),
        actualDeliveryDate: po.actualDeliveryDate ? new Date(po.actualDeliveryDate) : undefined,
      }));
    }

    if (inventoryData.goodsReceipts) {
      inventoryData.goodsReceipts = inventoryData.goodsReceipts.map((gr: any) => ({
        ...gr,
        receiptDate: new Date(gr.receiptDate),
      }));
    }

    if (inventoryData.invoices) {
      inventoryData.invoices = inventoryData.invoices.map((inv: any) => ({
        ...inv,
        date: new Date(inv.date),
      }));
    }

    if (inventoryData.stocktakes) {
      inventoryData.stocktakes = inventoryData.stocktakes.map((st: any) => ({
        ...st,
        date: new Date(st.date),
      }));
    }

    return NextResponse.json(inventoryData);
  } catch (error) {
    console.error('Error in load endpoint:', error);
    // Return null if file doesn't exist yet
    return NextResponse.json(null, { status: 404 });
  }
}

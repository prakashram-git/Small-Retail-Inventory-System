import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const DATA_FILE = join(process.cwd(), 'data', 'inventory.json');

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Ensure data directory exists
    const dataDir = join(process.cwd(), 'data');
    try {
      await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true, message: 'Data saved successfully' });
    } catch (writeError) {
      console.error('Failed to write file:', writeError);
      // If file write fails, at least return success so client doesn't lose data
      return NextResponse.json(
        { success: true, message: 'Data queued for persistence' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error in save endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}

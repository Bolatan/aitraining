import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ModuleModel } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const modules = await ModuleModel.find({}).sort({ order: 1 });
    return NextResponse.json({ modules });
  } catch (error: unknown) {
    console.error('Fetch modules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

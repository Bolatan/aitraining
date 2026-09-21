import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ModuleModel } from '@/models';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    const moduleDoc = await ModuleModel.findOne({ slug });

    if (!moduleDoc) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json({ module: moduleDoc });
  } catch (error: unknown) {
    console.error('Fetch module error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

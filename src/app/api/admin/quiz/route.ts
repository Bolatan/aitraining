import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ModuleModel } from '@/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    const url = new URL(req.url);
    const moduleId = url.searchParams.get('moduleId');

    if (moduleId) {
      const moduleDoc = await ModuleModel.findById(moduleId);
      if (!moduleDoc) {
        return NextResponse.json({ error: 'Module not found' }, { status: 404 });
      }
      return NextResponse.json({ quiz: moduleDoc.quiz || [], moduleId: moduleDoc._id, moduleTitle: moduleDoc.title });
    }

    const modules = await ModuleModel.find({}).select('_id order title slug quiz').sort({ order: 1 });
    return NextResponse.json({ modules });
  } catch (error: unknown) {
    console.error('Fetch admin quiz error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { moduleId, quiz } = body;

    if (!moduleId || !Array.isArray(quiz)) {
      return NextResponse.json({ error: 'moduleId and quiz array are required' }, { status: 400 });
    }

    // Validate quiz questions format
    for (let i = 0; i < quiz.length; i++) {
      const q = quiz[i];
      if (!q.questionText || !Array.isArray(q.options) || q.options.length < 2 || typeof q.correctAnswerIndex !== 'number') {
        return NextResponse.json(
          { error: `Invalid quiz question format at question ${i + 1}. Must include questionText, at least 2 options, and correctAnswerIndex.` },
          { status: 400 }
        );
      }
      if (q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length) {
        return NextResponse.json(
          { error: `Invalid correctAnswerIndex at question ${i + 1}. Index out of options bounds.` },
          { status: 400 }
        );
      }
    }

    await connectToDatabase();

    const moduleDoc = await ModuleModel.findById(moduleId);
    if (!moduleDoc) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    moduleDoc.quiz = quiz;
    await moduleDoc.save();

    return NextResponse.json({
      message: `Quiz updated successfully for module "${moduleDoc.title}"`,
      quiz: moduleDoc.quiz,
      module: moduleDoc,
    });
  } catch (error: unknown) {
    console.error('Update quiz error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

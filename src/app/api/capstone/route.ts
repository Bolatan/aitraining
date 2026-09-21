import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { CapstoneSubmission, User } from '@/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const submission = await CapstoneSubmission.findOne({ userId: payload.userId });

    return NextResponse.json({ submission });
  } catch (error: unknown) {
    console.error('Fetch capstone error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { proposalUrl, deckUrl, infographicUrl, appUrl } = await req.json();

    if (!proposalUrl || !deckUrl || !infographicUrl || !appUrl) {
      return NextResponse.json(
        { error: 'All 4 URLs (proposal doc, slide deck, infographic, and live app) are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let submission = await CapstoneSubmission.findOne({ userId: user._id });

    if (!submission) {
      submission = new CapstoneSubmission({
        userId: user._id,
        proposalUrl,
        deckUrl,
        infographicUrl,
        appUrl,
        submittedAt: new Date(),
      });
    } else {
      submission.proposalUrl = proposalUrl;
      submission.deckUrl = deckUrl;
      submission.infographicUrl = infographicUrl;
      submission.appUrl = appUrl;
      submission.submittedAt = new Date();
    }

    await submission.save();

    return NextResponse.json({
      message: 'Capstone submitted successfully!',
      submission,
    });
  } catch (error: unknown) {
    console.error('Submit capstone error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

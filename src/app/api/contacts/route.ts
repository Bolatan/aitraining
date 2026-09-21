import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { User } from '@/models';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    let contacts;
    if (authUser.isAdmin) {
      // Admins see all students + other admins
      contacts = await User.find({ _id: { $ne: authUser.userId } })
        .select('_id name email isAdmin isAuthorized')
        .sort({ name: 1 });
    } else {
      // Students see all admins + peers
      contacts = await User.find({ _id: { $ne: authUser.userId } })
        .select('_id name email isAdmin isAuthorized')
        .sort({ isAdmin: -1, name: 1 });
    }

    return NextResponse.json({ contacts });
  } catch (error: unknown) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

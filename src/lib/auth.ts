import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'elearning-portal-super-secret-key-change-in-prod';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isAuthorized: boolean;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req?: NextRequest): Promise<TokenPayload | null> {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = req.cookies.get('token')?.value;
    }
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}

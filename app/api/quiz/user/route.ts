import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Quiz from '@/models/Quiz';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();
    const quizzes = await Quiz.find({ createdBy: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json(quizzes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

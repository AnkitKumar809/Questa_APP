import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Quiz from '@/models/Quiz';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await req.json();

    const { title, questions } = body;
    if (!title || !questions || questions.length < 2) {
      return NextResponse.json({ error: 'Title and at least 2 questions required' }, { status: 400 });
    }

    await connectDB();
    const quiz = await Quiz.create({
      title,
      questions,
      createdBy: decoded.userId,
    });

    return NextResponse.json({ quizId: quiz._id });
  } catch (_err) {
    console.error(_err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QuizResponse from '@/models/Response';
import mongoose from 'mongoose';

export async function POST(req: NextRequest, context: any) {
  try {
    await connectDB();
    const { answers, name, email, phone } = await req.json();

    if (!answers || !name || !email || !phone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const quizId = new mongoose.Types.ObjectId(context.params.id);

    const existing = await QuizResponse.findOne({
      quizId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });

    if (existing) {
      return NextResponse.json({ error: 'already-submitted' }, { status: 400 });
    }

    const response = new QuizResponse({
      quizId,
      answers,
      name,
      email,
      phone,
    });

    await response.save();
    return NextResponse.json({ message: 'Response submitted successfully' });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Error submitting response' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: any) {
  try {
    await connectDB();
    const quizId = new mongoose.Types.ObjectId(context.params.id);

    const responses = await QuizResponse.find({ quizId })
      .select('name email phone answers createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json(responses);
  } catch (err) {
    console.error('Error fetching responses:', err);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

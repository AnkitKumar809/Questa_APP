import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QuizResponse from '@/models/Response';

// Type for route params
interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const body = await req.json();
    const { answers, name, email, phone } = body;

    if (!answers || !name || !email || !phone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await QuizResponse.findOne({
      quizId: context.params.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });

    if (existing) {
      return NextResponse.json({ error: 'already-submitted' }, { status: 400 });
    }

    const response = new QuizResponse({
      quizId: context.params.id,
      answers,
      name,
      email,
      phone,
      createdAt: new Date(),
    });

    await response.save();
    return NextResponse.json({ message: 'Response submitted successfully' });
  } catch{
    console.error('API Error:');
    return NextResponse.json({ error: 'Error submitting response' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const responses = await QuizResponse.find({ quizId: context.params.id })
      .select('name email phone answers createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json(responses);
  } catch{
    console.error('Error fetching responses:');
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

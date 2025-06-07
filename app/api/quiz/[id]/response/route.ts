import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QuizResponse from '@/models/Response';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const { answers, name, email, phone } = body;

    if (!answers || !name || !email || !phone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await QuizResponse.findOne({
      quizId: params.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });

    if (existing) {
      return NextResponse.json({ error: 'already-submitted' }, { status: 400 });
    }

    const response = new QuizResponse({
      quizId: params.id,
      answers,
      name,
      email,
      phone,
      createdAt: new Date(),
    });

    await response.save();
    return NextResponse.json({ message: 'Response submitted successfully' });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Error submitting response' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const responses = await QuizResponse.find({ quizId: params.id })
      .select('name email phone answers createdAt') // only these fields
      .sort({ createdAt: -1 });

    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Quiz from '@/models/Quiz';

type Context = {
  params: {
    id: string;
  };
};

// GET handler (already working)
export async function GET(req: Request, context: Context) {
  const { id } = await context.params;
  await connectDB();

  const quiz = await Quiz.findById(id).select('-createdBy -__v');
  if (!quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }

  return NextResponse.json(quiz);
}

// PUT handler to save edited quiz
export async function PUT(req: Request, context: Context) {
  const { id } = await context.params;
  await connectDB();

  try {
    const updatedData = await req.json();
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(updatedQuiz);
  } catch{
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
  }
}

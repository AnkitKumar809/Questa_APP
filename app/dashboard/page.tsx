'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Quiz = {
  _id: string;
  title: string;
};

export default function DashboardPage() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (!token) redirect('/login');
  }

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState('');
  const [copiedQuizId, setCopiedQuizId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    async function fetchQuizzes() {
      try {
        const res = await fetch('/api/quiz/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to fetch quizzes');
        } else {
          setQuizzes(data);
        }
      } catch {
        setError('Something went wrong while fetching quizzes.');
      }
    }

    fetchQuizzes();
  }, [router]);

  const copyToClipboard = (quizId: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedQuizId(quizId);
    setTimeout(() => {
      setCopiedQuizId(null);
    }, 5000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Quizzes</h2>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => router.push('./create-quiz')}
        >
          + Create Quiz
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {quizzes.map((quiz) => {
          const publicLink = `${window.location.origin}/quiz/${quiz._id}`;
          const isCopied = copiedQuizId === quiz._id;
          
          return (
            <div
              key={quiz._id}
              className="border p-4 rounded shadow-sm bg-white space-y-2"
            >
              <h3 className="text-xl font-semibold">{quiz.title}</h3>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Public Link:{' '}
                  <a
                    href={publicLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline ml-2"
                  >
                    {publicLink}
                  </a>
                </span>
                <button
                  onClick={() => copyToClipboard(quiz._id, publicLink)}
                  className={`text-sm px-2 py-1 rounded hover:bg-gray-300 ${
                    isCopied
                      ? 'bg-green-600 text-white cursor-default'
                      : 'bg-gray-200'
                  }`}
                  disabled={isCopied}
                >
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="flex gap-4 mt-2">
                <Link
                  href={`/dashboard/quiz/${quiz._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Review
                </Link>
                <Link
                  href={`/dashboard/quiz/${quiz._id}/responses`}
                  className="text-green-600 hover:underline"
                >
                  View Responses
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

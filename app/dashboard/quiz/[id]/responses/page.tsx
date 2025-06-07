'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Question = {
  question: string;
  type: string;
};

type Response = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  answers: {
    [questionIndex: string]: string;
  };
  createdAt: string;
};

export default function ViewResponsesPage() {
  const { id } = useParams();
  const [responses, setResponses] = useState<Response[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [resQuiz, resResponses] = await Promise.all([
          fetch(`/api/quiz/${id}`),
          fetch(`/api/quiz/${id}/response`),
        ]);

        const quizData = await resQuiz.json();
        const responseData = await resResponses.json();

        if (!resQuiz.ok || !resResponses.ok) {
          throw new Error('Failed to fetch data');
        }

        setQuestions(quizData.questions || []);
        setResponses(responseData);
      } catch{
        setError('Failed to load responses or quiz data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // Function to generate and download CSV
  const downloadCSV = () => {
    if (responses.length === 0) return;

    // Header: fixed user info + questions
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Submitted On',
      ...questions.map((q, i) => `Q${i + 1}: ${q.question}`),
    ];

    // Rows: map over each response and collect answers
    const rows = responses.map((resp) => [
      resp.name,
      resp.email,
      resp.phone,
      new Date(resp.createdAt).toLocaleString(),
      ...questions.map((_, i) => resp.answers[i] || ''),
    ]);

    // Combine headers + rows as CSV string
    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => {
              // Escape quotes & commas by wrapping with quotes & escaping internal quotes
              const cellStr = cell?.toString() || '';
              return `"${cellStr.replace(/"/g, '""')}"`;
            })
            .join(',')
        )
        .join('\n');

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_${id}_responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-6">Loading responses...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Submitted Responses</h2>

      {responses.length === 0 ? (
        <p>No one has submitted this quiz yet.</p>
      ) : (
        <>
          {responses.map((response, idx) => (
            <div key={response._id} className="bg-white rounded-xl shadow-md p-5 mb-6">
              <h3 className="text-lg font-semibold mb-2">Candidate {idx + 1}</h3>

              <div className="mb-3 text-sm text-gray-600">
                <p><strong>Name:</strong> {response.name}</p>
                <p><strong>Email:</strong> {response.email}</p>
                <p><strong>Phone:</strong> {response.phone}</p>
                <p><strong>Submitted on:</strong> {new Date(response.createdAt).toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                {questions.map((q, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">Q{i + 1}: {q.question}</p>
                    <p className="text-gray-700 mt-1">Ans: {response.answers[i] || 'No answer provided'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Download CSV Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={downloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
              aria-label="Download all quiz responses as CSV"
            >
              Download All Responses as CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}

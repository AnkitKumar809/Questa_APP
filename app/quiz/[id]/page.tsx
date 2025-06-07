'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Question = {
  question: string;
  type: 'short-text' | 'single-choice'; // Add more types if needed
  options?: string[];
};

type Quiz = {
  _id: string;
  title: string;
  questions: Question[];
};

export default function PublicQuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/quiz/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load quiz');
        setQuiz(data);
      } catch {
        setError('Failed to load quiz.');
      }
    }
    if (id) fetchQuiz();
  }, [id]);

  const handleChange = (index: number, value: string) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    if (!userInfo.name || !userInfo.email || !userInfo.phone) {
      setError('Please fill in all required user details.');
      return;
    }

    try {
      const res = await fetch(`/api/quiz/${id}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'already-submitted') {
          setSubmitted(true);
          setError('already-submitted');
        } else {
          throw new Error(data.error || 'Failed to submit');
        }
        return;
      }

      setSubmitted(true);
    } catch (err) {
      if (error !== 'already-submitted') {
        setError('Error submitting response.');
        console.error('Submit error:', err);
      }
    }
  };

  if (error === 'already-submitted') {
    return (
      <div className="flex justify-center">
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md text-center mt-10">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            You have already submitted the quiz.
          </h2>
          <p className="text-gray-700">Duplicate submissions are not allowed.</p>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!quiz) return <div className="p-6">Loading...</div>;

  if (submitted)
    return (
      <div className="flex justify-center">
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md text-center mt-10">
          <h2 className="text-xl font-semibold text-green-600 mb-2">Thank you!</h2>
          <p className="text-gray-700">Your response has been submitted successfully.</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>

      {/* User Info */}
      <div className="bg-white p-4 border rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Your Details</h3>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-3"
          value={userInfo.name}
          onChange={handleUserInfoChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={userInfo.email}
          onChange={handleUserInfoChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          className="w-full p-2 border rounded"
          value={userInfo.phone}
          onChange={handleUserInfoChange}
          required
        />
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {quiz.questions.map((q: Question, idx: number) => (
          <div key={idx} className="bg-white p-4 border shadow rounded">
            <p className="font-semibold mb-2">
              Q{idx + 1}: {q.question}
            </p>
            {q.type === 'short-text' ? (
              <textarea
                className="w-full border p-2 rounded"
                rows={3}
                value={answers[idx] || ''}
                onChange={(e) => handleChange(idx, e.target.value)}
              />
            ) : (
              q.options?.map((opt: string, i: number) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={() => handleChange(idx, opt)}
                  />
                  <label>{opt}</label>
                </div>
              ))
            )}
          </div>
        ))}

        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

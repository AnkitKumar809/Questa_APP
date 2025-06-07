'use client';

import { useState } from 'react';

type Question = {
  question: string;
  type: 'short-text' | 'single-choice';
  options: string[];
};

export default function CreateQuizPage() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', type: 'short-text', options: [''] },
    { question: '', type: 'short-text', options: [''] },
  ]);
  const [error, setError] = useState('');
  const [quizId, setQuizId] = useState('');
  const handleQuestionChange = (index: number, field: keyof Question, value: string) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'type' && value === 'short-text') {
      updated[index].options = [''];
    }

    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addOption = (index: number) => {
    const updated = [...questions];
    updated[index].options.push('');
    setQuestions(updated);
  };
  
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', type: 'short-text', options: [''] },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) return setError('Unauthorized');

    if (questions.length < 2) {
      setError('Please add at least 2 questions.');
      return;
    }

    try {
      const res = await fetch('/api/quiz/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, questions }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setQuizId(data.quizId);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  if (quizId) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center bg-gradient-to-r from-blue-50 to-white border border-blue-200 shadow-md rounded-2xl px-6 py-5 gap-5">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">
            🎉
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Quiz Created Successfully!</h2>
            <p className="text-sm text-gray-600">Share the quiz link with others:</p>
            <a
              href={`/quiz/${quizId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-1 text-blue-600 font-medium underline break-all"
            >
              {`${window.location.origin}/quiz/${quizId}`}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create a New Quiz</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Quiz Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {questions.map((q, index) => (
          <div key={index} className="border p-4 rounded bg-gray-100">
            <label className="block font-semibold">Question {index + 1}</label>
            <input
              type="text"
              className="w-full p-2 border rounded my-2"
              value={q.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              required
            />

            <label className="block font-medium">Type</label>
            <select
              className="w-full p-2 border rounded mb-2"
              value={q.type}
              onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
            >
              <option value="short-text">Short Text</option>
              <option value="single-choice">Single Choice</option>
            </select>

            {q.type === 'single-choice' &&
              q.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  className="w-full p-2 border rounded mb-1"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, i, e.target.value)}
                  required
                />
              ))}

            {q.type === 'single-choice' && (
              <button
                type="button"
                className="text-blue-600 mt-1 text-sm"
                onClick={() => addOption(index)}
              >
                + Add Option
              </button>
            )}
          </div>
        ))}

        <div className="flex space-x-10">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            + Add Question
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
}

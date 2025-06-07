'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Quiz = {
  title: string;
  questions: {
    question: string;
    type: string;
    options?: string[];
  }[];
};

export default function ReviewQuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [updatedQuiz, setUpdatedQuiz] = useState<Quiz | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/quiz/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Quiz not found');
        } else {
          setQuiz(data);
          setUpdatedQuiz(JSON.parse(JSON.stringify(data))); // deep clone for editing
        }
      } catch (err) {
        setError('Failed to load quiz.');
      }
    }

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const handleQuestionChange = (index: number, value: string) => {
    if (!updatedQuiz) return;
    const updated = { ...updatedQuiz };
    updated.questions[index].question = value;
    setUpdatedQuiz(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    if (!updatedQuiz) return;
    const updated = { ...updatedQuiz };
    if (!updated.questions[qIndex].options) return;
    updated.questions[qIndex].options![oIndex] = value;
    setUpdatedQuiz(updated);
  };

  const handleTitleChange = (value: string) => {
    if (!updatedQuiz) return;
    setUpdatedQuiz({ ...updatedQuiz, title: value });
  };

  const handleSave = async () => {
    if (!updatedQuiz) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/quiz/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuiz),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save changes');
      setQuiz(data);
      setUpdatedQuiz(JSON.parse(JSON.stringify(data))); // keep updatedQuiz in sync with saved quiz
      setEditMode(false);
    } catch (err) {
      alert('Error saving quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (quiz) {
      setUpdatedQuiz(JSON.parse(JSON.stringify(quiz))); // reset updatedQuiz to original quiz (deep clone)
    }
    setEditMode(false);
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!quiz || !updatedQuiz) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Review Quiz</h2>
        {editMode ? (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleCancelEdit}
          >
            Cancel Edit
          </button>
        ) : (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setEditMode(true)}
          >
            Edit Quiz
          </button>
        )}
      </div>

      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="text-lg font-semibold text-gray-800">Quiz Title:</h3>
        {editMode ? (
          <input
            type="text"
            className="w-full border p-2 rounded mt-1"
            value={updatedQuiz.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        ) : (
          <p className="text-gray-700 mt-1">{quiz.title}</p>
        )}
      </div>

      <div className="space-y-6">
        {updatedQuiz.questions.map((q, idx) => (
          <div key={idx} className="bg-white border shadow-sm rounded-xl p-5">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Question {idx + 1}:
            </h4>
            {editMode ? (
              <input
                type="text"
                className="w-full border p-2 rounded mb-3"
                value={q.question}
                onChange={(e) => handleQuestionChange(idx, e.target.value)}
              />
            ) : (
              <p className="text-gray-700 mb-3">{q.question}</p>
            )}

            <p className="text-sm text-gray-500 mb-2">
              Type: {q.type === 'short-text' ? 'Short Text Answer' : 'Single Choice'}
            </p>

            {q.type === 'single-choice' && q.options?.length > 0 && (
              <div className="pl-4 space-y-1">
                {q.options.map((opt, i) => (
                  <div key={i}>
                    {editMode ? (
                      <input
                        type="text"
                        className="w-full border p-1 rounded"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, i, e.target.value)}
                      />
                    ) : (
                      <div className="text-gray-700">• {opt}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {editMode && (
        <div className="text-right">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }), // include name
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    // Auto-login after signup
    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json();
    if (loginRes.ok) {
      localStorage.setItem('token', loginData.token);
      router.refresh();
      router.push('/login');
    } else {
      router.push('/login');
    }
  }

  return (
    <div className="min-h-[81vh] flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label className="block mb-2 font-semibold">Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-6"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

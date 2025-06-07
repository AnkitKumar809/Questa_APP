'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Special case: if on /quiz/[id], show only logo
  const isQuizPage = pathname?.startsWith('/quiz/');
  const isPrivateRoute = pathname?.startsWith('/dashboard') || pathname === '/create' || pathname === '/';

  useEffect(() => {
    const t = localStorage.getItem('token');
    const n = localStorage.getItem('name');
    setToken(t);
    setName(n);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setToken(null);
    setName(null);
    router.push('/');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link
        href={token && isPrivateRoute ? '/dashboard' : '/'}
        className="text-xl font-bold cursor-pointer hover"
      >
        Questa
      </Link>

      {!isQuizPage && (
        <div className="space-x-8 flex items-center">
          {!token ? (
            <>
              <Link
                href="/login"
                className="border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition"
              >
                Sign Up
              </Link>
            </>
          ) : isPrivateRoute ? (
            <>
              <span className="border border-white px-3 py-1 rounded font-semibold text-white">
                {name}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      )}
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Check if URL starts with /quiz/ (public quiz page)
  const isQuizPage = pathname?.startsWith('/quiz/');

  if (isQuizPage) {
    // Footer content for public quiz pages (only positive message)
    return (
      <footer className="w-full border-t bg-white text-gray-600 shadow-inner py-6 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm font-semibold text-green-700">
          Welcome!
Thank you for taking the time to test your knowledge. Remember, every attempt is a chance to learn and grow. Give it your best.
        </div>
      </footer>
    );
  }

  // Default footer content for all other pages
  return (
    <footer className="w-full border-t bg-white text-gray-600 shadow-inner py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4">
        <p className="text-sm text-center md:text-left">
          Made by <span className="font-semibold text-black">Ankit Kumar</span> —
        </p>

        <div className="flex space-x-4">
          <Link
            href="https://github.com/AnkitKumar809"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-gray-700 hover:text-black transition"
          >
            <Github size={18} />
            <span>GitHub</span>
          </Link>

          <Link
            href="https://www.linkedin.com/in/ankit-kumar-7b3801241/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-gray-700 hover:text-black transition"
          >
            <Linkedin size={18} />
            <span>LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

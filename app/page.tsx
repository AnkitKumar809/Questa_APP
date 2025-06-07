// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <section className="min-h-[81vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
  <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
    Welcome to <span className="text-blue-600">Questa</span>
  </h1> 
  <p className="text-muted-foreground text-lg max-w-md mb-8">
    Create quizzes. Share publicly. Collect answers effortlessly.
  </p>

  <div className="flex gap-4 flex-wrap justify-center bg-gray-900 text-white rounded-lg">
    <Link href="/login">
      <Button size="lg">Get Started</Button>
    </Link>
  </div>
</section>

  );
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>demo-ilie</h1>
      <p>
        <Link href="/sign-in">Sign in</Link>
      </p>
    </main>
  );
}

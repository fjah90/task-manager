import Link from 'next/link';
import { LoginForm } from '@/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900">
        Sign in
      </h1>
      <LoginForm />
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-teal-800 underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

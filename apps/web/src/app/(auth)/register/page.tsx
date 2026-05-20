import Link from 'next/link';
import { RegisterForm } from '@/features/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900">
        Create account
      </h1>
      <RegisterForm />
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-teal-800 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

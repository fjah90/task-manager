import Link from 'next/link';
import { RegisterForm } from '@/features/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Create account</h1>
      <RegisterForm />
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-gray-900 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

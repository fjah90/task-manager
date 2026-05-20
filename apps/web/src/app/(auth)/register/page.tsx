import Link from 'next/link';
import { RegisterForm } from '@/features/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
        Crear cuenta
      </h1>
      <RegisterForm />
      <p className="text-center text-sm" style={{ color: 'var(--charcoal)', opacity: 0.75 }}>
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold underline" style={{ color: 'var(--brand-dark)' }}>
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}

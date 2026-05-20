import Link from 'next/link';
import { LoginForm } from '@/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
        Iniciar sesión
      </h1>
      <LoginForm />
      <p className="text-center text-sm" style={{ color: 'var(--charcoal)', opacity: 0.75 }}>
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="font-semibold underline" style={{ color: 'var(--brand-dark)' }}>
          Crear una
        </Link>
      </p>
    </div>
  );
}

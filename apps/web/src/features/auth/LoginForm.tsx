'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoginSchema, type LoginInput } from '@/lib/schemas';
import { useLogin } from '@/features/auth/hooks';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { getAuthErrorMessage } from '@/lib/auth-error-message';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: 'onSubmit',
  });
  const login = useLogin();

  return (
    <form
      onSubmit={handleSubmit((values) => login.mutate(values))}
      className="flex flex-col gap-4"
      noValidate
    >
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {login.isError && (
        <p role="alert" className="rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(220,38,38,0.06)', color: 'var(--danger)' }}>
          {getAuthErrorMessage(login.error)}
        </p>
      )}
      <Button type="submit" disabled={login.isPending} className="mt-1 w-full">
        {login.isPending ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}

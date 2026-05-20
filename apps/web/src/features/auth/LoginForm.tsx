'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoginSchema, type LoginInput } from '@/lib/schemas';
import { useLogin } from '@/features/auth/hooks';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

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
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {login.isError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {login.error instanceof Error
            ? login.error.message
            : 'Login failed'}
        </p>
      )}
      <Button type="submit" disabled={login.isPending} className="mt-1 w-full">
        {login.isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}

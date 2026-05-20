'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RegisterSchema, type RegisterInput } from '@/lib/schemas';
import { useRegister } from '@/features/auth/hooks';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onSubmit',
  });
  const reg = useRegister();

  return (
    <form
      onSubmit={handleSubmit((values) => reg.mutate(values))}
      className="flex flex-col gap-4"
      noValidate
    >
      <Input
        label="Name"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
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
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {reg.isError && (
        <p role="alert" className="text-sm text-red-600">
          {reg.error instanceof Error
            ? reg.error.message
            : 'Registration failed'}
        </p>
      )}
      <Button type="submit" disabled={reg.isPending}>
        {reg.isPending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}

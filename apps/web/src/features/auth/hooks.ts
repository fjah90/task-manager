'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiFetch, tokenStorage } from '@/lib/api-client';
import type {
  AuthResult,
  LoginInput,
  RegisterInput,
} from '@/lib/schemas';

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiFetch<AuthResult>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => {
      tokenStorage.set(data.token);
      toast.success('Sesión iniciada');
      router.replace('/tasks');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      apiFetch<AuthResult>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => {
      tokenStorage.set(data.token);
      toast.success('Cuenta creada. ¡Bienvenido!');
      router.replace('/tasks');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function logout(): void {
  tokenStorage.clear();
}

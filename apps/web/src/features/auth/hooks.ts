'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
      router.replace('/tasks');
    },
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
      router.replace('/tasks');
    },
  });
}

export function logout(): void {
  tokenStorage.clear();
}

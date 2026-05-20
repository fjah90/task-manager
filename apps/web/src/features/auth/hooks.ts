'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiFetch<AuthResult>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => {
      qc.clear();
      tokenStorage.set(data.token);
      toast.success('Sesión iniciada');
      router.replace('/tasks');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRegister() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      apiFetch<AuthResult>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => {
      qc.clear();
      tokenStorage.set(data.token);
      toast.success('Cuenta creada. ¡Bienvenido!');
      router.replace('/tasks');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return () => {
    tokenStorage.clear();
    qc.clear();
  };
}

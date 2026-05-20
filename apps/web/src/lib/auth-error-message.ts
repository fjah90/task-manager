import { ApiError } from '@/lib/api-client';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contrasena incorrectos.',
  EMAIL_TAKEN: 'Este correo ya esta registrado.',
  NETWORK_ERROR:
    'No se pudo conectar con el servidor. Verifica que Docker este levantado.',
  VALIDATION_ERROR: 'Revisa los datos ingresados y vuelve a intentar.',
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Ocurrio un error inesperado. Intentalo nuevamente.';
}

import { test, expect } from '@playwright/test';

const unique = Date.now().toString(36);
const TEST_USER = {
  name: `E2E User ${unique}`,
  email: `e2e-${unique}@test.com`,
  password: 'Test1234!',
};

test.describe('Task Manager E2E', () => {
  test('register → create task → toggle done → delete → logout', async ({ page }) => {
    // ── Register ──
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /crear cuenta/i })).toBeVisible();

    await page.getByLabel(/nombre/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/contraseña/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /crear cuenta/i }).click();

    // ── Redirected to /tasks ──
    await page.waitForURL('**/tasks', { timeout: 20_000 });
    await expect(page.getByText(/mis tareas/i)).toBeVisible({ timeout: 5_000 });

    // ── Create a task ──
    await page.getByText(/agregar tarea/i).click();
    await page.getByLabel(/título/i).fill('Tarea de prueba E2E');
    await page.getByRole('button', { name: /crear tarea/i }).click();

    // Task appears in list
    await expect(page.getByText('Tarea de prueba E2E')).toBeVisible({ timeout: 10_000 });

    // ── Toggle status to done ──
    const taskRow = page.locator('li').filter({ hasText: 'Tarea de prueba E2E' });
    // Click the circle/check toggle button (first button in the row)
    await taskRow.locator('button').first().click();
    // Wait for mutation to settle
    await page.waitForTimeout(1_000);

    // ── Delete task ──
    await taskRow.hover();
    await taskRow.locator('button[aria-label="Eliminar"]').click();

    // SweetAlert2 confirmation dialog
    await expect(page.locator('.swal2-popup')).toBeVisible({ timeout: 5_000 });
    await page.locator('.swal2-confirm').click();

    // Task gone
    await expect(page.getByText('Tarea de prueba E2E')).not.toBeVisible({ timeout: 10_000 });

    // ── Logout ──
    await page.getByRole('button', { name: /salir/i }).click();
    await page.waitForURL('**/login', { timeout: 10_000 });
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('login with invalid credentials shows error toast', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();

    await page.getByLabel(/email/i).fill('no-existe@fake.com');
    await page.getByLabel(/contraseña/i).fill('wrongpassword');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Sonner toast should show error message
    await expect(
      page.locator('[data-sonner-toast]').first(),
    ).toBeVisible({ timeout: 10_000 });
  });
});

/**
 * Task Manager — E2E test suite
 *
 * Architecture (follows playwright-best-practices skill):
 *  - Custom `test` from fixtures.ts exposes `loginPage`, `registerPage`, `tasksPage`, `auth`
 *  - `auth` fixture creates a fresh user via REST API + injects JWT → no UI login overhead
 *  - Page Objects encapsulate all selectors and interactions
 *  - No `waitForTimeout` — auto-waiting assertions and `waitForResponse` instead
 *  - Role-based locators as first choice; CSS class selectors avoided
 *  - Tags: @smoke (critical path), @auth, @crud, @filter
 */

import { test, expect, makeUser } from './fixtures';
import { TasksPage } from './pages/tasks.page';

// ── Auth flows ─────────────────────────────────────────────────────────────

test.describe('Auth', () => {
  test('register creates account and redirects to /tasks @smoke @auth', async ({
    registerPage,
    page,
  }) => {
    const user = makeUser('reg');
    await registerPage.registerAndRedirect(user);
    await expect(page.getByText(/mis tareas/i)).toBeVisible();
  });

  test('register with duplicate email shows error toast @auth', async ({ registerPage, page }) => {
    const user = makeUser('dup');
    await registerPage.registerAndRedirect(user);
    await page.getByRole('button', { name: /salir/i }).click();
    await page.waitForURL('**\/login');

    await registerPage.goto();
    await registerPage.fillForm(user);
    await registerPage.submit();

    await expect(page.locator('[data-sonner-toast]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('register form rejects invalid email inline @auth', async ({ registerPage, page }) => {
    await registerPage.goto();
    await registerPage.fillForm({ name: 'Test', email: 'not-an-email', password: 'Test1234!' });
    await registerPage.submit();

    await expect(page).toHaveURL(/register/);
    await expect(page.locator('[role="alert"], p[class*="red"], [class*="error"]').first()).toBeVisible({
      timeout: 3_000,
    });
  });

  test('login with valid credentials redirects to /tasks @smoke @auth', async ({
    registerPage,
    loginPage,
    page,
  }) => {
    const user = makeUser('lgn');
    await registerPage.registerAndRedirect(user);
    await page.getByRole('button', { name: /salir/i }).click();
    await page.waitForURL('**\/login');

    await loginPage.loginAndRedirect(user.email, user.password);
    await expect(page.getByText(/mis tareas/i)).toBeVisible();
  });

  test('login with wrong credentials shows error toast @auth', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.fillForm('nobody@fake.com', 'wrongpassword');
    await loginPage.submit();

    await expect(page.locator('[data-sonner-toast]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('logout redirects to /login and /tasks becomes protected @auth', async ({
    registerPage,
    page,
  }) => {
    const user = makeUser('lgt');
    await registerPage.registerAndRedirect(user);

    await page.getByRole('button', { name: /salir/i }).click();
    await page.waitForURL('**\/login', { timeout: 10_000 });
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();

    await page.goto('/tasks');
    await page.waitForURL('**\/login', { timeout: 10_000 });
  });
});

// ── Task CRUD ──────────────────────────────────────────────────────────────

test.describe('Tasks CRUD', () => {
  test('create task appears in list @smoke @crud', async ({ auth }) => {
    await auth.tasksPage.createTask('Nueva tarea basica');
    await expect(auth.tasksPage.row('Nueva tarea basica')).toBeVisible();
  });

  test('create task with description @crud', async ({ auth }) => {
    await auth.tasksPage.createTask('Tarea con desc', 'Detalle de la tarea');
    await expect(auth.tasksPage.row('Tarea con desc')).toBeVisible();
  });

  test('cancel create form hides the form @crud', async ({ auth }) => {
    await auth.tasksPage.openCreateForm();
    await auth.tasksPage.cancelButton.click();
    await expect(auth.tasksPage.titleInput).not.toBeVisible();
  });

  test('edit task updates the title @smoke @crud', async ({ auth }) => {
    await auth.tasksPage.createTask('Antes del edit');
    await auth.tasksPage.editTask('Antes del edit', 'Despues del edit');

    await expect(auth.tasksPage.row('Despues del edit')).toBeVisible();
    await expect(auth.tasksPage.row('Antes del edit')).not.toBeVisible();
  });

  test('toggle to done applies strikethrough @crud', async ({ auth }) => {
    const title = 'Tarea a completar';
    await auth.tasksPage.createTask(title);
    await auth.tasksPage.toggleTask(title);

    await expect(auth.tasksPage.row(title).locator('p.line-through')).toBeVisible({ timeout: 5_000 });
  });

  test('toggle back to pending removes strikethrough @crud', async ({ auth }) => {
    const title = 'Tarea para re-abrir';
    await auth.tasksPage.createTask(title);
    await auth.tasksPage.toggleTask(title);
    await auth.tasksPage.toggleTask(title);

    await expect(auth.tasksPage.row(title).locator('p.line-through')).not.toBeVisible({ timeout: 5_000 });
  });

  test('delete task removes it from list @smoke @crud', async ({ auth }) => {
    await auth.tasksPage.createTask('Tarea a eliminar');
    await auth.tasksPage.deleteTask('Tarea a eliminar');
    await expect(auth.tasksPage.row('Tarea a eliminar')).not.toBeVisible();
  });

  test('cancel delete keeps the task @crud', async ({ auth }) => {
    await auth.tasksPage.createTask('Tarea que NO se elimina');
    await auth.tasksPage.cancelDelete('Tarea que NO se elimina');
    await expect(auth.tasksPage.row('Tarea que NO se elimina')).toBeVisible();
  });
});

// ── Filters ────────────────────────────────────────────────────────────────

test.describe('Filters', () => {
  test('Pendientes tab shows only pending tasks @filter', async ({ auth }) => {
    await auth.tasksPage.createTask('Pendiente siempre');
    await auth.tasksPage.createTask('Sera completada');
    await auth.tasksPage.toggleTask('Sera completada');

    await auth.tasksPage.filterPending.click();

    await expect(auth.tasksPage.row('Pendiente siempre')).toBeVisible();
    await expect(auth.tasksPage.row('Sera completada')).not.toBeVisible();
  });

  test('Completadas tab shows only done tasks @filter', async ({ auth }) => {
    await auth.tasksPage.createTask('Siempre pendiente');
    await auth.tasksPage.createTask('Siempre completada');
    await auth.tasksPage.toggleTask('Siempre completada');

    await auth.tasksPage.filterDone.click();

    await expect(auth.tasksPage.row('Siempre completada')).toBeVisible();
    await expect(auth.tasksPage.row('Siempre pendiente')).not.toBeVisible();
  });

  test('Todas tab shows tasks of both statuses @filter', async ({ auth }) => {
    await auth.tasksPage.createTask('Mix pendiente');
    await auth.tasksPage.createTask('Mix completada');
    await auth.tasksPage.toggleTask('Mix completada');

    await auth.tasksPage.filterDone.click();
    await auth.tasksPage.filterAll.click();

    await expect(auth.tasksPage.row('Mix pendiente')).toBeVisible();
    await expect(auth.tasksPage.row('Mix completada')).toBeVisible();
  });
});

// ── Full smoke flow ────────────────────────────────────────────────────────

test.describe('Full flow', () => {
  test('register to logout full smoke @smoke', async ({ registerPage, page }) => {
    const user = makeUser('full');
    await registerPage.registerAndRedirect(user);

    const tasks = new TasksPage(page);

    await tasks.createTask('Flujo completo');
    await tasks.editTask('Flujo completo', 'Flujo completo editado');
    await tasks.toggleTask('Flujo completo editado');

    await tasks.filterDone.click();
    await expect(tasks.row('Flujo completo editado')).toBeVisible();

    await tasks.deleteTask('Flujo completo editado');
    await expect(tasks.row('Flujo completo editado')).not.toBeVisible();

    await tasks.logout();
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();
  });
});

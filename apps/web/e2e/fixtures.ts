import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { RegisterPage } from './pages/register.page';
import { TasksPage } from './pages/tasks.page';

// ── Data factory ────────────────────────────────────────────────────────────

export interface UserData {
  name: string;
  email: string;
  password: string;
}

let _seq = 0;
export function makeUser(prefix = 'u'): UserData {
  const id = `${Date.now().toString(36)}${(++_seq).toString(36)}`;
  return { name: `${prefix} ${id}`, email: `${prefix}-${id}@e2e.com`, password: 'Test1234!' };
}

// ── Fixture types ───────────────────────────────────────────────────────────

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  tasksPage: TasksPage;
  /** Starts the test already logged in — creates a fresh user via API (no UI overhead). */
  auth: { page: Page; tasksPage: TasksPage; user: UserData };
};

// ── Custom test ─────────────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  tasksPage: async ({ page }, use) => {
    await use(new TasksPage(page));
  },

  /**
   * Registers a unique user via the REST API, injects the JWT into localStorage,
   * then navigates to /tasks — so each test that uses `auth` starts fully authenticated
   * without going through the register/login UI (faster, not testing auth).
   */
  auth: async ({ page, request }, use) => {
    const user = makeUser('fx');

    const res = await request.post('/api/auth/register', { data: user });
    if (!res.ok()) {
      throw new Error(`Auth fixture: register failed (${res.status()}): ${await res.text()}`);
    }
    const { token } = (await res.json()) as { token: string };

    // Inject JWT — must navigate to the origin first so localStorage is scoped correctly
    await page.goto('/login');
    await page.evaluate(
      ([key, value]) => window.localStorage.setItem(key, value),
      ['tm_token', token],
    );

    const tasksPage = new TasksPage(page);
    await tasksPage.goto();

    await use({ page, tasksPage, user });
  },
});

export { expect } from '@playwright/test';

import { type Page, type Locator, expect } from '@playwright/test';
import type { UserData } from '../fixtures';

export class RegisterPage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.nameInput = page.getByLabel(/nombre/i);
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/contraseña/i);
    this.submitButton = page.getByRole('button', { name: /crear cuenta/i });
  }

  async goto() {
    await this.page.goto('/register');
    await expect(this.page.getByRole('heading', { name: /crear cuenta/i })).toBeVisible();
  }

  async fillForm(user: UserData) {
    await this.nameInput.fill(user.name);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async registerAndRedirect(user: UserData) {
    await this.goto();
    await this.fillForm(user);
    await this.submit();
    await this.page.waitForURL('**/tasks', { timeout: 20_000 });
  }
}

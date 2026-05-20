import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: /iniciar sesión/i });
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/contraseña/i);
    this.submitButton = page.getByRole('button', { name: /iniciar sesión/i });
  }

  async goto() {
    await this.page.goto('/login');
    await expect(this.heading).toBeVisible();
  }

  async fillForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async loginAndRedirect(email: string, password: string) {
    await this.goto();
    await this.fillForm(email, password);
    await this.submit();
    await this.page.waitForURL('**/tasks', { timeout: 20_000 });
  }
}

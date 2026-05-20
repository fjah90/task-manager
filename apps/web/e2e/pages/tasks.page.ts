import { type Page, type Locator, expect } from '@playwright/test';

export class TasksPage {
  readonly heading: Locator;
  readonly addButton: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;
  readonly logoutButton: Locator;
  readonly filterAll: Locator;
  readonly filterPending: Locator;
  readonly filterDone: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText(/mis tareas/i);
    this.addButton = page.getByText(/agregar tarea/i);
    this.titleInput = page.getByLabel(/título/i);
    this.descriptionInput = page.getByLabel(/descripción/i);
    this.createButton = page.getByRole('button', { name: /crear tarea/i });
    this.cancelButton = page.getByRole('button', { name: /cancelar/i });
    this.saveButton = page.getByRole('button', { name: /guardar/i });
    this.logoutButton = page.getByRole('button', { name: /salir/i });
    this.filterAll = page.getByRole('button', { name: 'Todas' });
    this.filterPending = page.getByRole('button', { name: 'Pendientes' });
    this.filterDone = page.getByRole('button', { name: 'Completadas' });
  }

  /** Locator for a task row by its title. */
  row(title: string): Locator {
    return this.page.getByRole('listitem').filter({ hasText: title });
  }

  async goto() {
    await this.page.goto('/tasks');
    await expect(this.heading).toBeVisible({ timeout: 10_000 });
  }

  async openCreateForm() {
    await this.addButton.click();
    await expect(this.titleInput).toBeVisible();
  }

  async createTask(title: string, description = '') {
    await this.openCreateForm();
    await this.titleInput.fill(title);
    if (description) await this.descriptionInput.fill(description);
    await this.createButton.click();
    await expect(this.row(title)).toBeVisible({ timeout: 10_000 });
  }

  async editTask(oldTitle: string, newTitle: string) {
    const r = this.row(oldTitle);
    await r.hover();
    await r.getByRole('button', { name: 'Editar' }).click();
    await expect(this.titleInput).toHaveValue(oldTitle);
    await this.titleInput.fill(newTitle);
    await this.saveButton.click();
    await expect(this.row(newTitle)).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Clicks the toggle button on a task row and waits for the PATCH response
   * before returning (auto-waiting — no fixed delays).
   */
  async toggleTask(title: string) {
    const r = this.row(title);
    await Promise.all([
      this.page.waitForResponse(
        (res) => res.url().includes('/api/tasks/') && res.request().method() === 'PUT' && res.status() === 200,
      ),
      r.getByRole('button', { name: /marcar/i }).click(),
    ]);
  }

  /**
   * Hovers a row, clicks Eliminar, confirms the SweetAlert2 dialog,
   * and waits until the row disappears from the list.
   */
  async deleteTask(title: string) {
    const r = this.row(title);
    await r.hover();
    await r.getByRole('button', { name: 'Eliminar' }).click();

    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5_000 });
    await dialog.getByRole('button', { name: 'Sí, eliminar' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 5_000 });
    await expect(r).not.toBeVisible({ timeout: 10_000 });
  }

  /**
   * Hovers a row, clicks Eliminar, then cancels the SweetAlert2 dialog.
   * Asserts the task remains in the list.
   */
  async cancelDelete(title: string) {
    const r = this.row(title);
    await r.hover();
    await r.getByRole('button', { name: 'Eliminar' }).click();

    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5_000 });
    await dialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 3_000 });
    await expect(r).toBeVisible();
  }

  async logout() {
    await this.logoutButton.click();
    await this.page.waitForURL('**/login', { timeout: 10_000 });
  }
}

import { test, expect } from "@playwright/test";
import { STORAGE_KEYS } from "../../src/constants/storage-keys.js";

test("user creates a note and it persists reload", async ({ page }) => {
  await page.goto("/");

  await page.locator('[data-action="add-note"]').click();

  await expect(page.locator(".note-container-wrapper")).toHaveCount(1);

  await expect
    .poll(async () => {
      const rawNote = await page.evaluate(
        (key) => localStorage.getItem(key),
        STORAGE_KEYS.notes,
      );
      return rawNote ? JSON.parse(rawNote).length : 0;
    })
    .toBe(1);

  await page.reload();

  await expect(page.locator(".note-container-wrapper")).toHaveCount(1);
});

test("user deletes a note and it stays deleted after reload", async ({
  page,
}) => {
  await page.goto("/");

  await page.locator('[data-action="add-note"]').click();
  await expect(page.locator(".note-container-wrapper")).toHaveCount(1);

  await expect
    .poll(async () => {
      const rawNote = await page.evaluate(
        (key) => localStorage.getItem(key),
        STORAGE_KEYS.notes,
      );
      return rawNote ? JSON.parse(rawNote).length : 0;
    })
    .toBe(1);

  await page.locator(".menu-button").click();
  await page.locator(".confirm-delete-btn").click();

  await expect(page.locator(".empty-editor-state")).toBeVisible();
  await expect(page.locator(".note-container-wrapper")).toHaveCount(0);

  await expect
    .poll(async () => {
      const rawNote = await page.evaluate(
        (key) => localStorage.getItem(key),
        STORAGE_KEYS.notes,
      );
      return rawNote ? JSON.parse(rawNote).length : 0;
    })
    .toBe(0);

  await page.reload();

  await expect(page.locator(".empty-editor-state")).toBeVisible();
  await expect(page.locator(".note-container-wrapper")).toHaveCount(0);
});

test("user edits a note and it persists on page reload", async ({ page }) => {
  await page.goto("/");

  await page.locator('[data-action="add-note"]').click();
  await expect(page.locator(".note-container-wrapper")).toHaveCount(1);

  await expect
    .poll(async () => {
      const rawNote = await page.evaluate(
        (key) => localStorage.getItem(key),
        STORAGE_KEYS.notes,
      );
      return rawNote ? JSON.parse(rawNote).length : 0;
    })
    .toBe(1);

  await page.locator('[data-action="lock-button"]').click();
  await page.locator('[data-action="edit-button"]').click();

  await page.keyboard.insertText("edited content");

  await page.locator('[data-action="lock-button"]').click();

  await expect
    .poll(async () => {
      const rawNote = await page.evaluate(
        (key) => localStorage.getItem(key),
        STORAGE_KEYS.notes,
      );
      return JSON.parse(rawNote)[0]?.content ?? "";
    })
    .toBe("edited content");

  await page.reload();

  await expect(page.locator(".editable--content")).toHaveText("edited content");
});

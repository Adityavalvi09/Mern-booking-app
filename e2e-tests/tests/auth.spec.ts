import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/";

test('should allow the user to sign in', async ({ page }) => {
  // Navigate to the UI
  await page.goto(UI_URL);

  // Click on the "Sign In" link
  await page.getByRole("link", { name: "Sign In" }).click();

  // Check if the "Sign In" heading is visible
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // Fill in the email and password fields
  await page.locator("[name=email]").fill("4@4.com");
  await page.locator("[name=password]").fill("1234567890");

  // Click on the "Login" button
  await page.getByRole("button", { name: "Login" }).click();

  // Check if the "Sign in Successful !" message is visible
  await expect(page.getByText("Sign in Successful")).toBeVisible();
  // Check if "My Bookings", "My Hotels", and "Sign Out" links/buttons are visible
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("should allow user to register", async ({ page }) => {

  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;
 
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create Account Here !" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("Registration Successful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});



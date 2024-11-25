// tests/specs/user-registration.spec.ts
import { test, expect } from '@playwright/test';
import { APIUtils } from '../utils/api';

const getTestUser = () => ({
 username: `testuser_${Date.now()}`,
 email: `test_${Date.now()}@example.com`,
 password: 'TestUser123'
});

test.describe('User Registration Flow', () => {
 test('complete registration flow with API verification', async ({ page }) => {
   // Enable request/response logging
   page.on('request', request => {
     if (request.url().includes('/api/users')) {
       console.log('Request Method:', request.method());
       console.log('Request URL:', request.url());
       console.log('Request Headers:', request.headers());
       console.log('Request Body:', request.postData());
     }
   });
   
   page.on('response', response => {
     if (response.url().includes('/api/users')) {
       console.log(`Response Status: ${response.status()}`);
       response.text().then(body => console.log('Response Body:', body));
     }
   });

   // 1. Visit login screen
   await page.goto('/');

   // 2. Switch to registration
   await page.click('button:has-text("Sign Up")');

   const testUser = getTestUser();

   // 3. Fill form
   await page.fill('input[placeholder="Username"]', testUser.username);
   await page.fill('input[placeholder="Email"]', testUser.email);
   await page.fill('input[placeholder="Password"]', testUser.password);

   // 4. Wait for button to be enabled
   await page.waitForSelector('button[type="submit"]:not([disabled])');

   // 5. Click submit and wait for response
   const [response] = await Promise.all([
     page.waitForResponse(res => res.url().includes('/api/users')),
     page.click('button[type="submit"]')
   ]);

   const responseStatus = response.status();
   const responseText = await response.text();
   console.log(`Final Response Status: ${responseStatus}`);
   console.log(`Final Response Body: ${responseText}`);

   // If we got a 403, fail with helpful message
   if (responseStatus === 403) {
     throw new Error(`
       API returned 403 Forbidden. This might mean:
       1. CORS is not configured correctly
       2. Security configuration is blocking the request
       3. Request headers or format don't match the expected format
       
       Actual response: ${responseText}
     `);
   }

   // 6. Check if we're back at login
   await expect(page.locator('h2')).toHaveText('Login', { timeout: 10000 });

   // 7. Login with new account
   await page.fill('input[placeholder="Username"]', testUser.username);
   await page.fill('input[placeholder="Password"]', testUser.password);
   await page.click('button[type="submit"]');

   // 8. Verify redirect to dashboard
   await page.waitForURL('/dashboard');
 });

 test('shows validation errors for invalid input', async ({ page }) => {
   await page.goto('/');
   await page.click('button:has-text("Sign Up")');

   // Try submitting with invalid data
   await page.fill('input[placeholder="Username"]', 'a');
   await page.fill('input[placeholder="Email"]', 'invalid-email');
   await page.fill('input[placeholder="Password"]', 'short');

   // Verify validation errors appear
   await expect(page.locator('text=Username must be at least 3 characters')).toBeVisible();
   await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
   await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
 });
});
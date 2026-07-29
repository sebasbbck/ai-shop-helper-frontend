import { test, expect } from '@playwright/test';

 
test('should login in the app', async ({ page }) => {


  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000/')
  //Fills the login details

  //Verifies the values of "email"
  await page.getByRole('textbox', { name: 'email' }).fill('malikquiros@hotmail.com');

  const locator1 = page.locator('input[type=email]');
  await expect(locator1).toHaveValue('malikquiros@hotmail.com');

  //Verifies the values of "password"
  await page.getByRole('textbox', { name: 'password' }).fill('12345678');

  const locator2 = page.locator('input[type=password]');
  await expect(locator2).toHaveValue('12345678');
  
  //Presses "Enter" in order to send the data
  await page.getByRole('textbox', { name: 'password' }).press('Enter');
  
  //Checks if the new page should contain an h4 with "Code_Eater_Productions"
  await expect(page.locator('h4')).toContainText('Code_Eater_Productions')
  
})

/*
import { test, expect } from '@playwright/test'
 
test('should navigate to the about page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000/')
  // Find an element with the text 'About' and click on it
  await page.click('text=About')
  // The new URL should be "/about" (baseURL is used there)
  await expect(page).toHaveURL('http://localhost:3000/about')
  // The new page should contain an h1 with "About"
  await expect(page.locator('h1')).toContainText('About')


  const locator3 = page.locator('button[type=submit]');

   
  await page.getByRole('button', { name: 'submit' }).click({
  button: 'right',
  force: true,
});

})









test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});







// Fill the form
await page.fill("#firstName", "John");
await page.fill("#lastName", "Doe");
await page.fill("#email", "john.doe@example.com");

// Validate the form inputs
let firstName = await page.inputValue("#firstName");
let lastName = await page.inputValue("#lastName");
let email = await page.inputValue("#email");

if (!firstName || !lastName || !email.includes("@")) {
  console.log("Form validation failed");
  return;
}

// If validation passes, submit the form
await page.click("#submitButton");



// Submit form
await page.click('input[type="submit"]');

// Wait for navigation after submit
await page.waitForNavigation();

// Check if success message is displayed
const success = await page.$(".success-message");

if (success) {
  console.log("Form submitted successfully!");

  // Can also extract data from success page
  const result = await page.textContent(".result");
  console.log("Result:", result);
}






try {
  await page.click('input[type="submit"]');
} catch (error) {
  // Check for error message
  const errorMessage = await page.$(".error-message");

  if (errorMessage) {
    console.error("Form submission failed!");
    console.error(await errorMessage.textContent());
  }
}



await page.evaluate(() => {
  document.myForm.submit();
});





*/
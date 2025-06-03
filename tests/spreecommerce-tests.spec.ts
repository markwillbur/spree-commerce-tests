import { test, expect } from '@playwright/test';
import { writeFileSync, readFileSync } from 'fs';

const currentDate = new Date();
const newUser = `user+${Date.now()}@email.com`;
const password = 'password123'
const oneYearLater = new Date(currentDate.getFullYear() + 1, currentDate.getMonth()); // Get the next month year of current date for expiration date
const expirationDate = `${String(oneYearLater.getMonth() + 1).padStart(2, '0')}${String(oneYearLater.getFullYear()).slice(-2)}`; // Format date to MM/YY for expiration date

test.setTimeout(60000);

test('Sign up', async ({ page }) => {

  await test.step('Sign up from landing page', async () => {

    await page.goto('https://demo.spreecommerce.org/');

    // Added a toPass() to reduce flakiness of clicking the user icon
    await expect(async () => {

      await page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2).click({ timeout: 3000 }); // User icon in header

      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible(); // Assert that login header in sidebar is visible

    }).toPass();

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible(); // Assert that login header in sidebar is visible

    await page.getByRole('link', { name: 'Sign Up' }).click();

    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible(); // Assert that Sign Up header in sidebar is visible

    // Fill in sign up details

    await page.getByRole('textbox', { name: 'Email', exact: true }).fill(newUser);

    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);

    await page.getByRole('textbox', { name: 'Password Confirmation' }).fill(password);

    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(page.getByText('Welcome! You have signed up successfully.')).toBeVisible();

  });

  await test.step('Log out from accounts page', async () => {

    await page.getByRole('link', { name: 'My Account' }).click();

    await expect(page).toHaveURL('https://demo.spreecommerce.org/account/orders'); // When the user is redirected here, it means that they are signed in

    await page.getByRole('button', { name: 'Log out' }).click();

    await expect(page).toHaveURL('https://demo.spreecommerce.org');

    await expect(page.getByText('Signed Out Successfully.')).toBeVisible({ timeout: 10000 }); // Assert that Signed Out banner is visible

  });

  await test.step('Check if user is logged out and store creds in json', async () => {

    await page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2).click(); // User icon in header

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    const credentials = { newUser, password };
    writeFileSync('credentials.json', JSON.stringify(credentials, null, 2)); // Store creds in a json file for reusability

  });

});

test('Sign in and order', async ({ page }) => {

  const data = JSON.parse(readFileSync('credentials.json', 'utf-8')); // Read data from credentials.json
  const { newUser, password } = data;

  await test.step('Login from landing page', async () => {

    await page.goto('https://demo.spreecommerce.org/');

    // Added a toPass() to reduce flakiness of clicking the user icon
    await expect(async () => {

      await page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2).click({ timeout: 3000 }); // User icon in header

      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible(); // Assert that login header in sidebar is visible

    }).toPass();

    await page.getByRole('textbox', { name: 'Email', exact: true }).fill(newUser);

    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Signed In Successfully')).toBeVisible(); // Assert that login banner is visible

  });

  await test.step('Go to products page and select ripped t-shirt product', async () => {

    await page.getByRole('link', { name: 'Shop All' }).first().click();

    await expect(async () => {

      await page.getByRole('link', { name: 'Sale Ripped T-Shirt $55.99 $40.00' }).click({ timeout: 500 });

      // Assertions to check if the correct producted is selected

      await expect(page).toHaveURL('https://demo.spreecommerce.org/products/ripped-t-shirt');

    }).toPass();

    await expect(page.getByRole('heading', { name: 'Ripped T-Shirt' })).toBeVisible();

    await expect(page.getByRole('paragraph').filter({ hasText: '$40.00' })).toBeVisible();

    await expect(page.getByText('COLOR: GREY')).toBeVisible();

  });

  await test.step('Choose size M and add product to cart', async () => {

    await expect(async () => {

      await page.getByRole('button', { name: 'Please choose Size' }).click({ timeout: 500 });

      await page.locator('#product-variant-picker label').filter({ hasText: 'M' }).click({ timeout: 500 });

      await expect(page.getByRole('button', { name: 'Size: M' })).toBeVisible();

    }).toPass();

    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Assertions if the product is successfully added to the cart

    await expect(page.getByRole('link', { name: 'Ripped T-Shirt', exact: true })).toBeVisible();

    await expect(page.getByText('Total $40.00')).toBeVisible();

    await expect(page.getByText('Promotion -$10.00')).toBeVisible();

  });


  await test.step('Go to checkout and add new address (if there is no existing)', async () => {

    await page.getByRole('link', { name: 'Checkout', exact: true }).click();

    await expect(page.getByText('Total USD $30.00')).toBeVisible();

    await expect(page.getByText('1 Ripped T-Shirt Color: Grey, Size: M')).toBeVisible();

    // If there is an already an existing address, no need to create a new one
    if (await page.getByRole('radio', { name: 'New address' }).isVisible()) {

      await expect(page.getByText(`Account TEST USER FIRST TEST USER LAST`)).toBeVisible();

      await page.getByRole('button', { name: 'Save and Continue' }).click();

    }

    else {

      await expect(page.getByText(`Account ${newUser}`)).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Shipping Address' })).toBeVisible();

      await page.getByLabel('Country', { exact: true }).selectOption('Philippines');

      await page.getByRole('textbox', { name: 'First Name' }).fill('TEST USER FIRST');

      await page.getByRole('textbox', { name: 'Last Name' }).fill('TEST USER LAST');

      await page.getByRole('textbox', { name: 'Street and house number' }).fill('TEST STREET');

      await page.getByRole('textbox', { name: 'City' }).fill('TEST CITY');

      await page.getByRole('textbox', { name: 'Postal Code' }).fill('1234');

      await page.getByRole('button', { name: 'Save and Continue' }).click();

    }

    await expect(page).toHaveURL(/\/checkout\/.*\/delivery/, { timeout: 10000 });

  });

  await test.step('Assert delivery options', async () => {

    // Assert Standard shipping shows $5.00
    await expect(page.getByText('Standard').locator('..')).toContainText('$5.00');

    // Assert Premium shipping shows $10.00
    await expect(page.getByText('Premium').locator('..')).toContainText('$10.00');

    // Assert Next Day shipping shows $15.00
    await expect(page.getByText('Next Day').locator('..')).toContainText('$15.00');

    await page.getByRole('button', { name: 'Save and Continue' }).click();

  })

  await test.step('Enter payment details and pay', async () => {

    await expect(page).toHaveURL(/\/checkout\/.*\/payment/, { timeout: 10000 });

    await expect(page.getByText(`Account TEST USER FIRST TEST USER LAST ${newUser}`)).toBeVisible();

    await expect(page.getByText('TEST USER FIRST TEST USER LAST, TEST STREET, TEST CITY, 1234, Philippines')).toBeVisible();

    await expect(page.getByText('Standard · $5.00')).toBeVisible();

    if (await page.getByRole('radio', { name: 'Add a new card' }).isHidden()) {

      const paymentiframe = page.frameLocator('iframe[title="Secure payment input frame"]'); // iFrame of the payment section

      await paymentiframe.getByRole('textbox', { name: 'Card number' }).fill('4242 4242 4242 4242');

      await paymentiframe.getByRole('textbox', { name: 'Expiration date' }).fill(expirationDate);

      await paymentiframe.getByRole('textbox', { name: 'Security Code' }).fill('123');

    }

    await expect(async () => {

      await expect(page.getByRole('button', { name: 'Pay Now' })).toBeEnabled();

      await page.getByRole('button', { name: 'Pay Now' }).click({ timeout: 3000 });

      await expect(page).toHaveURL(/\/checkout\/.*\/complete/, { timeout: 10000 });

    }).toPass();

  })

  await test.step('Assert success page', async () => {

    await expect(page.getByText('Thanks TEST USER FIRST for your order!')).toBeVisible();

    await expect(page.getByText('Your order is confirmed!')).toBeVisible();

    await expect(page.getByText(newUser)).toBeVisible();

    await expect(page.getByText('Expiration 6/2026')).toBeVisible();

  })

});


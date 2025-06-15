// tests/spreecommerce.spec.ts
import { test, expect } from '@playwright/test';
import { writeFileSync, readFileSync } from 'fs';
import * as path from 'path';

import { HomePage } from '../pages/homeAndAuthPage';
import { AccountPage } from '../pages/accountPage';
import { ProductsPage } from '../pages/productsPage';
import { CheckoutPage } from '../pages/checkoutPage';

// Get current date for user email and expiration date
const currentDate = new Date();
const newUserEmail = `user+${Date.now()}@email.com`;
const oneYearLater = new Date(currentDate.getFullYear() + 1, currentDate.getMonth());
const expirationDateFormatted = `${String(oneYearLater.getMonth() + 1).padStart(2, '0')}${String(oneYearLater.getFullYear()).slice(-2)}`;
const expirationDateAssertFormat = `${String(oneYearLater.getMonth() + 1)}/${String(oneYearLater.getFullYear())}`;

// Read test data from JSON file
const testDataPath = path.resolve(__dirname, '../testData.json');
const testData = JSON.parse(readFileSync(testDataPath, 'utf-8'));
const { user, product, payment } = testData;

test.setTimeout(60000);

test.describe('Spree Commerce User Flows', () => {
    let homePage: HomePage;
    let accountPage: AccountPage;
    let productsPage: ProductsPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        accountPage = new AccountPage(page);
        productsPage = new ProductsPage(page);
        checkoutPage = new CheckoutPage(page);
    });

    test('Sign up and Logout', async ({ page }) => {
        await test.step('Sign up from landing page', async () => {

            await homePage.goto();

            await homePage.clickUserIcon();

            await homePage.assertLoginHeaderVisible();

            await homePage.clickSignUpLink();

            await homePage.assertSignUpHeaderVisible();

            await homePage.fillSignUpForm(newUserEmail, user.password);

            await homePage.clickSignUpButton();

            await homePage.assertWelcomeMessageVisible();

        });

        await test.step('Log out from accounts page', async () => {

            await accountPage.clickMyAccountLink();

            await accountPage.assertOnOrdersPage();

            await accountPage.clickLogoutButton();

            await accountPage.assertOnHomePage();

            await accountPage.assertSignedOutSuccessfullyMessageVisible();

        });

        await test.step('Check if user is logged out and store creds in json', async () => {

            await homePage.clickUserIcon();

            await homePage.assertLoginHeaderVisible();


            const credentials = { newUserEmail, password: user.password };

            writeFileSync('credentials.json', JSON.stringify(credentials, null, 2)); // Store creds in a json file for reusability
        });
    });

    test('Sign in and Order Product', async ({ page }) => {

        const credentials = JSON.parse(readFileSync('credentials.json', 'utf-8'));
        const { newUserEmail: storedUserEmail, password: storedPassword } = credentials;

        await test.step('Login from landing page', async () => {

            await homePage.goto();

            await homePage.clickUserIcon();

            await homePage.assertLoginHeaderVisible();

            await homePage.fillLoginForm(storedUserEmail, storedPassword);

            await homePage.clickLoginButton();

            await homePage.assertSignedInSuccessfullyMessageVisible();

        });

        await test.step('Go to products page and select product', async () => {

            await productsPage.clickShopAll();

            await productsPage.selectProduct(product.name, product.url);

            await productsPage.assertProductDetailsVisible(product.name, product.price, product.color);

        });

        await test.step('Choose size and add product to cart', async () => {

            await productsPage.chooseProductSize(product.size);

            await productsPage.addProductToCart();

            await productsPage.assertProductAddedToCart(product.name, product.price, product.promotion);

        });

        await test.step('Go to checkout and add new address (if there is no existing)', async () => {

            await checkoutPage.clickCheckoutLink();

            await checkoutPage.assertOrderSummaryVisible(product.checkoutTotal, product.name, product.color, product.size, product.quantity);

            await checkoutPage.handleShippingAddress(
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: storedUserEmail,
                    street: user.street,
                    city: user.city,
                    postalCode: user.postalCode
                },
                user.country
            );

        });

        await test.step('Assert delivery options', async () => {

            await checkoutPage.assertDeliveryOptions();

        });

        await test.step('Enter payment details and pay', async () => {
            
            await checkoutPage.enterPaymentDetails(

                payment.cardNumber,
                expirationDateFormatted,
                payment.securityCode,
                { firstName: user.firstName, lastName: user.lastName, email: storedUserEmail }

            );

        });

        await test.step('Assert success page', async () => {
            
            await checkoutPage.assertSuccessPage(
                { firstName: user.firstName, email: storedUserEmail },
                expirationDateAssertFormat
            );
        });
    });
});
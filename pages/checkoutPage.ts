// pages/checkoutPage.ts
import { Page, Locator, FrameLocator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly checkoutLink: Locator;
    readonly productInCart: Locator;
    readonly newAddressRadio: Locator;
    readonly saveAndContinueButton: Locator;
    readonly shippingAddressHeading: Locator;
    readonly countryDropdown: Locator;
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly streetTextbox: Locator;
    readonly cityTextbox: Locator;
    readonly postalCodeTextbox: Locator;
    readonly standardShippingOption: Locator;
    readonly premiumShippingOption: Locator;
    readonly nextDayShippingOption: Locator;
    readonly addNewCardRadio: Locator;
    readonly paymentIframe: FrameLocator;
    readonly cardNumberTextbox: Locator;
    readonly expirationDateTextbox: Locator;
    readonly securityCodeTextbox: Locator;
    readonly payNowButton: Locator;

    // Dynamic locators as methods (since they depend on input values)
    accountName(name: string): Locator {

        return this.page.getByText(`Account ${name}`);
    }

    totalUsd(amount: string): Locator {

        return this.page.getByText(`Total USD ${amount}`);
    }

    accountAndShippingInfo(name: string, email: string): Locator {

        return this.page.getByText(`Account ${name} ${email}`);
    }

    thanksMessage(name: string): Locator {

        return this.page.getByText(`Thanks ${name} for your order!`);
    }

    userEmail(email: string): Locator {

        return this.page.getByText(email);
    }

    expirationDateText(date: string): Locator {

        return this.page.getByText(`Expiration ${date}`);
    }

    productInCartSummary(quantity: string, productName: string, color: string, size: string): Locator {

        return this.page.getByText(`${quantity} ${productName} Color: ${color}, Size: ${size}`);

    }


    constructor(page: Page) {
        this.page = page;
        this.checkoutLink = page.getByRole('link', { name: 'Checkout', exact: true });
        this.newAddressRadio = page.getByRole('radio', { name: 'New address' });
        this.saveAndContinueButton = page.getByRole('button', { name: 'Save and Continue' });
        this.shippingAddressHeading = page.getByRole('heading', { name: 'Shipping Address' });
        this.countryDropdown = page.getByLabel('Country', { exact: true });
        this.firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
        this.streetTextbox = page.getByRole('textbox', { name: 'Street and house number' });
        this.cityTextbox = page.getByRole('textbox', { name: 'City' });
        this.postalCodeTextbox = page.getByRole('textbox', { name: 'Postal Code' });
        this.standardShippingOption = page.getByText('Standard').locator('..');
        this.premiumShippingOption = page.getByText('Premium').locator('..');
        this.nextDayShippingOption = page.getByText('Next Day').locator('..');
        this.addNewCardRadio = page.getByRole('radio', { name: 'Add a new card' });
        this.paymentIframe = page.frameLocator('iframe[title="Secure payment input frame"]');
        this.cardNumberTextbox = this.paymentIframe.getByRole('textbox', { name: 'Card number' });
        this.expirationDateTextbox = this.paymentIframe.getByRole('textbox', { name: 'Expiration date' });
        this.securityCodeTextbox = this.paymentIframe.getByRole('textbox', { name: 'Security Code' });
        this.payNowButton = page.getByRole('button', { name: 'Pay Now' });
    }

    async clickCheckoutLink() {

        await this.checkoutLink.click();

    }

    // Updated to take dynamic total and product details
    async assertOrderSummaryVisible(checkoutTotal: string, productName: string, productColor: string, productSize: string, productQuantity: string) {
        
        await expect(this.totalUsd(checkoutTotal)).toBeVisible();

        await expect(this.productInCartSummary(productQuantity, productName, productColor, productSize)).toBeVisible();

    }

    async handleShippingAddress(userData: { firstName: string, lastName: string, email: string, street: string, city: string, postalCode: string }, country: string) {

        await expect(this.page).toHaveURL(/\/checkout/, { timeout: 10000 });
        
        await this.page.waitForURL(/\/checkout/);
        
        if (await this.newAddressRadio.isVisible()) {

            await expect(this.accountName(`${userData.firstName} ${userData.lastName}`)).toBeVisible();

            await this.saveAndContinueButton.click();

        } else {

            await expect(this.accountName(userData.email)).toBeVisible();

            await expect(this.shippingAddressHeading).toBeVisible();

            await this.countryDropdown.selectOption(country);

            await this.firstNameTextbox.fill(userData.firstName);

            await this.lastNameTextbox.fill(userData.lastName);

            await this.streetTextbox.fill(userData.street);
            
            await this.cityTextbox.fill(userData.city);

            await this.postalCodeTextbox.fill(userData.postalCode);

            await this.saveAndContinueButton.click();

        }
    }

    async assertDeliveryOptions() {

        await expect(this.standardShippingOption).toContainText('$5.00');

        await expect(this.premiumShippingOption).toContainText('$10.00');

        await expect(this.nextDayShippingOption).toContainText('$15.00');

        await this.saveAndContinueButton.click();
    }

    async enterPaymentDetails(cardNumber: string, expirationDate: string, securityCode: string, userData: { firstName: string, lastName: string, email: string }) {
        
        await expect(this.page).toHaveURL(/\/checkout\/.*\/payment/, { timeout: 10000 });

        await expect(this.accountAndShippingInfo(`${userData.firstName} ${userData.lastName}`, userData.email)).toBeVisible();

        if (await this.addNewCardRadio.isHidden()) {

            await this.cardNumberTextbox.fill(cardNumber);

            await this.expirationDateTextbox.fill(expirationDate);

            await this.securityCodeTextbox.fill(securityCode);

        }

        await expect(async () => {

            await expect(this.payNowButton).toBeEnabled();

            await this.payNowButton.click({ timeout: 3000 });

            await expect(this.page).toHaveURL(/\/checkout\/.*\/complete/, { timeout: 10000 });

        }).toPass();
    }

    async assertSuccessPage(userData: { firstName: string, email: string }, expirationDate: string) {

        await expect(this.thanksMessage(userData.firstName)).toBeVisible();

        await expect(this.page.getByText('Your order is confirmed!')).toBeVisible();

        await expect(this.userEmail(userData.email)).toBeVisible();

        await expect(this.expirationDateText(expirationDate)).toBeVisible();
    }
}
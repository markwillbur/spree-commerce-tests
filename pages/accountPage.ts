import { Page, Locator, expect } from '@playwright/test';

export class AccountPage {
    readonly page: Page;
    readonly myAccountLink: Locator;
    readonly logoutButton: Locator;
    readonly signedOutSuccessfullyMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.myAccountLink = page.getByRole('link', { name: 'My Account' });
        this.logoutButton = page.getByRole('button', { name: 'Log out' });
        this.signedOutSuccessfullyMessage = page.getByText('Signed Out Successfully.');
    }

    async clickMyAccountLink() {

        await this.myAccountLink.click();

    }

    async assertOnOrdersPage() {

        await expect(this.page).toHaveURL('https://demo.spreecommerce.org/account/orders');

    }

    async clickLogoutButton() {

        await this.logoutButton.click();

    }

    async assertSignedOutSuccessfullyMessageVisible() {

        await expect(this.signedOutSuccessfullyMessage).toBeVisible({ timeout: 10000 });

    }

    async assertOnHomePage() {

        await expect(this.page).toHaveURL('https://demo.spreecommerce.org');
    
    }
}
import { Page, expect, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly userIcon: Locator;
    readonly loginHeader: Locator;
    readonly signUpLink: Locator;
    readonly signUpHeader: Locator;
    readonly emailTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly passwordConfirmationTextbox: Locator;
    readonly signUpButton: Locator;
    readonly loginButton: Locator;
    readonly welcomeMessage: Locator;
    readonly signedInSuccessfullyMessage: Locator;


    constructor(page: Page) {
        this.page = page;
        this.userIcon = page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2);
        this.loginHeader = page.getByRole('heading', { name: 'Login' });
        this.signUpLink = page.getByRole('link', { name: 'Sign Up' });
        this.signUpHeader = page.getByRole('heading', { name: 'Sign Up' });
        this.emailTextbox = page.getByRole('textbox', { name: 'Email', exact: true });
        this.passwordTextbox = page.getByRole('textbox', { name: 'Password', exact: true });
        this.passwordConfirmationTextbox = page.getByRole('textbox', { name: 'Password Confirmation' });
        this.signUpButton = page.getByRole('button', { name: 'Sign Up' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.welcomeMessage = page.getByText('Welcome! You have signed up successfully.');
        this.signedInSuccessfullyMessage = page.getByText('Signed In Successfully');
    }

   
    async goto() {

        await this.page.goto('https://demo.spreecommerce.org/');

    }

    async clickUserIcon() {
        await expect(async () => {

            await this.userIcon.click({ timeout: 3000 });

            await expect(this.loginHeader).toBeVisible();

        }).toPass();
    }

    async clickSignUpLink() {

        await this.signUpLink.click();

    }

    async assertLoginHeaderVisible() {

        await expect(this.loginHeader).toBeVisible();

    }

        async assertSignUpHeaderVisible() {

        await expect(this.signUpHeader).toBeVisible();
        
    }
    async fillSignUpForm(email: string, password: string) {
        
        await this.emailTextbox.fill(email);
        await this.passwordTextbox.fill(password);
        await this.passwordConfirmationTextbox.fill(password);
    }

    async clickSignUpButton() {

        await this.signUpButton.click();

    }

    async assertWelcomeMessageVisible() {

        await expect(this.welcomeMessage).toBeVisible();

    }

    async fillLoginForm(email: string, password: string) {

        await this.emailTextbox.fill(email);

        await this.passwordTextbox.fill(password);

    }

    async clickLoginButton() {

        await this.loginButton.click();

    }

    async assertSignedInSuccessfullyMessageVisible() {

        await expect(this.signedInSuccessfullyMessage).toBeVisible();
        
    }
}
// Product Page
import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    readonly shopAllLink: Locator;
    readonly chooseSizeButton: Locator;
    readonly addToCartButton: Locator;

    // Locator functions for dynamic elements
    productLink(productName: string): Locator {

        return this.page.getByRole('link', { name: productName });

    }

    productHeading(productName: string): Locator {

        return this.page.getByRole('heading', { name: productName });

    }

    productPriceDisplay(expectedPrice: string): Locator {

        return this.page.getByRole('paragraph').filter({ hasText: expectedPrice });

    }

    productColorDisplay(color: string): Locator {

        return this.page.getByText(`COLOR: ${color.toUpperCase()}`);

    }

    sizeOption(size: string): Locator {

        return this.page.locator('#product-variant-picker label').filter({ hasText: size });

    }

    selectedSizeButton(size: string): Locator {

        return this.page.getByRole('button', { name: `Size: ${size}` });

    }

    cartProductLink(productName: string): Locator {

        return this.page.getByRole('link', { name: productName, exact: true });

    }

    cartTotalDisplay(expectedTotal: string): Locator {

        return this.page.getByText(`Total ${expectedTotal}`);

    }

    cartPromotionDisplay(expectedPromotion: string): Locator {

        return this.page.getByText(`Promotion ${expectedPromotion}`);

    }


    constructor(page: Page) {
        this.page = page;
        this.shopAllLink = page.getByRole('link', { name: 'Shop All' }).first();
        this.chooseSizeButton = page.getByRole('button', { name: 'Please choose Size' }).first();
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    }

    async clickShopAll() {

        await this.shopAllLink.click();

    }

    async selectProduct(productName: string, productURL: string) {

        await expect(async () => {

            await this.productLink(productName).click({ timeout: 1000 });

            await expect(this.page).toHaveURL(new RegExp(`products/${productURL}`));

        }).toPass();
    }

    async assertProductDetailsVisible(productName: string, productPrice: string, color?: string) {

        await expect(this.productHeading(productName)).toBeVisible();

        await expect(this.productPriceDisplay(productPrice)).toBeVisible();

        if (color) {

            await expect(this.productColorDisplay(color)).toBeVisible();

        }
    }

    async chooseProductSize(size: string) {

        await expect(async () => {

            await this.chooseSizeButton.click({ timeout: 1500 });

            await this.sizeOption(size).click({ timeout: 1500 });

            await expect(this.selectedSizeButton(size)).toBeVisible();

        }).toPass();
    }

    async addProductToCart() {

        await this.addToCartButton.click();

    }

    async assertProductAddedToCart(productName: string, expectedTotal: string, expectedPromotion?: string) {

        await expect(this.cartProductLink(productName)).toBeVisible();

        await expect(this.cartTotalDisplay(expectedTotal)).toBeVisible();

        if (expectedPromotion) {

            await expect(this.cartPromotionDisplay(expectedPromotion)).toBeVisible();
            
        }
    }
}
# 🛍️ Spree Commerce Playwright Tests

This repo contains automated tests for the [Spree Commerce Demo Store](https://demo.spreecommerce.org/) using [Playwright](https://playwright.dev/).

The goal was to write end-to-end UI tests based on a QE code challenge. The tests simulate a user shopping on the site, from signing up to completing a full purchase with payment.

---

## ✅ What's Included

There is two test files for the full end to end test in this project:

**Full E2E Test (Hardcoded)** (spreecommerce-tests.spec.ts)
   - Creates a new user account using random credentials.
   - Saves the credentials for later use in the next test.
   - Logs in with the user created during sign-up.
   - Adds a product to the cart.
   - Verifies product details (name, size, price).
   - Proceeds through checkout:
     - Fills in a shipping address (if user is new)
     - Selects a delivery option
     - Enters test credit card info (if user has not setup via Stripe)
     - Submits the order
   - Verifies that the order confirmation page is shown with a success message.

**Full E2E Test (Using POM & Externalized Data)** (spreeCommerceTestsPOM.spec.ts)
- Implemented with Page Object Model (POM): Locators and interactions are encapsulated within dedicated page classes for better organization and maintainability.
- Data Externalization: Test data, including user details, payment information, and dynamic product details (name, price, size, color, URL slug, cart/checkout totals), are read from test-data.json. This allows for easy modification of test scenarios without changing test code.
  - Creates a new user account using random credentials.
  - Saves the credentials for later use in the next test.
  - Logs in with the user created during sign-up.
  - Adds a product to the cart using dynamic product information from testData.json.
  - Verifies product details (name, size, price) based on the externalized data
  - Proceeds through checkout:
    - Fills in a shipping address (if user is new)
    - Selects a delivery option
    - Enters test credit card info (if user has not setup via Stripe)
    - Submits the order
    - Verifies that the order confirmation page is shown with a success message.

- Each important step (navigation, URL, UI text, etc.) has assertions to make sure things are working as expected.



---

## 📂 Pages Folder Structure
The pages directory contains Page Object Model (POM) classes, each representing a distinct page or a significant section of the application. These classes encapsulate the locators and methods specific to that page, promoting code reusability and maintainability.

- pages/homeAndAuthPage.ts:
  - Manages interactions on the Spree Commerce landing page.
  - Includes locators for the user icon, login sidebar header, and the "Sign Up" link.
  - Provides methods to navigate to the home page, click UI elements, and assert visibility.
  - Handles elements and actions related to both the login and sign-up forms in the sidebar.
  - Contains locators for email, password fields, and "Sign Up" / "Login" buttons
  - Offers methods to fill forms, click buttons, and assert success messages.
  
- pages/accountPage.ts:
  - Manages elements and actions on the user's account-related pages (e.g., orders, profile).
  - Includes locators for the "My Account" link and the "Log out" button.
  - Provides methods to navigate within account pages, log out, and assert logout success.

- pages/productsPage.ts:
  - Encapsulates elements and actions for Browse and selecting products.
  - Includes locators for the "Shop All" link, product links (dynamic), product details (name, price, color), size selection, and "Add to Cart" button.
  - Offers methods to select products, choose sizes, add to cart, and assert product details.

- pages/checkoutPage.ts:
  - Manages the entire checkout process, from cart review to payment completion
  - Includes locators for checkout links, order summary details, shipping address fields, delivery options, payment input fields (within an iframe), and the "Pay Now" button.
  - Provides methods to navigate checkout steps, handle address entry, select delivery, enter payment details, and assert order confirmation.
---

## 🧰 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/markwillbur/spree-commerce-tests.git
cd spree-commerce-tests
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

## ▶️ How to Run the Tests


Run all tests:
```bash
npx playwright test 
```

Run hardcoded E2E test only: 
```bash
npx playwright test test/spreecommerce-tests.spec.ts
```

Run POM E2E test only: 
```bash 
npx playwright test test/spreeCommerceTestsPOM.spec.ts
```

### Show report after running

```bash
npx playwright show-report
```

## 🔄 CI/CD Integration
This project includes a CI/CD pipeline configured to automatically run the Playwright tests on every push or pull request to the repository.

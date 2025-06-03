# 🛍️ Spree Commerce Playwright Tests

This repo contains automated tests for the [Spree Commerce Demo Store](https://demo.spreecommerce.org/) using [Playwright](https://playwright.dev/).

The goal was to write end-to-end UI tests based on a QE code challenge. The tests simulate a user shopping on the site, from signing up to completing a full purchase with payment.

---

## ✅ What's Included

There is one test file for the full end to end test in this project:

**Full E2E Test** (spreecommerce-tests.spec.ts)
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

Each important step (navigation, URL, UI text, etc.) has assertions to make sure things are working as expected.

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

```bash
npx playwright test
```

### Show report after running

```bash
npx playwright show-report
```

## 🔄 CI/CD Integration
This project includes a CI/CD pipeline configured to automatically run the Playwright tests on every push or pull request to the repository.


# 🎓 Codemi E2E & API Automation Testing Framework

![Playwright Tests](https://github.com/sesworks/codemi-automation-testing/actions/workflows/playwright.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-v1.40+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)
![Zod](https://img.shields.io/badge/Zod-Schema%20Validation-3E67B1.svg)

Production-grade automated Web & REST API testing suite for **[Codemi](https://codemi.co.id/)** LMS platform using **Playwright**, **TypeScript**, **Zod**, and the **Page Object Model (POM)** pattern.

---

## 🎯 Test Scenarios Covered

### 🌐 Web E2E Testing (`tests/codemi-web.spec.ts`)
* **TC01 - Landing Page & Security**: Verifies HTTP 200 OK status, branding assets, page title, and footer visibility.
* **TC02 - Navigation & Broken Link Audit**: Dynamically audits all active navigation links across headers.
* **TC03 - Contact & Demo Form Validation**: Validates user inputs, data entry handlers, and CTA button states.
* **TC04 - Mobile Viewport Emulation**: Simulates mobile screen resolutions (390x844) to verify zero horizontal layout overflow.

### ⚡ REST API Testing (`tests/codemi-api.spec.ts`)
* **API-TC01 - Schema Contract Validation**: Validates response structure, types, and array payloads using **Zod**.
* **API-TC02 - POST Resource Creation**: Simulates course enrollment submissions and asserts `201 Created` status with unique resource IDs.
* **API-TC03 - Error Handling & Negative Testing**: Verifies appropriate client error handling (`404 Not Found`) on non-existent endpoints.

---

## 📁 Project Structure

```text
codemi-automation-testing/
├── .github/workflows/
│   └── playwright.yml         # GitHub Actions CI/CD pipeline
├── pages/
│   ├── CodemiHomePage.ts      # Page Object: Landing page interactions
│   └── ContactDemoPage.ts     # Page Object: Demo form interactions
├── tests/
│   ├── codemi-web.spec.ts     # E2E Web Test Scenarios
│   └── codemi-api.spec.ts     # REST API Test Scenarios
├── playwright.config.ts       # Runner configuration
├── package.json
└── README.md
```


## 🚀 Getting Started
```text
Prerequisites
Node.js (v18 or higher)
npm
```

Installation
```text
Bash
git clone [https://github.com/sesworks/codemi-automation-testing.git](https://github.com/sesworks/codemi-automation-testing.git)
cd codemi-automation-testing
npm install
npx playwright install --with-deps
```
Execution
```text
Bash
# Run all tests headlessly
npx playwright test

# Run UI tests with headed browser
npx playwright test codemi-web --headed

# Run API tests
npx playwright test codemi-api

# View interactive HTML report
npx playwright show-report
'@
```

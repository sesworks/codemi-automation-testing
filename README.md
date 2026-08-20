# 🎓 Codemi E2E, API & Database Automation Testing Framework

![Playwright Tests](https://github.com/sesworks/codemi-automation-testing/actions/workflows/playwright.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-v1.40+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)
![Zod](https://img.shields.io/badge/Zod-Schema%20Validation-3E67B1.svg)
![sql.js](https://img.shields.io/badge/sql.js-Wasm%20SQLite-003B57.svg)

Production-grade automated Web, REST API, and Backend Database testing suite for **[Codemi](https://codemi.co.id/)** LMS platform using **Playwright**, **TypeScript**, **Zod**, **sql.js**, and the **Page Object Model (POM)** pattern.

---

## 🎯 Test Scenarios Covered

### 🌐 Web E2E Testing (`tests/codemi-web.spec.ts`)
* **TC01 - Landing Page & Security**: Verifies HTTP 200 OK status, branding assets, page title, and footer visibility.
* **TC02 - Navigation & Broken Link Audit**: Dynamically audits all active navigation links across headers.
* **TC03 - Contact & Demo Form Validation**: Simulates slow-typing data entry across all 8 fields (inputs and dropdowns) without submitting.
* **TC04 - Mobile Viewport Emulation**: Simulates mobile screen resolutions (390x844) to verify zero horizontal layout overflow.

### ⚡ REST API Testing (`tests/codemi-api.spec.ts`)
* **API-TC01 - Schema Contract Validation**: Validates response structure, types, and array payloads using **Zod**.
* **API-TC02 - POST Resource Creation**: Simulates course enrollment submissions and asserts `201 Created` status with unique resource IDs.
* **API-TC03 - Error Handling & Negative Testing**: Verifies appropriate client error handling (`404 Not Found`) on non-existent endpoints.

### 🗄️ Database Integrity Testing (`tests/codemi-db.spec.ts`)
* **DB-TC01 - Auto-Certificate Generation**: Validates certificate creation in relational tables when quiz score $\ge$ passing grade (85 $\ge$ 80).
* **DB-TC02 - Failed Quiz Threshold**: Asserts zero certificates issued when quiz score $<$ passing grade (75 $<$ 80).
* **DB-TC03 - Data Integrity Audit**: Runs SQL audit queries across joined tables to guarantee zero illegal certificate issuances.

---

## 📁 Project Structure

```text
codemi-automation-testing/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI/CD pipeline (workflow_dispatch & artifacts)
├── pages/
│   ├── CodemiHomePage.ts          # Page Object: Landing page interactions
│   └── ContactDemoPage.ts         # Page Object: Demo form interactions (slow typing)
├── schemas/
│   └── postSchema.ts              # Zod Runtime Schema Validation for API Responses
├── tests/
│   ├── codemi-web.spec.ts         # E2E Web Test Scenarios (TC01 - TC04)
│   ├── codemi-api.spec.ts         # REST API Test Scenarios (API-TC01 - TC03)
│   └── codemi-db.spec.ts          # Backend SQL Test Scenarios (DB-TC01 - TC03)
├── utils/
│   └── db.ts                      # In-Memory Wasm SQLite Database Helper
├── playwright.config.ts           # Runner configuration & always-on video/trace recording
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
# Run all tests headlessly (10 Test Cases)
npx playwright test

# Run UI tests with headed browser
npx playwright test codemi-web --headed

# Run API tests
npx playwright test codemi-api

# Run Database SQL integrity tests
npx playwright test codemi-db

# View interactive HTML report
npx playwright show-report
```

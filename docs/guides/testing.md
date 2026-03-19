# Testing

End-to-end tests using Playwright with cross-browser support.

## Test Setup

### Configuration

`playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### Test Directory Structure

```
tests/
├── e2e/
│   ├── home.spec.ts
│   ├── events.spec.ts
│   └── contact.spec.ts
└── components/
    ├── HeroSection.spec.ts
    └── EventCard.spec.ts
```

## Running Tests

### All Tests

```bash
npx playwright test
```

### Specific Browser

```bash
npx playwright test --project=chromium
```

### Specific File

```bash
npx playwright test tests/e2e/home.spec.ts
```

### Matching Pattern

```bash
npx playwright test --grep "home"
```

### View Report

```bash
npx playwright show-report
```

## Writing Tests

### Basic E2E Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Events' })).toBeVisible();
  });

  test('should navigate to events page', async ({ page }) => {
    await page.getByRole('link', { name: 'Events' }).click();
    await expect(page).toHaveURL('/events');
  });
});
```

### Form Test

```typescript
test('should submit contact form', async ({ page }) => {
  await page.goto('/contact');
  
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  await page.getByLabel('Message').fill('Hello, I would like to...');
  
  await page.getByRole('button', { name: 'Send Message' }).click();
  
  await expect(page.getByText('Thank you')).toBeVisible();
});
```

### Authenticated Test

```typescript
test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto('/sign-in');
    await page.getByLabel('Email').fill(process.env.TEST_EMAIL!);
    await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/admin');
  });

  test('should display admin dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible();
  });
});
```

## Best Practices

### Use Semantic Locators

```typescript
// Good
await page.getByRole('button', { name: 'Submit' })
await page.getByLabel('Email')
await page.getByTestId('event-card')

// Avoid
await page.locator('.btn-primary')
await page.locator('div:nth-child(3)')
```

### Use `data-testid` for Complex Components

```tsx
// In component
<div data-testid="event-card" className="...">
  {event.title}
</div>

// In test
await page.getByTestId('event-card').first()
```

### Wait for Content

```typescript
// Good - wait for network idle
await page.goto('/events', { waitUntil: 'networkidle' });

// Good - wait for specific element
await expect(page.getByText('Upcoming Events')).toBeVisible();

// Avoid - arbitrary delays
await page.waitForTimeout(2000);
```

### Test Isolation

Each test should be independent. Avoid shared state between tests.

### Naming Conventions

| Pattern | Example |
|---------|---------|
| Test file | `home.spec.ts`, `events.spec.ts` |
| Test suite | `test.describe('Page Name', () => { ... })` |
| Test case | `test('should display X', async () => { ... })` |

## CI Integration

Tests run automatically on GitHub Actions via `.github/workflows/browser-test.yml`:

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    NEXT_PUBLIC_API_URL: http://localhost:3000
```

Set test credentials as GitHub secrets:

- `TEST_EMAIL` — Test account email
- `TEST_PASSWORD` — Test account password

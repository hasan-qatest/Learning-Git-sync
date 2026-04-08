# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\expense.spec.js >> Expense Tracker - Full Coverage Suite >> Expense greater than budget → negative balance allowed
- Location: tests\expense.spec.js:82:3

# Error details

```
Error: locator.waitFor: Target page, context or browser has been closed
Call log:
  - waiting for locator('.expense-item').filter({ hasText: 'Rent' }).first() to be visible

```

```
Error: page.screenshot: Target page, context or browser has been closed
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | const ExpensePage = require('../pages/ExpensePage');
  3   | const data = require('../utils/testData');
  4   | 
  5   | test.describe('Expense Tracker - Full Coverage Suite', () => {
  6   | 
  7   |   let expense;
  8   | 
  9   |   test.beforeEach(async ({ page }) => {
  10  |     expense = new ExpensePage(page);
  11  | 
  12  |     await test.step('Launch application and clear previous data', async () => {
  13  |       await expense.launch('file:///D:/Automation/AI-Learning/expense-tracker.html');
  14  |       await expense.clearStorage();
  15  |     });
  16  |   });
  17  | 
  18  |   test.afterEach(async ({ page }, testInfo) => {
  19  |     if (testInfo.status !== testInfo.expectedStatus) {
> 20  |       await page.screenshot({
      |                  ^ Error: page.screenshot: Target page, context or browser has been closed
  21  |         path: `screenshots/${testInfo.title}.png`,
  22  |         fullPage: true
  23  |       });
  24  |     }
  25  |   });
  26  | 
  27  |   // 🟢 Happy Path
  28  |   test('User sets monthly budget successfully', async () => {
  29  |     await test.step(`Set monthly budget as ₹${data.budget}`, async () => {
  30  |       await expense.setBudget(data.budget);
  31  |     });
  32  | 
  33  |     await test.step('Verify dashboard shows correct budget', async () => {
  34  |       await expect(expense.page.locator(expense.displayBudget))
  35  |         .toContainText('30,000');
  36  |     });
  37  |   });
  38  | 
  39  |   test('User adds expense and remaining updates correctly', async () => {
  40  |     await expense.setBudget(data.budget);
  41  | 
  42  |     await test.step('Add expense: Food - ₹500', async () => {
  43  |       await expense.addExpense('Food', '500');
  44  |     });
  45  | 
  46  |     await test.step('Verify remaining balance is updated', async () => {
  47  |       const remaining = await expense.getRemainingText();
  48  |       expect(remaining).toContain('29,500');
  49  |     });
  50  |   });
  51  | 
  52  |   // 🟡 Edge Cases
  53  |   test('Expense equal to budget → remaining becomes zero', async () => {
  54  |     await expense.setBudget('500');
  55  | 
  56  |     await test.step('Add expense equal to total budget', async () => {
  57  |       await expense.addExpense('Shopping', '500');
  58  |     });
  59  | 
  60  |     await test.step('Verify remaining is ₹0', async () => {
  61  |       const remaining = await expense.getRemainingText();
  62  |       expect(remaining).toContain('0');
  63  |     });
  64  |   });
  65  | 
  66  |   test('Multiple expenses calculation', async () => {
  67  |     await expense.setBudget('1000');
  68  | 
  69  |     await test.step('Add multiple expenses', async () => {
  70  |       await expense.addExpense('Food', '200');
  71  |       await expense.addExpense('Travel', '300');
  72  |       await expense.addExpense('Snacks', '100');
  73  |     });
  74  | 
  75  |     await test.step('Verify remaining balance is ₹400', async () => {
  76  |       const remaining = await expense.getRemainingText();
  77  |       expect(remaining).toContain('400');
  78  |     });
  79  |   });
  80  | 
  81  |   // 🔴 Negative Scenarios
  82  |   test('Expense greater than budget → negative balance allowed', async () => {
  83  |     await expense.setBudget('1000');
  84  | 
  85  |     await test.step('Add expense exceeding budget', async () => {
  86  |       await expense.addExpense('Rent', '1500');
  87  |     });
  88  | 
  89  |     await test.step('Verify negative remaining balance', async () => {
  90  |       const remaining = await expense.getRemainingText();
  91  |       expect(remaining).toContain('-₹1,500');
  92  |     });
  93  |   });
  94  | 
  95  |   test('Empty budget validation', async () => {
  96  |     await test.step('Click Get Started without entering budget', async () => {
  97  |       await expense.page.click(expense.startBtn);
  98  |     });
  99  | 
  100 |     await test.step('Verify validation error is displayed', async () => {
  101 |       await expect(expense.page.locator(expense.budgetError))
  102 |         .toHaveClass(/show/);
  103 |     });
  104 |   });
  105 | 
  106 |   test('Invalid expense inputs validation', async () => {
  107 |     await expense.setBudget(data.budget);
  108 | 
  109 |     await test.step('Open expense modal', async () => {
  110 |       await expense.page.click(expense.fabBtn);
  111 |     });
  112 | 
  113 |     await test.step('Submit empty form', async () => {
  114 |       await expense.page.click(expense.addExpenseBtn);
  115 |     });
  116 | 
  117 |     await test.step('Verify validation messages', async () => {
  118 |       await expect(expense.page.locator(expense.descError)).toHaveClass(/show/);
  119 |       await expect(expense.page.locator(expense.amountError)).toHaveClass(/show/);
  120 |     });
```
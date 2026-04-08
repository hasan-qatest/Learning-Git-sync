const { test, expect } = require('@playwright/test');
const ExpensePage = require('../pages/ExpensePage');
const data = require('../utils/testData');

test.describe('Expense Tracker - Full Coverage Suite', () => {

  let expense;

  test.beforeEach(async ({ page }) => {
    expense = new ExpensePage(page);

    await test.step('Launch application and clear previous data', async () => {
      await expense.launch('file:///D:/Automation/AI-Learning/expense-tracker.html');
      await expense.clearStorage();
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `screenshots/${testInfo.title}.png`,
        fullPage: true
      });
    }
  });

  // 🟢 Happy Path
  test('User sets monthly budget successfully', async () => {
    await test.step(`Set monthly budget as ₹${data.budget}`, async () => {
      await expense.setBudget(data.budget);
    });

    await test.step('Verify dashboard shows correct budget', async () => {
      await expect(expense.page.locator(expense.displayBudget))
        .toContainText('30,000');
    });
  });

  test('User adds expense and remaining updates correctly', async () => {
    await expense.setBudget(data.budget);

    await test.step('Add expense: Food - ₹500', async () => {
      await expense.addExpense('Food', '500');
    });

    await test.step('Verify remaining balance is updated', async () => {
      const remaining = await expense.getRemainingText();
      expect(remaining).toContain('29,500');
    });
  });

  // 🟡 Edge Cases
  test('Expense equal to budget → remaining becomes zero', async () => {
    await expense.setBudget('500');

    await test.step('Add expense equal to total budget', async () => {
      await expense.addExpense('Shopping', '500');
    });

    await test.step('Verify remaining is ₹0', async () => {
      const remaining = await expense.getRemainingText();
      expect(remaining).toContain('0');
    });
  });

  test('Multiple expenses calculation', async () => {
    await expense.setBudget('1000');

    await test.step('Add multiple expenses', async () => {
      await expense.addExpense('Food', '200');
      await expense.addExpense('Travel', '300');
      await expense.addExpense('Snacks', '100');
    });

    await test.step('Verify remaining balance is ₹400', async () => {
      const remaining = await expense.getRemainingText();
      expect(remaining).toContain('400');
    });
  });

  // 🔴 Negative Scenarios
  test('Expense greater than budget → negative balance allowed', async () => {
    await expense.setBudget('1000');

    await test.step('Add expense exceeding budget', async () => {
      await expense.addExpense('Rent', '1500');
    });

    await test.step('Verify negative remaining balance', async () => {
      const remaining = await expense.getRemainingText();
      expect(remaining).toContain('-₹1,500');
    });
  });

  test('Empty budget validation', async () => {
    await test.step('Click Get Started without entering budget', async () => {
      await expense.page.click(expense.startBtn);
    });

    await test.step('Verify validation error is displayed', async () => {
      await expect(expense.page.locator(expense.budgetError))
        .toHaveClass(/show/);
    });
  });

  test('Invalid expense inputs validation', async () => {
    await expense.setBudget(data.budget);

    await test.step('Open expense modal', async () => {
      await expense.page.click(expense.fabBtn);
    });

    await test.step('Submit empty form', async () => {
      await expense.page.click(expense.addExpenseBtn);
    });

    await test.step('Verify validation messages', async () => {
      await expect(expense.page.locator(expense.descError)).toHaveClass(/show/);
      await expect(expense.page.locator(expense.amountError)).toHaveClass(/show/);
    });
  });

  test('Negative expense amount validation', async () => {
    await expense.setBudget(data.budget);

    await test.step('Add negative expense', async () => {
      await expense.addExpense('Invalid Expense', '-500');
    });

    await test.step('Verify error is shown', async () => {
      await expect(expense.page.locator(expense.amountError))
        .toHaveClass(/show/);
    });
  });

  // 🧹 Functional
  test('Delete expense updates balance', async () => {
    await expense.setBudget(data.budget);

    await test.step('Add expense ₹500', async () => {
      await expense.addExpense('Food', '500');
    });

    await test.step('Delete the expense', async () => {
      await expense.deleteExpense();
    });

    await test.step('Verify no expenses exist', async () => {
      await expect(expense.page.locator(expense.expenseItem)).toHaveCount(0);
    });

    await test.step('Verify balance restored to original', async () => {
      const remaining = await expense.getRemainingText();
      expect(remaining).toContain('30,000');
    });
  });

  test('Reset application clears all data', async () => {
    await expense.setBudget(data.budget);

    await test.step('Reset the application', async () => {
      await expense.resetApp();
    });

    await test.step('Verify setup screen is shown', async () => {
      await expect(expense.page.locator('#setup-screen'))
        .toHaveClass(/active/);
    });
  });

});
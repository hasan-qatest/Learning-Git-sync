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

  test('User adds expense and remaining updates correctly', async () => {
    await expense.setBudget(data.budget);

    await test.step('Add expense: Food - ₹500', async () => {
      await expense.addExpense('Food', '500');
    });

    await test.step('Verify remaining balance is updated', async () => {
      await expect(expense.page.locator(expense.displayRemaining))
        .toContainText('29,500');
    });
  });

});

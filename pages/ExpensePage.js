class ExpensePage {
  constructor(page) {
    this.page = page;

    this.budgetInput = '#budget-input';
    this.startBtn = 'text=Get Started';
    this.budgetError = '#budget-error';

    this.displayBudget = '#display-budget';
    this.displayRemaining = '#display-remaining';
    this.resetBtn = 'text=Reset';

    this.fabBtn = '#fab-btn';
    this.descInput = '#exp-desc';
    this.amountInput = '#exp-amount';
    this.addExpenseBtn = 'text=Add Expense';
    this.descError = '#desc-error';
    this.amountError = '#amount-error';

    this.expenseItem = '.expense-item';
    this.deleteBtn = '.btn-delete';
  }

  async launch(url) {
    await this.page.goto(url);
  }

  async clearStorage() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  async setBudget(amount) {
    await this.page.fill(this.budgetInput, amount);
    await this.page.click(this.startBtn);
  }

  async addExpense(desc, amount) {
    await this.page.click(this.fabBtn);
    await this.page.fill(this.descInput, desc);
    await this.page.fill(this.amountInput, amount);

    await this.page.click(this.addExpenseBtn);

    // Wait for expense to appear
    await this.page.locator(this.expenseItem).filter({ hasText: desc }).first().waitFor();
  }

  async deleteExpense() {
    await this.page.click(this.deleteBtn);
  }

  async resetApp() {
    this.page.on('dialog', dialog => dialog.accept());
    await this.page.click(this.resetBtn);
  }
}

module.exports = ExpensePage;

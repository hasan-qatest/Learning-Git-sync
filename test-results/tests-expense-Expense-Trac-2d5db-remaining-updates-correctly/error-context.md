# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\expense.spec.js >> Expense Tracker - Full Coverage Suite >> User adds expense and remaining updates correctly
- Location: tests\expense.spec.js:39:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.expense-item').filter({ hasText: 'Food' }).first() to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - heading "📊 My Expenses" [level=2] [ref=e4]
      - button "⟳ Reset" [ref=e5] [cursor=pointer]
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]: Monthly Budget
        - generic [ref=e9]: ₹30,000
      - generic [ref=e10]:
        - generic [ref=e11]: Total Spent
        - generic [ref=e12]: ₹0
      - generic [ref=e13]:
        - generic [ref=e14]: Remaining
        - generic [ref=e15]: ₹30,000
    - generic [ref=e17]:
      - generic [ref=e18]: 0% used
      - generic [ref=e19]: ₹30,000 left
    - generic [ref=e21]: Expenses
    - generic [ref=e23]:
      - generic [ref=e24]: 🧾
      - paragraph [ref=e25]:
        - text: No expenses yet.
        - text: Tap
        - strong [ref=e26]: +
        - text: below to add your first one.
  - button "+" [ref=e27] [cursor=pointer]
  - generic [ref=e29]:
    - heading "Add Expense" [level=3] [ref=e31]
    - generic [ref=e32]:
      - generic [ref=e33]: Description
      - textbox "e.g. Groceries, Rent, Transport…" [ref=e34]: Food
    - generic [ref=e35]:
      - generic [ref=e36]: Amount (₹)
      - spinbutton [ref=e37]: "500"
    - generic [ref=e38]:
      - button "Cancel" [ref=e39] [cursor=pointer]
      - button "Add Expense" [ref=e40] [cursor=pointer]
```

# Test source

```ts
  1  | class ExpensePage {
  2  |   constructor(page) {
  3  |     this.page = page;
  4  | 
  5  |     this.budgetInput = '#budget-input';
  6  |     this.startBtn = 'text=Get Started';
  7  |     this.budgetError = '#budget-error';
  8  | 
  9  |     this.displayBudget = '#display-budget';
  10 |     this.displayRemaining = '#display-remaining';
  11 |     this.resetBtn = 'text=Reset';
  12 | 
  13 |     this.fabBtn = '#fab-btn';
  14 |     this.descInput = '#exp-desc';
  15 |     this.amountInput = '#exp-amount';
  16 |     this.addExpenseBtn = 'text=Add Expense';
  17 |     this.descError = '#desc-error';
  18 |     this.amountError = '#amount-error';
  19 | 
  20 |     this.expenseItem = '.expense-item';
  21 |     this.deleteBtn = '.btn-delete';
  22 |   }
  23 | 
  24 |   async launch(url) {
  25 |     await this.page.goto(url);
  26 |   }
  27 | 
  28 |   async clearStorage() {
  29 |     await this.page.evaluate(() => localStorage.clear());
  30 |     await this.page.reload();
  31 |   }
  32 | 
  33 |   async setBudget(amount) {
  34 |     await this.page.fill(this.budgetInput, amount);
  35 |     await this.page.click(this.startBtn);
  36 |   }
  37 | 
  38 |   async addExpense(desc, amount) {
  39 |     await this.page.click(this.fabBtn);
  40 |     await this.page.fill(this.descInput, desc);
  41 |     await this.page.fill(this.amountInput, amount);
  42 | 
  43 |     await this.page.click(this.addExpenseBtn);
  44 | 
  45 |     // Wait for expense to appear
> 46 |     await this.page.locator(this.expenseItem).filter({ hasText: desc }).first().waitFor();
     |                                                                                 ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  47 |   }
  48 | 
  49 |   async deleteExpense() {
  50 |     await this.page.click(this.deleteBtn);
  51 |   }
  52 | 
  53 |   async resetApp() {
  54 |     this.page.on('dialog', dialog => dialog.accept());
  55 |     await this.page.click(this.resetBtn);
  56 |   }
  57 | }
  58 | 
  59 | module.exports = ExpensePage;
  60 | 
```
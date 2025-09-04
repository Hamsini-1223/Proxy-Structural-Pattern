// src/mainApplication.ts
import * as readline from "readline";
import { Wallet } from "./models/wallet";
import { CashPayment } from "./services/cashPayment";
import { CreditCardPayment } from "./services/creditCardPayment";
import { StoreService } from "./services/storeService";

class ShoppingApplication {
  private rl: readline.Interface;
  private wallet: Wallet;
  private cashPayment: CashPayment;
  private creditCard: CreditCardPayment;
  private store: StoreService;

  constructor() {
    try {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      this.wallet = new Wallet(500);
      this.cashPayment = new CashPayment(this.wallet);
      this.creditCard = new CreditCardPayment(this.wallet, "1234");
      this.store = new StoreService();
    } catch (error) {
      console.error(
        `Initialization error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      process.exit(1);
    }
  }

  async start(): Promise<void> {
    try {
      console.log("🏪 Welcome to the Interactive Store!");
      console.log("💰 Starting with $500 in your wallet");
      console.log("🔐 Your credit card PIN is: 1234\n");
      await this.showMainMenu();
    } catch (error) {
      console.error(
        `Application error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      this.rl.close();
    }
  }

  private async showMainMenu(): Promise<void> {
    console.log("\n" + "=".repeat(40));
    console.log("🏪 MAIN MENU");
    console.log("=".repeat(40));
    console.log("1. 🛍️  Shop for items");
    console.log("2. 💰 Check wallet balance");
    console.log("3. 💳 Manage credit card");
    console.log("4. ❌ Exit");
    console.log("=".repeat(40));

    const choice = await this.askQuestion("Choose an option (1-4): ");

    try {
      switch (choice.trim()) {
        case "1":
          await this.showShoppingMenu();
          break;
        case "2":
          this.showBalance();
          await this.showMainMenu();
          break;
        case "3":
          await this.manageCreditCard();
          break;
        case "4":
          console.log("👋 Thanks for shopping! Goodbye!");
          this.rl.close();
          return;
        default:
          throw new Error("Invalid menu choice");
      }
    } catch (error) {
      console.log(
        `❌ ${
          error instanceof Error ? error.message : String(error)
        } Please try again.`
      );
      await this.showMainMenu();
    }
  }

  private async showShoppingMenu(): Promise<void> {
    try {
      console.log("\n" + "=".repeat(40));
      console.log("🛍️ STORE ITEMS");
      console.log("=".repeat(40));

      const items = StoreService.getItems();
      items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - $${item.price}`);
      });

      console.log("0. 🔙 Back to main menu");
      console.log("=".repeat(40));

      const choice = await this.askQuestion("Choose an item (0-7): ");
      const itemIndex = parseInt(choice.trim()) - 1;

      if (choice.trim() === "0") {
        await this.showMainMenu();
        return;
      }

      if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= items.length) {
        throw new Error("Invalid item selection");
      }

      const selectedItem = items[itemIndex];
      await this.selectPaymentMethod(selectedItem);
    } catch (error) {
      console.log(
        `❌ ${
          error instanceof Error ? error.message : String(error)
        } Please try again.`
      );
      await this.showShoppingMenu();
    }
  }

  private async selectPaymentMethod(item: any): Promise<void> {
    try {
      console.log(`\n🛒 You selected: ${item.name} ($${item.price})`);
      console.log("\nHow would you like to pay?");
      console.log("1. 💵 Cash (direct access)");
      console.log("2. 💳 Credit Card (proxy with security)");
      console.log("3. 🔙 Cancel purchase");

      const choice = await this.askQuestion("Choose payment method (1-3): ");

      switch (choice.trim()) {
        case "1":
          await this.payWithCash(item);
          break;
        case "2":
          await this.payWithCreditCard(item);
          break;
        case "3":
          console.log("🚫 Purchase cancelled");
          await this.showShoppingMenu();
          return;
        default:
          throw new Error("Invalid payment method");
      }
    } catch (error) {
      console.log(
        `❌ ${
          error instanceof Error ? error.message : String(error)
        } Please try again.`
      );
      await this.selectPaymentMethod(item);
    }
  }

  private async payWithCash(item: any): Promise<void> {
    try {
      console.log("\n💵 Paying with CASH (direct access to wallet)...");
      this.store.sellItem(this.cashPayment, item.name, item.price);
      await this.askQuestion("\nPress Enter to continue...");
      await this.showMainMenu();
    } catch (error) {
      console.error(
        `Cash payment failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      await this.showMainMenu();
    }
  }

  private async payWithCreditCard(item: any): Promise<void> {
    try {
      console.log("\n💳 Paying with CREDIT CARD (proxy with security)...");

      if (!this.creditCard.isCardUnlocked()) {
        console.log("🔐 Credit card is locked! Please enter PIN:");
        const enteredPin = await this.askQuestion("Enter PIN: ");

        if (!this.creditCard.enterPin(enteredPin)) {
          console.log("❌ Wrong PIN! Payment cancelled.");
          await this.askQuestion("Press Enter to continue...");
          await this.showMainMenu();
          return;
        }
      }

      this.store.sellItem(this.creditCard, item.name, item.price);
      await this.askQuestion("\nPress Enter to continue...");
      await this.showMainMenu();
    } catch (error) {
      console.error(
        `Credit card payment failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      await this.showMainMenu();
    }
  }

  private showBalance(): void {
    try {
      console.log(`\n💰 Current wallet balance: $${this.wallet.getBalance()}`);
    } catch (error) {
      console.error(
        `Error checking balance: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private async manageCreditCard(): Promise<void> {
    try {
      console.log("\n" + "=".repeat(40));
      console.log("💳 CREDIT CARD MANAGEMENT");
      console.log("=".repeat(40));
      console.log("1. 🔓 Unlock card (enter PIN)");
      console.log("2. 🔒 Lock card");
      console.log("3. 🔙 Back to main menu");
      console.log("=".repeat(40));

      const choice = await this.askQuestion("Choose an option (1-3): ");

      switch (choice.trim()) {
        case "1":
          const pin = await this.askQuestion("Enter PIN: ");
          this.creditCard.enterPin(pin);
          await this.askQuestion("Press Enter to continue...");
          await this.showMainMenu();
          break;
        case "2":
          this.creditCard.lockCard();
          await this.askQuestion("Press Enter to continue...");
          await this.showMainMenu();
          break;
        case "3":
          await this.showMainMenu();
          break;
        default:
          throw new Error("Invalid card management option");
      }
    } catch (error) {
      console.log(
        `❌ ${
          error instanceof Error ? error.message : String(error)
        } Please try again.`
      );
      await this.manageCreditCard();
    }
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.rl.question(question, (answer) => {
          resolve(answer || "");
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Start the application
async function main() {
  try {
    const app = new ShoppingApplication();
    await app.start();
  } catch (error) {
    console.error(
      `Fatal error: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(
    `Unhandled error: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exit(1);
});

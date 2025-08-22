// main.ts
// Interactive console interface for the Proxy pattern demo
import * as readline from "readline";
import { Wallet } from "./wallet";
import { Cash } from "./cash";
import { CreditCard } from "./credit-card";
import { Store } from "./store";
import { Payment } from "./payment.interface";

// Store items available for purchase
interface StoreItem {
  name: string;
  price: number;
}

const storeItems: StoreItem[] = [
  { name: "Coffee", price: 5 },
  { name: "Sandwich", price: 12 },
  { name: "Headphones", price: 45 },
  { name: "T-Shirt", price: 25 },
  { name: "Book", price: 15 },
  { name: "Laptop", price: 299 },
  { name: "Phone", price: 199 },
];

class InteractiveShoppingApp {
  private rl: readline.Interface;
  private wallet: Wallet;
  private cash: Cash;
  private creditCard: CreditCard;
  private store: Store;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Initialize with $500 in wallet
    this.wallet = new Wallet(500);
    this.cash = new Cash(this.wallet);
    this.creditCard = new CreditCard(this.wallet, "1234");
    this.store = new Store();
  }

  async start(): Promise<void> {
    console.log("🏪 Welcome to the Interactive Store!");
    console.log("💰 Starting with $500 in your wallet");
    console.log("🔑 Your credit card PIN is: 1234\n");

    await this.showMainMenu();
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
        console.log("❌ Invalid choice! Please try again.");
        await this.showMainMenu();
    }
  }

  private async showShoppingMenu(): Promise<void> {
    console.log("\n" + "=".repeat(40));
    console.log("🛍️ STORE ITEMS");
    console.log("=".repeat(40));

    storeItems.forEach((item, index) => {
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

    if (itemIndex < 0 || itemIndex >= storeItems.length) {
      console.log("❌ Invalid item! Please try again.");
      await this.showShoppingMenu();
      return;
    }

    const selectedItem = storeItems[itemIndex];
    await this.selectPaymentMethod(selectedItem);
  }

  private async selectPaymentMethod(item: StoreItem): Promise<void> {
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
        console.log("❌ Invalid choice! Please try again.");
        await this.selectPaymentMethod(item);
    }
  }

  private async payWithCash(item: StoreItem): Promise<void> {
    console.log("\n💵 Paying with CASH (direct access to wallet)...");
    this.store.sellItem(this.cash, item.name, item.price);

    await this.askQuestion("\nPress Enter to continue...");
    await this.showMainMenu();
  }

  private async payWithCreditCard(item: StoreItem): Promise<void> {
    console.log("\n💳 Paying with CREDIT CARD (proxy with security)...");

    // Check if card is already unlocked
    if (!this.creditCard.isCardUnlocked()) {
      console.log("🔒 Credit card is locked! Please enter PIN:");
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
  }

  private showBalance(): void {
    console.log(`\n💰 Current wallet balance: $${this.wallet.getBalance()}`);
  }

  private async manageCreditCard(): Promise<void> {
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
        // Lock card by trying wrong PIN
        this.creditCard.enterPin("0000");
        console.log("🔒 Card locked!");
        await this.askQuestion("Press Enter to continue...");
        await this.showMainMenu();
        break;
      case "3":
        await this.showMainMenu();
        break;
      default:
        console.log("❌ Invalid choice! Please try again.");
        await this.manageCreditCard();
    }
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }
}

// Start the interactive app
async function main() {
  const app = new InteractiveShoppingApp();
  await app.start();
}

main().catch(console.error);

/*
🔑 Interactive Features Added:

1. 🏪 SHOPPING MENU: Choose from 7 different items
2. 💰 PAYMENT CHOICE: Select cash vs credit card for each purchase
3. 🔐 PIN ENTRY: Interactive PIN entry for credit card
4. 💳 CARD MANAGEMENT: Lock/unlock credit card
5. 💵 BALANCE CHECK: See current wallet balance
6. 🔄 CONTINUOUS LOOP: Keep shopping until you exit

🎯 Proxy Pattern Benefits Shown:
- Cash = Direct access to wallet (no security)
- Credit Card = Proxy with PIN protection and big purchase warnings
- Store doesn't care which payment method you choose
- Same interface for both payment types
*/

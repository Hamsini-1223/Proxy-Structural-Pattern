// credit-card.ts
// PROXY - stands between you and your wallet
// Adds security and convenience
import { Payment } from "./payment.interface";
import { Wallet } from "./wallet";

export class CreditCard implements Payment {
  private wallet: Wallet;
  private pin: string;
  private isUnlocked: boolean = false;

  constructor(wallet: Wallet, pin: string) {
    this.wallet = wallet;
    this.pin = pin;
  }

  // You must enter PIN first
  enterPin(enteredPin: string): boolean {
    if (enteredPin === this.pin) {
      this.isUnlocked = true;
      console.log("✅ PIN correct! Card unlocked");
      return true;
    } else {
      console.log("❌ Wrong PIN! Card locked");
      this.isUnlocked = false;
      return false;
    }
  }

  // Check if card is unlocked without making a payment
  isCardUnlocked(): boolean {
    return this.isUnlocked;
  }

  // This is the proxy magic - it controls access to your wallet
  pay(amount: number): boolean {
    console.log(`Paying $${amount} with credit card...`);

    // Security check
    if (!this.isUnlocked) {
      console.log("🚫 Card is locked! Enter PIN first");
      return false;
    }

    // Extra safety for big purchases
    if (amount > 100) {
      console.log("⚠️ Big purchase! Extra security check...");
    }

    // Now actually take money from wallet (delegate to real object)
    return this.wallet.withdraw(amount);
  }
}

// src/services/creditCardPayment.ts
import { Payment } from "../models/paymentInterface";
import { Wallet } from "../models/wallet";

export class CreditCardPayment implements Payment {
  private wallet: Wallet;
  private pin: string;
  private isUnlocked: boolean = false;

  constructor(wallet: Wallet, pin: string) {
    if (!wallet) {
      throw new Error("Wallet is required for credit card payments");
    }
    if (!pin || pin.length < 4) {
      throw new Error("PIN must be at least 4 characters");
    }
    this.wallet = wallet;
    this.pin = pin;
  }

  enterPin(enteredPin: string): boolean {
    try {
      if (!enteredPin) {
        throw new Error("PIN cannot be empty");
      }

      if (enteredPin === this.pin) {
        this.isUnlocked = true;
        console.log("✅ PIN correct! Card unlocked");
        return true;
      } else {
        console.log("❌ Wrong PIN! Card locked");
        this.isUnlocked = false;
        return false;
      }
    } catch (error) {
      console.error(
        `PIN validation error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return false;
    }
  }

  isCardUnlocked(): boolean {
    return this.isUnlocked;
  }

  pay(amount: number): boolean {
    try {
      if (amount <= 0) {
        throw new Error("Payment amount must be positive");
      }

      console.log(`Paying $${amount} with credit card...`);

      if (!this.isUnlocked) {
        console.log("🚫 Card is locked! Enter PIN first");
        return false;
      }

      if (amount > 100) {
        console.log("⚠️ Big purchase! Extra security check...");
      }

      return this.wallet.withdraw(amount);
    } catch (error) {
      console.error(
        `Credit card payment error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return false;
    }
  }

  lockCard(): void {
    this.isUnlocked = false;
    console.log("🔒 Card locked!");
  }
}

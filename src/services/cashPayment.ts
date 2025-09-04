// src/services/cashPayment.ts
import { Payment } from "../models/paymentInterface";
import { Wallet } from "../models/wallet";

export class CashPayment implements Payment {
  private wallet: Wallet;

  constructor(wallet: Wallet) {
    if (!wallet) {
      throw new Error("Wallet is required for cash payments");
    }
    this.wallet = wallet;
  }

  pay(amount: number): boolean {
    try {
      console.log(`Paying $${amount} with cash...`);
      return this.wallet.withdraw(amount);
    } catch (error) {
      console.error(
        `Cash payment error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return false;
    }
  }
}

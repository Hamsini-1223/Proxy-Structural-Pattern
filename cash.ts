// cash.ts
// Direct way to pay - just use cash from wallet
import { Payment } from './payment.interface';
import { Wallet } from './wallet';

export class Cash implements Payment {
  private wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  pay(amount: number): boolean {
    console.log(`Paying $${amount} with cash...`);
    return this.wallet.withdraw(amount);
  }
}
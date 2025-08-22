// wallet.ts
// This is the REAL thing - your actual money
export class Wallet {
  private money: number;

  constructor(money: number) {
    this.money = money;
  }

  withdraw(amount: number): boolean {
    if (amount > this.money) {
      console.log(`Not enough money! You have $${this.money}, need $${amount}`);
      return false;
    }

    this.money -= amount;
    console.log(`Took $${amount} from wallet. Left: $${this.money}`);
    return true;
  }

  getBalance(): number {
    return this.money;
  }
}

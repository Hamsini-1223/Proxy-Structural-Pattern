export class Wallet {
  private money: number;

  constructor(money: number) {
    if (money < 0) {
      throw new Error("Wallet cannot have negative money");
    }
    this.money = money;
  }

  withdraw(amount: number): boolean {
    try {
      if (amount <= 0) {
        throw new Error("Amount must be positive");
      }

      if (amount > this.money) {
        console.log(
          `Not enough money! You have $${this.money}, need $${amount}`
        );
        return false;
      }

      this.money -= amount;
      console.log(`Took $${amount} from wallet. Left: $${this.money}`);
      return true;
    } catch (error) {
      console.error(
        `Withdrawal error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return false;
    }
  }

  getBalance(): number {
    return this.money;
  }
}

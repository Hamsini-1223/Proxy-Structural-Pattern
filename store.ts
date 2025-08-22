// store.ts
// The store doesn't care if you pay with cash or card
import { Payment } from "./payment.interface";

export class Store {
  sellItem(payment: Payment, itemName: string, price: number): void {
    console.log(`\n🏪 Buying ${itemName} for $${price}`);

    if (payment.pay(price)) {
      console.log(`✅ Thank you! Enjoy your ${itemName}`);
    } else {
      console.log(`❌ Payment failed! Cannot buy ${itemName}`);
    }
  }
}

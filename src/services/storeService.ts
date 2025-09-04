// src/services/storeService.ts
import { Payment } from "../models/paymentInterface";

interface StoreItem {
  name: string;
  price: number;
}

export class StoreService {
  private static items: StoreItem[] = [
    { name: "Coffee", price: 5 },
    { name: "Sandwich", price: 12 },
    { name: "Headphones", price: 45 },
    { name: "T-Shirt", price: 25 },
    { name: "Book", price: 15 },
    { name: "Laptop", price: 299 },
    { name: "Phone", price: 199 },
  ];

  static getItems(): StoreItem[] {
    return [...this.items];
  }

  sellItem(payment: Payment, itemName: string, price: number): boolean {
    try {
      if (!payment) {
        throw new Error("Payment method is required");
      }
      if (!itemName || itemName.trim() === "") {
        throw new Error("Item name cannot be empty");
      }
      if (price <= 0) {
        throw new Error("Price must be positive");
      }

      console.log(`\n🏪 Buying ${itemName} for $${price}`);

      if (payment.pay(price)) {
        console.log(`✅ Thank you! Enjoy your ${itemName}`);
        return true;
      } else {
        console.log(`❌ Payment failed! Cannot buy ${itemName}`);
        return false;
      }
    } catch (error) {
      console.error(
        `Store transaction error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return false;
    }
  }
}

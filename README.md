# Proxy Pattern Implementation

A clean TypeScript implementation of the Proxy Design Pattern using a credit card payment system.

## Overview

This project demonstrates the Proxy pattern where a credit card acts as a proxy for wallet access, providing security and control while maintaining the same interface as direct cash payments.

## Project Structure

```
src/
├── models/
│   ├── paymentInterface.ts    # Common payment interface
│   └── wallet.ts              # Real service implementation
├── services/
│   ├── cashPayment.ts         # Direct payment implementation
│   ├── creditCardPayment.ts   # Proxy payment implementation
│   └── storeService.ts        # Client implementation
└── mainApplication.ts         # Interactive console application
├── README.md
├── package.json
└── tsconfig.json
```

## Installation

```bash
npm install
npm run dev
```

## How It Works

- **CashPayment**: Direct access to wallet funds
- **CreditCardPayment**: Proxy with PIN authentication and security checks
- **StoreService**: Client that works with any payment method through the common interface

## Code Example

The core of the Proxy pattern implementation:

```typescript
// Common interface for both payment methods
interface Payment {
  pay(amount: number): boolean;
}

// Direct implementation - no security
class CashPayment implements Payment {
  pay(amount: number): boolean {
    console.log(`Paying ${amount} with cash...`);
    return this.wallet.withdraw(amount);
  }
}

// Proxy implementation - adds security layer
class CreditCardPayment implements Payment {
  pay(amount: number): boolean {
    console.log(`Paying ${amount} with credit card...`);

    // Security check before delegating to real service
    if (!this.isUnlocked) {
      console.log("🚫 Card is locked! Enter PIN first");
      return false;
    }

    // Additional security for large purchases
    if (amount > 100) {
      console.log("⚠️ Big purchase! Extra security check...");
    }

    // Delegate to real service (wallet)
    return this.wallet.withdraw(amount);
  }
}

// Client code works with any payment method
class StoreService {
  sellItem(payment: Payment, itemName: string, price: number): void {
    if (payment.pay(price)) {
      console.log(`✅ Thank you! Enjoy your ${itemName}`);
    }
  }
}
```

## Sample Output

```
🏪 Welcome to the Interactive Store!
💰 Starting with $500 in your wallet
🔐 Your credit card PIN is: 1234

========================================
🏪 MAIN MENU
========================================
1. 🛍️  Shop for items
2. 💰 Check wallet balance
3. 💳 Manage credit card
4. ❌ Exit
========================================
Choose an option (1-4): 1

========================================
🛍️ STORE ITEMS
========================================
1. Coffee - $5
2. Sandwich - $12
3. Headphones - $45
4. T-Shirt - $25
5. Book - $15
6. Laptop - $299
7. Phone - $199
0. 🔙 Back to main menu
========================================
Choose an item (0-7): 1

🛒 You selected: Coffee ($5)

How would you like to pay?
1. 💵 Cash (direct access)
2. 💳 Credit Card (proxy with security)
3. 🔙 Cancel purchase
Choose payment method (1-3): 2

💳 Paying with CREDIT CARD (proxy with security)...
🔐 Credit card is locked! Please enter PIN:
Enter PIN: 1234
✅ PIN correct! Card unlocked
Paying $5 with credit card...
Took $5 from wallet. Left: $495

🏪 Buying Coffee for $5
✅ Thank you! Enjoy your Coffee
```

## Features

- Interactive console application
- PIN-based security system
- Input validation and error handling
- Real-time balance tracking
- Security warnings for large transactions

## Key Benefits Demonstrated

- **Transparency**: Store doesn't know whether it's using cash or credit card
- **Security Layer**: Credit card adds authentication without changing the interface
- **Flexibility**: Easy to add new payment methods or security features
- **Control**: Proxy can log, validate, or modify requests before delegation

## Requirements

- Node.js 16+
- TypeScript 5+

## Built by

**Ms Hamsini S**

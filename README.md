# Proxy Pattern Implementation: Credit Card vs Cash

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

A clean TypeScript implementation of the Proxy Structural Design Pattern using an interactive credit card vs cash payment system.

## Overview

This project demonstrates the Proxy pattern through a real-world analogy where a credit card acts as a proxy for wallet money. The credit card provides security and control while maintaining the same interface as direct cash payments.

## Pattern Implementation

**Components:**

- **Wallet**: Real service containing actual money
- **Cash**: Direct implementation with immediate wallet access
- **CreditCard**: Proxy implementation with PIN security
- **Store**: Client that works with any payment method
- **Payment**: Interface implemented by both payment methods

## Project Structure

```
├── payment.interface.ts    # Common payment interface
├── wallet.ts              # Real service implementation
├── cash.ts                # Direct payment implementation
├── credit-card.ts         # Proxy payment implementation
├── store.ts               # Client implementation
├── main.ts                # Interactive console application
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Documentation
```

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/proxy-pattern-credit-card.git
cd proxy-pattern-credit-card

# Install dependencies
npm install

# Run the application
npm run dev
```

## Usage

The application starts with $500 in your wallet and PIN `1234` for the credit card.

**Available operations:**

- Shop for items (Coffee $5 to Laptop $299)
- Choose payment method (Cash or Credit Card)
- Manage credit card (lock/unlock with PIN)
- Check wallet balance

**Payment flows:**

- **Cash**: Direct wallet access, no security
- **Credit Card**: PIN required, security warnings for purchases over $100

## Class Diagram

```
                    Store (Client)
                        |
                        | uses
                        ▼
                 Payment Interface
                        ▲
            ┌───────────┴───────────┐
            |                       |
        implements              implements
            |                       |
           Cash                CreditCard (Proxy)
            |                       |
         uses |                     | uses
            |                       |
            └───────────┬───────────┘
                        |
                        ▼
                   Wallet (Real Service)
```

## Key Features

**Proxy Pattern Benefits:**

- Same interface for different implementations
- Transparent security layer addition
- No changes required to client code
- Control access to expensive resources

**Implementation Details:**

- PIN authentication for credit card
- Security warnings for large purchases
- Real-time balance tracking
- Interactive console interface

## Code Example

```typescript
// Same interface for both payment methods
interface Payment {
  pay(amount: number): boolean;
}

// Client code works with any payment method
class Store {
  sellItem(payment: Payment, item: string, price: number) {
    if (payment.pay(price)) {
      console.log(`Purchase successful: ${item}`);
    }
  }
}

// Proxy adds security before delegating to real service
class CreditCard implements Payment {
  pay(amount: number): boolean {
    if (!this.isUnlocked) return false;
    if (amount > 100) console.log("Security warning: Large purchase");
    return this.wallet.withdraw(amount);
  }
}
```

## Sample Output

```
🏪 Welcome to the Interactive Store!
💰 Starting with $500 in your wallet
🔑 Your credit card PIN is: 1234

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
Choose payment method (1-3): 1

💵 Paying with CASH (direct access to wallet)...
Paying $5 with cash...
Took $5 from wallet. Left: $495

🏪 Buying Coffee for $5
✅ Thank you! Enjoy your Coffee

Press Enter to continue...
```

**Credit Card Payment Example:**

```
Choose payment method (1-3): 2

💳 Paying with CREDIT CARD (proxy with security)...
🔒 Credit card is locked! Please enter PIN:
Enter PIN: 1234
✅ PIN correct! Card unlocked
Paying $299 with credit card...
⚠️ Big purchase! Extra security check...
Took $299 from wallet. Left: $196

🏪 Buying Laptop for $299
✅ Thank you! Enjoy your Laptop
```

## Running the Application

```bash
# Development mode
npm run dev

# Build and run
npm run build
npm start

# Clean build files
npm run clean
```

## Learning Objectives

- Understand when and how to implement the Proxy pattern
- Learn transparent security layer implementation
- Practice interface-based programming
- Experience real-world design pattern application

## Requirements

- Node.js 16+
- TypeScript 5+
- npm or yarn

## Built by

**Ms Hamsini S**

## Resources

- [Proxy Pattern Documentation](https://refactoring.guru/design-patterns/proxy)
- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)

---

This implementation provides a hands-on approach to understanding the Proxy pattern through interactive examples and clear code structure.

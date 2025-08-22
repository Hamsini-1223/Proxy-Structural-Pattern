// payment.interface.ts
// Simple interface that both cash and credit card can use
export interface Payment {
  pay(amount: number): boolean;
}
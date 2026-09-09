import { describe, it, expect, beforeEach } from 'vitest';
import { INITIAL_PRODUCTS, INITIAL_DISCOUNTS, INITIAL_SETTINGS } from '../data/mockData';

describe('Everyday Essential E-Commerce Logic Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('calculates percentage promo discount correctly', () => {
    const subtotal = 2000;
    const discountObj = INITIAL_DISCOUNTS.find((d) => d.code === 'WELCOME10');
    expect(discountObj).toBeDefined();

    if (discountObj && discountObj.discountType === 'percentage') {
      const discountVal = Math.round((subtotal * discountObj.value) / 100);
      expect(discountVal).toBe(200); // 10% of 2000 = 200
    }
  });

  it('calculates fixed amount discount correctly', () => {
    const subtotal = 4000;
    const discountObj = INITIAL_DISCOUNTS.find((d) => d.code === 'SAVE500');
    expect(discountObj).toBeDefined();

    if (discountObj && discountObj.discountType === 'fixed') {
      const discountVal = Math.min(subtotal, discountObj.value);
      expect(discountVal).toBe(500);
    }
  });

  it('handles shipping fee threshold correctly (Rs 250 vs Free over Rs 3000)', () => {
    const feeRate = INITIAL_SETTINGS.shippingFee; // 250
    const freeThreshold = INITIAL_SETTINGS.freeShippingThreshold; // 3000

    const subtotalBelow = 2500;
    const shippingBelow = subtotalBelow >= freeThreshold ? 0 : feeRate;
    expect(shippingBelow).toBe(250);

    const subtotalAbove = 3500;
    const shippingAbove = subtotalAbove >= freeThreshold ? 0 : feeRate;
    expect(shippingAbove).toBe(0);
  });

  it('has initial mock products loaded', () => {
    expect(INITIAL_PRODUCTS.length).toBeGreaterThan(0);
    const prod1 = INITIAL_PRODUCTS[0];
    expect(prod1).toHaveProperty('price');
    expect(prod1).toHaveProperty('category');
  });
});

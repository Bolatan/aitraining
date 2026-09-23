export const CURRENCY = {
  symbol: '₦',
  code: 'NGN',
  name: 'Nigerian Naira',
} as const;

export function formatNaira(amount: number): string {
  return `${CURRENCY.symbol}${amount.toLocaleString('en-NG')}`;
}

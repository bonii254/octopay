export const formatCurrency = (amount: string | number | null | undefined): string => {
  if (!amount) return "KES 0.00";
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
  }).format(num);
};
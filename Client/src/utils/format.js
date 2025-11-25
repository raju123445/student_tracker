export function formatCurrency(value) {
  if (value == null) return '-';
  return typeof value === 'number' ? value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : value;
}

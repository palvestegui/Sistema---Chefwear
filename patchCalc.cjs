const fs = require('fs');
let content = fs.readFileSync('src/utils/pricingCalculator.ts', 'utf8');

const exportToAdd = `
export const calculateVolumeScaledServiceUnitPrice = (qty: number): number => {
  if (qty <= 0) return 0;
  if (qty === 1) return 70;
  if (qty === 2) return 40; // Total 80
  if (qty === 3) return 30; // Total 90
  if (qty === 4) return 25; // Total 100
  if (qty === 5) return 22; // Total 110
  return 20; // 6 or more -> 20 per unit
};
`;

content = content + exportToAdd;
fs.writeFileSync('src/utils/pricingCalculator.ts', content);

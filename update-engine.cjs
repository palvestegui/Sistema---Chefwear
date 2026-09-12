const fs = require('fs');

let content = fs.readFileSync('src/utils/pricingCalculator.ts', 'utf8');

const originalEngineStart = `export const computeDiscountEngine = (
  itemsList: any[],
  category: string = 'Personal',
  paymentMethod: string = '50/50 - Adelantado/Entrega',
  manualDiscount: number = 0,
  clientType?: string,
  accountId?: string,
  calculateItemPriceRawFn?: (item: any, cat: string, accId?: string) => number,
  specialPresetDiscounts?: Record<string, any>,
  migrationFlatDiscount: number = 0
): DiscountEngineResult => {
  const collapsedItems = collapseUdiItems(itemsList || []);`;

const replacementEngineStart = `export const computeDiscountEngine = (
  itemsList: any[],
  category: string = 'Personal',
  paymentMethod: string = '50/50 - Adelantado/Entrega',
  manualDiscount: number = 0,
  clientType?: string,
  accountId?: string,
  calculateItemPriceRawFn?: (item: any, cat: string, accId?: string) => number,
  specialPresetDiscounts?: Record<string, any>,
  migrationFlatDiscount: number = 0
): DiscountEngineResult => {
  const collapsedItems = collapseUdiItems(itemsList || []);
  const getPrice = calculateItemPriceRawFn || (() => 0);

  // MIGRATION OVERRIDE: If there's a migration flat discount, completely bypass ALL discount rules.
  if (migrationFlatDiscount > 0) {
    let subtotal = 0;
    collapsedItems.forEach(item => {
      subtotal += getPrice(item, category);
    });

    const total = Math.max(0, subtotal - migrationFlatDiscount);
    const lines = [{ label: 'Descuento Aplicado', amount: migrationFlatDiscount }];

    return {
      subtotal,
      lines,
      volumeDiscountAmt: 0,
      cashDiscountAmt: 0,
      packageDiscountAmt: 0,
      manualDiscountAmt: migrationFlatDiscount,
      overallVolPct: 0,
      overallCashPct: 0,
      cashDiscountPct: 0,
      overallAutoPct: 0,
      manualDisc: 0,
      total
    };
  }
`;

content = content.replace(originalEngineStart, replacementEngineStart);

// Remove the old migrationFlatDiscount check deeper inside to avoid confusion
const oldCheck = `  if (migrationFlatDiscount > 0) {
    manualDiscountAmt = Number(migrationFlatDiscount) || 0;
    effectiveManual = 0;
  } else if (discountConfig.manualDiscountEnabled) {`;

const newCheck = `  if (discountConfig.manualDiscountEnabled) {`;

content = content.replace(oldCheck, newCheck);

// And fix the label line that was referencing migrationFlatDiscount
const oldLabel = `label: migrationFlatDiscount > 0 ? 'Descuento Aplicado' : \`Descuento Especial (\${effectiveManual}%)\`,`;
const newLabel = `label: \`Descuento Especial (\${effectiveManual}%)\`,`;

content = content.replace(oldLabel, newLabel);

fs.writeFileSync('src/utils/pricingCalculator.ts', content);


const fs = require('fs');
let content = fs.readFileSync('src/hooks/usePricingEngine.ts', 'utf8');

content = content.replace("const calculateItemPriceRaw = (item: any, category: string = 'Personal'): number => {", "const calculateItemPriceRaw = (item: any, category: string = 'Personal', accountId?: string): number => {");
content = content.replace("const rawTotal = calculateItemPriceRaw(item, category);", "const rawTotal = calculateItemPriceRaw(item, category, accountId);");

fs.writeFileSync('src/hooks/usePricingEngine.ts', content);

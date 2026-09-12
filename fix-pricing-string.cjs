const fs = require('fs');
let content = fs.readFileSync('src/hooks/usePricingEngine.ts', 'utf8');

const target = `      if (presetData[garmentKey]) {
        const gData = presetData[garmentKey];
        if (typeof gData === 'number') {
          presetPrice = gData;
        } else if (typeof gData === 'object' && gData !== null) {`;

const replacement = `      if (presetData[garmentKey]) {
        const gData = presetData[garmentKey];
        if (typeof gData === 'number') {
          presetPrice = gData;
        } else if (typeof gData === 'string') {
          const parsed = parseFloat(gData);
          if (!isNaN(parsed)) presetPrice = parsed;
        } else if (typeof gData === 'object' && gData !== null) {`;

content = content.replace(target, replacement);
fs.writeFileSync('src/hooks/usePricingEngine.ts', content);

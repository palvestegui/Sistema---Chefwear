const fs = require('fs');
let content = fs.readFileSync('src/hooks/useOrderCreator.ts', 'utf8');

if (!content.includes('normalizeAccountType')) {
  content = content.replace(
    /import \{ ensureCorporateAccountExists, ensureContactExists \} from '\.\.\/utils\/accountContactUtils';/,
    "import { ensureCorporateAccountExists, ensureContactExists } from '../utils/accountContactUtils';\nimport { normalizeAccountType } from '../utils/constants';"
  );
}

content = content.replace(
  /newOrder\.clientType === 'Universidad \/ Instituto'/g,
  "normalizeAccountType(newOrder.clientType) === 'Universidad / Instituto'"
);

content = content.replace(
  /newOrder\.clientType === 'Particular \/ Individuo'/g,
  "normalizeAccountType(newOrder.clientType) === 'Particular / Individuo'"
);

fs.writeFileSync('src/hooks/useOrderCreator.ts', content);

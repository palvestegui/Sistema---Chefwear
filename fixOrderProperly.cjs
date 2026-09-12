const fs = require('fs');
let content = fs.readFileSync('src/hooks/useOrderCreator.ts', 'utf8');

// Update imports
if (!content.includes('normalizeRole')) {
  content = content.replace(
    /import \{ normalizeAccountType \} from '\.\.\/utils\/constants';/,
    "import { normalizeRole } from '../utils/constants';"
  );
}

// Replace the bad role logic
content = content.replace(
  /role: newOrder\.contactRole \|\| \(normalizeAccountType[^)]+\) === 'Universidad \/ Instituto' \? 'ESTUDIANTE' : \(normalizeAccountType[^)]+\) === 'Particular \/ Individuo' \? 'PARTICULAR' : 'OTRO'\)/g,
  "role: normalizeRole(newOrder.contactRole, newOrder.clientType)"
);

fs.writeFileSync('src/hooks/useOrderCreator.ts', content);

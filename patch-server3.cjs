const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const importStatement = `import {
  getSummaryData,
  getReportsData,
  getSellersData,
  getBottlenecksData,
  getOrdersData,
  getQuotesData,
  getDirectoryData,
  handleActionRevertOrder,
  handleActionDeleteQuote,
  handleActionMergeContacts,
  handleActionCreateQuote
} from './src/server/pulseService';\n`;

// Find the start of the helpers block
const startStr = "async function getSummaryData(db: FirebaseFirestore.Firestore) {";
const endStr = "async function startServer() {";

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + content.substring(endIdx);
}

// Prepend the import statement
content = importStatement + content;

// Also remove the types that were moved
const typesStart = "interface OrderData {";
// Actually, let's just use regex to remove the interface OrderData block
const interfacesRegex = /(?:interface OrderData \{[\s\S]*?\}|interface ContactData \{[\s\S]*?\}|interface AccountData \{[\s\S]*?\})/g;
content = content.replace(interfacesRegex, '');
const getDocTypeRegex = /const getDocType = [\s\S]*?;/;
content = content.replace(getDocTypeRegex, '');


fs.writeFileSync('server.ts', content, 'utf8');

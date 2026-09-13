const fs = require('fs');

const path = 'changelog.md';
let changelog = fs.readFileSync(path, 'utf8');

const newEntry = `### Fixed
- Restored missing state declarations for \\\`orderToRevert\\\`, \\\`isReverting\\\`, \\\`quoteToDelete\\\`, and \\\`isDeleting\\\` in \\\`ActiveOrdersList.tsx\\\` and \\\`QuotesList.tsx\\\` that were causing ReferenceErrors during modal invocation.
`;

changelog = changelog.replace("## [Unreleased]", "## [Unreleased]\n" + newEntry);
fs.writeFileSync(path, changelog);
fs.writeFileSync('CHANGELOG.md', changelog);

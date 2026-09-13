const fs = require('fs');
let changelog = fs.readFileSync('changelog.md', 'utf8');
const newEntry = `### Fixed
- Migrated Authentication Provider from \\\`signInWithRedirect\\\` to \\\`signInWithPopup\\\` in \\\`AuthContext.tsx\\\` to resolve cross-domain mobile browser session drops.
- Ensured immediate user profile resolution persists via the \\\`onAuthStateChanged\\\` observer reacting to the synchronous popup resolution.

`;
changelog = changelog.replace('## [Unreleased]', '## [Unreleased]\n' + newEntry);
fs.writeFileSync('changelog.md', changelog);
fs.writeFileSync('CHANGELOG.md', changelog);

const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const mcpImport = "import { setupMcpRoutes } from './src/server/mcp';\n";

const mcpBlockRegex = /app\.get\('\/mcp', \(req, res\) => \{[\s\S]*?res\.json\(\{ jsonrpc: "2\.0", id, error: \{ code: -32603, message: err\.message \} \}\);\s*\}\s*\}\);\s*/g;

content = content.replace(mcpBlockRegex, 'setupMcpRoutes(app, PULSE_KEY, firebaseConfig);\n\n  ');

content = mcpImport + content;

fs.writeFileSync('server.ts', content, 'utf8');

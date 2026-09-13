const fs = require('fs');

let pulse = fs.readFileSync('src/server/pulseService.ts', 'utf8');
pulse = pulse.replace(/import \{ collection.* \} from 'firebase\/firestore';\n/, "");
fs.writeFileSync('src/server/pulseService.ts', pulse);

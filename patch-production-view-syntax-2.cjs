const fs = require('fs');

let code = fs.readFileSync('src/components/views/ProductionView.tsx', 'utf8');

const oldSyntax = `                      )}
        {item.embroideries && item.embroideries.length > 0 && (`;

const newSyntax = `                      )}
                      {item.embroideries && item.embroideries.length > 0 && (`;

code = code.replace(oldSyntax, newSyntax);
fs.writeFileSync('src/components/views/ProductionView.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(
  '<title>Azafrán Chefwear - Order Management</title>',
  '<link rel="icon" type="image/png" href="/favicon.png" />\n    <title>Azafrán Chefwear - Order Management</title>'
);

fs.writeFileSync('index.html', code);

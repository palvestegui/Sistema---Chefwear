const fs = require('fs');
let content = fs.readFileSync('src/components/views/CRMView.tsx', 'utf8');
content = content.replace(
  /import React, \{ useState, useMemo \} from 'react';/,
  "import React, { useState, useMemo, useEffect } from 'react';"
);
fs.writeFileSync('src/components/views/CRMView.tsx', content);

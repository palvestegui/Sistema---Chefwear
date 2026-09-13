const fs = require('fs');

let modal = fs.readFileSync('src/components/modals/ContactProfileModal.tsx', 'utf8');
modal = modal.replace(
  "import { useAuth } from '../../../contexts/AuthContext';",
  "import { useAuth } from '../../contexts/AuthContext';"
);
fs.writeFileSync('src/components/modals/ContactProfileModal.tsx', modal);

let inline = fs.readFileSync('src/components/modals/InlineMergeContactModal.tsx', 'utf8');
inline = inline.replace(
  "import { db } from '../../../firebase';",
  "import { db } from '../../firebase';"
);
inline = inline.replace(
  "import { showSuccessToast, showErrorToast } from '../../../utils/toastUtils';",
  "import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';"
);
inline = inline.replace(
  ".map(d => ({ id: d.id, ...d.data() }))",
  ".map(d => ({ id: d.id, ...(d.data() as any) }))"
);
fs.writeFileSync('src/components/modals/InlineMergeContactModal.tsx', inline);


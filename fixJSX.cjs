const fs = require('fs');

let code = fs.readFileSync('src/components/modals/ContactProfileModal.tsx', 'utf8');

const oldBlock = `          <div className="flex items-center gap-2">
            {onOpenEdit && (`

const newBlock = `          </div>
          <div className="flex items-center gap-2">
            {onOpenEdit && (`

if (code.split(oldBlock).length === 2) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync('src/components/modals/ContactProfileModal.tsx', code);
  console.log("Replaced!");
} else {
  console.log("Could not find block exactly once!");
}

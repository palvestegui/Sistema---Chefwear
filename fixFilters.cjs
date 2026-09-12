const fs = require('fs');

function patchFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(
    /srv.type === 'Costo Adicional' \|\| srv.type === 'Costo Adicional Editable'/g,
    "srv.type === 'Costo Adicional' || srv.type === 'Costo Adicional Editable' || srv.type === 'Escala de Volumen (Logos)'"
  );
  fs.writeFileSync(filename, content);
}

patchFile('src/components/modals/newOrder/OrderSummaryAndCheckout.tsx');
patchFile('src/components/modals/InvoiceModal.tsx');
patchFile('src/components/ui/OrderReceiptDocument.tsx');

console.log('Fixed filters in UI components');

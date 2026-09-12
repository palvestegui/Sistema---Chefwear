const fs = require('fs');

let content = fs.readFileSync('src/components/modals/newOrder/GarmentConfigurator.tsx', 'utf8');

const target = `             if (srv.type === 'Costo Adicional Editable' || srv.price === null || srv.price === undefined) {
                priceLabel = active && customPrice !== null && customPrice !== undefined ? \`+Bs\${customPrice}\` : (srv.type === 'Variante Base' || srv.type === 'Opción de Confección' ? '' : '[Editable]');
             } else {`;

const replace = `             if (srv.type === 'Escala de Volumen (Logos)') {
                priceLabel = active && customPrice !== null && customPrice !== undefined ? \`+Bs\${customPrice}\` : '[Escalado]';
             } else if (srv.type === 'Costo Adicional Editable' || srv.price === null || srv.price === undefined) {
                priceLabel = active && customPrice !== null && customPrice !== undefined ? \`+Bs\${customPrice}\` : (srv.type === 'Variante Base' || srv.type === 'Opción de Confección' ? '' : '[Editable]');
             } else {`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/modals/newOrder/GarmentConfigurator.tsx', content);

console.log('Fixed GarmentConfigurator');

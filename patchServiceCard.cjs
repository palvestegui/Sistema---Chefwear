const fs = require('fs');
let content = fs.readFileSync('src/components/views/settings/ServiceCard.tsx', 'utf8');
content = content.replace(
  '<option value="Variante Base">Variante Base</option>',
  '<option value="Variante Base">Variante Base</option>\n            <option value="Escala de Volumen (Logos)">Escala de Volumen (Logos)</option>'
);

// We need to disable the price input if it's Escala de Volumen, because the price is determined by quantity
const targetPrice = `            <input
              type="number"
              placeholder="[Editable]"
              value={srv.price ?? ''}
              onChange={e => {
                const nVal = e.target.value === '' ? null : parseFloat(e.target.value);
                updateField('price', nVal);
              }}
              className="bg-stone-950 px-3 py-2 rounded-xl w-full text-right font-mono text-amber-400 font-bold outline-none border border-stone-800 focus:border-amber-500 text-xs transition pr-8"
            />`;

const replacePrice = `            <input
              type="number"
              placeholder={srv.type === 'Escala de Volumen (Logos)' ? "[Escalado]" : "[Editable]"}
              value={srv.type === 'Escala de Volumen (Logos)' ? '' : (srv.price ?? '')}
              onChange={e => {
                const nVal = e.target.value === '' ? null : parseFloat(e.target.value);
                updateField('price', nVal);
              }}
              disabled={srv.type === 'Escala de Volumen (Logos)'}
              className={\`bg-stone-950 px-3 py-2 rounded-xl w-full text-right font-mono text-amber-400 font-bold outline-none border border-stone-800 focus:border-amber-500 text-xs transition pr-8 \${srv.type === 'Escala de Volumen (Logos)' ? 'opacity-50 cursor-not-allowed' : ''}\`}
            />`;

content = content.replace(targetPrice, replacePrice);

fs.writeFileSync('src/components/views/settings/ServiceCard.tsx', content);

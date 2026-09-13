const fs = require('fs');

let code = fs.readFileSync('src/components/modals/ContactProfileModal.tsx', 'utf8');

const target = `const TAILORING_12_POINTS = [
  { key: 'F_Hombros', alt: 'hombros', label: 'Hombros', group: 'filipina' },
  { key: 'F_Cuello', alt: 'cuello', label: 'Cuello', group: 'filipina' },
  { key: 'F_Largo_Brazo', alt: 'largoBrazo', label: 'Largo Brazo', group: 'filipina' },
  { key: 'F_Ancho_Brazo', alt: 'anchoBrazo', label: 'Ancho Brazo', group: 'filipina' },
  { key: 'F_Ancho_Torso', alt: 'anchoTorso', label: 'Ancho Torso', group: 'filipina' },
  { key: 'F_Largo_Torso', alt: 'largoTorso', label: 'Largo Torso', group: 'filipina' },
  { key: 'F_Cintura', alt: 'cintura', label: 'Cintura (Filipina)', group: 'filipina' },
  { key: 'F_Cadera', alt: 'cadera', label: 'Cadera (Filipina)', group: 'filipina' },
  { key: 'P_Cintura', alt: 'cintura', label: 'Cintura (Pantalón)', group: 'pantalon' },
  { key: 'P_Cadera', alt: 'cadera', label: 'Cadera (Pantalón)', group: 'pantalon' },
  { key: 'P_Ancho_Pierna', alt: 'anchoPierna', label: 'Ancho Pierna', group: 'pantalon' },
  { key: 'P_Largo_Pierna', alt: 'largoPierna', label: 'Largo Pierna', group: 'pantalon' }
];`;

if (code.includes(target)) {
  code = code.replace(target, "");
  code = code.replace(
    "import { normalizeName } from '../../utils/contactUtils';",
    "import { normalizeName, TAILORING_12_POINTS } from '../../utils/contactUtils';"
  );
  fs.writeFileSync('src/components/modals/ContactProfileModal.tsx', code);
  
  let utils = fs.readFileSync('src/utils/contactUtils.ts', 'utf8');
  utils += "\n\n" + `export const TAILORING_12_POINTS = [
  { key: 'F_Hombros', alt: 'hombros', label: 'Hombros', group: 'filipina' },
  { key: 'F_Cuello', alt: 'cuello', label: 'Cuello', group: 'filipina' },
  { key: 'F_Largo_Brazo', alt: 'largoBrazo', label: 'Largo Brazo', group: 'filipina' },
  { key: 'F_Ancho_Brazo', alt: 'anchoBrazo', label: 'Ancho Brazo', group: 'filipina' },
  { key: 'F_Ancho_Torso', alt: 'anchoTorso', label: 'Ancho Torso', group: 'filipina' },
  { key: 'F_Largo_Torso', alt: 'largoTorso', label: 'Largo Torso', group: 'filipina' },
  { key: 'F_Cintura', alt: 'cintura', label: 'Cintura (Filipina)', group: 'filipina' },
  { key: 'F_Cadera', alt: 'cadera', label: 'Cadera (Filipina)', group: 'filipina' },
  { key: 'P_Cintura', alt: 'cintura', label: 'Cintura (Pantalón)', group: 'pantalon' },
  { key: 'P_Cadera', alt: 'cadera', label: 'Cadera (Pantalón)', group: 'pantalon' },
  { key: 'P_Ancho_Pierna', alt: 'anchoPierna', label: 'Ancho Pierna', group: 'pantalon' },
  { key: 'P_Largo_Pierna', alt: 'largoPierna', label: 'Largo Pierna', group: 'pantalon' }
];`;
  fs.writeFileSync('src/utils/contactUtils.ts', utils);
}

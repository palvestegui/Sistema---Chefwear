/**
 * Utility functions for resolving service applicability across Tab A (Standard garments)
 * and Tab B (Special Presets like UDI Especial and custom contracts).
 */

export interface ServiceItem {
  name: string;
  garment?: string;
  type?: string;
  price?: number | null;
  exclusionGroup?: string;
  isGlobal?: boolean;
  appliesToStandard?: string[];
  appliesToSpecial?: Record<string, string[]>;
}

/**
 * Initializes or normalizes the applicability of a service item.
 * Supports legacy formats (srv.garment === 'Global' or srv.garment === 'Mandil')
 * while enabling granular multi-garment mapping across Tab A and Tab B.
 */
export const normalizeServiceApplicability = (
  srv: any,
  allStandardGarments: string[] = [],
  allSpecialPresets: Record<string, Record<string, any>> = {}
): ServiceItem => {
  const isGlobal = srv.isGlobal === true || srv.garment === 'Global';
  
  let appliesToStandard: string[] = [];
  if (Array.isArray(srv.appliesToStandard)) {
    appliesToStandard = [...srv.appliesToStandard];
  } else if (isGlobal) {
    appliesToStandard = [...allStandardGarments];
  } else if (srv.garment && srv.garment !== 'Global') {
    appliesToStandard = [srv.garment];
  }

  const appliesToSpecial: Record<string, string[]> = {};
  Object.keys(allSpecialPresets).forEach(presetKey => {
    if (srv.appliesToSpecial && Array.isArray(srv.appliesToSpecial[presetKey])) {
      appliesToSpecial[presetKey] = [...srv.appliesToSpecial[presetKey]];
    } else if (isGlobal) {
      appliesToSpecial[presetKey] = Object.keys(allSpecialPresets[presetKey] || {});
    } else if (presetKey === 'UDI Especial' && srv.garment && srv.garment !== 'Global') {
      // Legacy compatibility: if srv was defined for 'Mandil', and UDI has 'Mandil'
      if (allSpecialPresets[presetKey]?.[srv.garment]) {
        appliesToSpecial[presetKey] = [srv.garment];
      }
    }
  });

  return {
    ...srv,
    isGlobal,
    appliesToStandard,
    appliesToSpecial
  };
};

/**
 * Determines if a service is allowed/applicable for a given garment
 * in either Standard mode (Tab A) or Special Preset mode (Tab B).
 */
export const isServiceApplicable = (
  service: any,
  context: {
    garmentName: string;
    presetKey?: string | null;
    isUdiMode?: boolean;
    allStandardGarments?: string[];
    allSpecialPresets?: Record<string, any>;
  }
): boolean => {
  if (!service) return false;

  const { garmentName, presetKey, isUdiMode } = context;
  const isUdiBundle = garmentName === 'Uniforme Completo UDI';
  const effectivePreset = presetKey || (isUdiMode || isUdiBundle ? 'UDI Especial' : null);

  // Case 1: Global Service
  if (service.isGlobal === true || service.garment === 'Global') {
    // If the service has explicit special overrides for the active preset
    if (effectivePreset && service.appliesToSpecial && service.appliesToSpecial[effectivePreset]) {
      const allowedInPreset = service.appliesToSpecial[effectivePreset];
      if (Array.isArray(allowedInPreset)) {
        if (allowedInPreset.length === 0) return false;
        if (isUdiBundle) return true;
        return allowedInPreset.some(g => g.toLowerCase() === garmentName.toLowerCase());
      }
    }
    // If it has explicit standard overrides for Tab A
    if (!effectivePreset && service.appliesToStandard && Array.isArray(service.appliesToStandard)) {
      if (service.appliesToStandard.length === 0) return false;
      return service.appliesToStandard.some(g => g.toLowerCase() === garmentName.toLowerCase());
    }
    return true;
  }

  // Case 2: Special Preset context (Tab B) or Uniforme Completo UDI
  if (effectivePreset) {
    if (service.appliesToSpecial && Array.isArray(service.appliesToSpecial[effectivePreset])) {
      const allowedList = service.appliesToSpecial[effectivePreset];
      if (isUdiBundle) {
        // Uniforme Completo UDI combines all garments in the preset:
        // Any service applicable to ANY garment of the preset is applicable to the bundle!
        return allowedList.length > 0;
      }
      return allowedList.some(g => g.toLowerCase() === garmentName.toLowerCase());
    }

    // Fallback for legacy UDI presets
    if (effectivePreset === 'UDI Especial' || isUdiMode || isUdiBundle) {
      const defaultUdi = [
        'Tiros sencillos (estándar)',
        'Tiros cruzados',
        'Regulador de Cuero',
        'Regulador de Argolla de Metal',
        'Nombre en el bolsillo',
        'Jogger',
        'Botón/Cierre'
      ];
      if (defaultUdi.some(u => u.toLowerCase() === (service.name || '').toLowerCase())) {
        if (!service.garment || service.garment === 'Global' || isUdiBundle || service.garment.toLowerCase() === garmentName.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  // Case 3: Standard Tab A context
  if (service.appliesToStandard && Array.isArray(service.appliesToStandard)) {
    return service.appliesToStandard.some(g => g.toLowerCase() === garmentName.toLowerCase());
  }

  // Legacy fallback based on srv.garment
  if (service.garment === 'Global' || (service.garment && service.garment.toLowerCase() === garmentName.toLowerCase())) {
    return true;
  }

  return false;
};

/**
 * Returns a human-friendly summary text of where the service applies.
 */
export const getApplicabilitySummary = (
  service: any,
  standardGarments: string[] = [],
  specialPresets: Record<string, any> = {}
): string => {
  if (service.isGlobal === true || service.garment === 'Global') {
    return 'Todas las prendas (Global Tab A & Tab B)';
  }

  const parts: string[] = [];

  const stdList = service.appliesToStandard || (service.garment && service.garment !== 'Global' ? [service.garment] : []);
  if (stdList.length > 0) {
    if (stdList.length === standardGarments.length && standardGarments.length > 0) {
      parts.push('Tab A (Todas)');
    } else {
      parts.push(`Tab A: ${stdList.join(', ')}`);
    }
  }

  const specMap = service.appliesToSpecial || {};
  Object.entries(specMap).forEach(([pKey, gList]) => {
    const list = gList as string[];
    if (list && list.length > 0) {
      const allForPreset = Object.keys(specialPresets[pKey] || {});
      if (allForPreset.length > 0 && list.length === allForPreset.length) {
        parts.push(`${pKey} (Todas)`);
      } else {
        parts.push(`${pKey}: ${list.join(', ')}`);
      }
    }
  });

  if (parts.length === 0) {
    return 'Ninguna prenda seleccionada';
  }

  return parts.join(' | ');
};

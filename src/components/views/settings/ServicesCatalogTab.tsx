import React, { useState, useMemo } from 'react';
import { Plus, Globe, Layers, Search, X, Trash2, Sliders, CheckCircle2 } from 'lucide-react';
import { ServiceAppliesToModal } from './ServiceAppliesToModal';
import { getApplicabilitySummary } from '../../../utils/serviceUtils';

export interface ServiceItemData {
  name?: string;
  type?: string;
  price?: number | null;
  exclusionGroup?: string;
  isGlobal?: boolean;
  garment?: string;
  appliesToStandard?: string[];
  appliesToSpecial?: Record<string, string[]>;
  [key: string]: unknown;
}

export interface ServicesCatalogTabProps {
  settingsForm: {
    services?: ServiceItemData[];
    garments?: Record<string, unknown>;
    specialPresets?: Record<string, Record<string, unknown>>;
    udiPricing?: Record<string, unknown>;
    [key: string]: unknown;
  };
  setSettingsForm: React.Dispatch<React.SetStateAction<unknown>>;
}

type ServiceCategoryKey = 'ALL' | 'FILIPINAS' | 'MANDILES' | 'PANTALONES' | 'GORROS' | 'BORDADOS' | 'OTROS';

const CATEGORY_FILTERS: Array<{ key: ServiceCategoryKey; label: string }> = [
  { key: 'ALL', label: 'Todos' },
  { key: 'FILIPINAS', label: 'Filipinas' },
  { key: 'MANDILES', label: 'Mandiles' },
  { key: 'PANTALONES', label: 'Pantalones' },
  { key: 'GORROS', label: 'Gorros' },
  { key: 'BORDADOS', label: 'Bordados & Logos' },
  { key: 'OTROS', label: 'Especiales / Otros' },
];

const normalizeText = (text: string | undefined | null): string => {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

const matchesCategory = (srv: ServiceItemData, category: ServiceCategoryKey): boolean => {
  if (category === 'ALL') return true;

  const name = normalizeText(srv.name);
  const garment = normalizeText(srv.garment);
  const group = normalizeText(srv.exclusionGroup);
  const stdList = Array.isArray(srv.appliesToStandard)
    ? srv.appliesToStandard.map(normalizeText)
    : [];

  const isBordado =
    srv.type === 'Escala de Volumen (Logos)' ||
    name.includes('bordad') || name.includes('logo') || name.includes('matriz') ||
    name.includes('estampad') || name.includes('vinil') || name.includes('ponchad') ||
    group.includes('bordad') || group.includes('logo');

  if (category === 'BORDADOS') {
    return isBordado;
  }

  const isGorro =
    name.includes('gorro') || name.includes('cofia') || name.includes('bandana') ||
    name.includes('boina') || name.includes('toca') || garment.includes('gorro') || garment.includes('cofia') ||
    (stdList.length > 0 && stdList.some(g => g.includes('gorro') || g.includes('cofia')));

  if (category === 'GORROS') {
    return isGorro;
  }

  const isPantalon =
    name.includes('pantalon') || name.includes('jogger') || name.includes('pretina') ||
    garment.includes('pantalon') ||
    (stdList.length > 0 && stdList.some(g => g.includes('pantalon')));

  if (category === 'PANTALONES') {
    return isPantalon;
  }

  const isMandil =
    name.includes('mandil') || name.includes('delantal') || name.includes('tiro') ||
    name.includes('argolla') || name.includes('cuero') || name.includes('regulador') ||
    garment.includes('mandil') || group.includes('tiro') ||
    (stdList.length > 0 && stdList.some(g => g.includes('mandil')));

  if (category === 'MANDILES') {
    return isMandil;
  }

  const isFilipina =
    name.includes('filipina') || name.includes('manga') || name.includes('cuello') ||
    name.includes('pechera') || name.includes('broche') || name.includes('vivo') ||
    garment.includes('filipina') || group.includes('manga') || group.includes('cuello') ||
    (stdList.length > 0 && stdList.some(g => g.includes('filipina')));

  if (category === 'FILIPINAS') {
    return isFilipina;
  }

  if (category === 'OTROS') {
    const isSpecific = isBordado || isGorro || isPantalon || isMandil || isFilipina;
    const isExplicitlyOther =
      srv.isGlobal === true ||
      srv.garment === 'Global' ||
      Boolean(srv.appliesToSpecial && Object.keys(srv.appliesToSpecial).length > 0) ||
      srv.type === 'Variante Base';
    return !isSpecific || isExplicitlyOther;
  }

  return true;
};

export const ServicesCatalogTab: React.FC<ServicesCatalogTabProps> = ({
  settingsForm,
  setSettingsForm
}) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryKey>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

  const standardGarments = Object.keys(settingsForm.garments || {});
  const specialPresets = (settingsForm.specialPresets || { "UDI Especial": settingsForm.udiPricing || {} }) as Record<string, Record<string, unknown>>;
  const allServices: ServiceItemData[] = settingsForm.services || [];

  const updateServiceField = (originalIndex: number, field: string, value: unknown) => {
    const updated = [...allServices];
    updated[originalIndex] = {
      ...updated[originalIndex],
      [field]: value
    };
    setSettingsForm((prev: unknown) => {
      const prevObj = (typeof prev === 'object' && prev !== null ? prev : {}) as Record<string, unknown>;
      return { ...prevObj, services: updated };
    });
  };

  const handleAddService = () => {
    const newService: ServiceItemData = {
      name: 'Nuevo Servicio Adicional',
      type: 'Costo Adicional',
      price: null,
      exclusionGroup: '',
      isGlobal: true,
      garment: 'Global',
      appliesToStandard: [...standardGarments],
      appliesToSpecial: Object.keys(specialPresets).reduce<Record<string, string[]>>((acc, pKey) => {
        acc[pKey] = Object.keys(specialPresets[pKey] || {});
        return acc;
      }, {})
    };

    const updated = [newService, ...allServices];
    setSettingsForm((prev: unknown) => {
      const prevObj = (typeof prev === 'object' && prev !== null ? prev : {}) as Record<string, unknown>;
      return { ...prevObj, services: updated };
    });
    setSelectedServiceIndex(0);
  };

  const handleDeleteService = (idx: number) => {
    const updated = [...allServices];
    updated.splice(idx, 1);
    setSettingsForm((prev: unknown) => {
      const prevObj = (typeof prev === 'object' && prev !== null ? prev : {}) as Record<string, unknown>;
      return { ...prevObj, services: updated };
    });
    if (selectedServiceIndex === idx) {
      setSelectedServiceIndex(null);
    }
    setConfirmDeleteIdx(null);
  };

  const filteredServices = useMemo(() => {
    const term = normalizeText(searchTerm);

    return allServices
      .map((srv, originalIndex) => ({ srv, originalIndex }))
      .filter(({ srv }) => {
        if (!matchesCategory(srv, activeCategory)) {
          return false;
        }

        if (!term) return true;

        const nameNorm = normalizeText(srv.name);
        const groupNorm = normalizeText(srv.exclusionGroup);
        const typeNorm = normalizeText(srv.type);
        const garmentNorm = normalizeText(srv.garment);
        const stdList = Array.isArray(srv.appliesToStandard) ? srv.appliesToStandard.map(normalizeText).join(' ') : '';
        const specList = srv.appliesToSpecial ? Object.values(srv.appliesToSpecial).flat().map(normalizeText).join(' ') : '';

        return (
          nameNorm.includes(term) ||
          groupNorm.includes(term) ||
          typeNorm.includes(term) ||
          garmentNorm.includes(term) ||
          stdList.includes(term) ||
          specList.includes(term)
        );
      });
  }, [allServices, activeCategory, searchTerm]);

  return (
    <div className="animate-in fade-in space-y-5">
      {/* Unified Search & Category Filter Toolbar */}
      <div className="bg-stone-900/60 p-3 sm:p-4 rounded-2xl border border-stone-800/90 shadow-sm space-y-3">
        {/* Row 1: Search Input (bounded width) & + Nuevo Servicio Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80 md:w-96 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, grupo excluyente, prenda o tipo..."
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 font-medium outline-none transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-500 hover:text-stone-200 rounded-lg transition cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddService}
            className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer self-end sm:self-auto"
          >
            <Plus size={15} /> Nuevo Servicio
          </button>
        </div>

        {/* Row 2: Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_FILTERS.map(cat => {
            const isSelected = activeCategory === cat.key;
            const label = cat.key === 'ALL' ? `Todos (${allServices.length})` : cat.label;
            return (
              <button
                key={cat.key}
                type="button"
                id={`filter-pill-${cat.key.toLowerCase()}`}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                    : 'bg-stone-950/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 border border-stone-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter / Search Status summary */}
      {(searchTerm || activeCategory !== 'ALL') && (
        <div className="flex items-center justify-between px-2 text-xs font-bold text-stone-400">
          <span>
            Mostrando <strong className="text-amber-400">{filteredServices.length}</strong> de {allServices.length} servicios
            {searchTerm && <span> para &ldquo;<span className="text-stone-200">{searchTerm}</span>&rdquo;</span>}
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('ALL');
            }}
            className="text-amber-500 hover:underline text-[11px] font-black uppercase tracking-wider cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* Services in Compact 2-Column Responsive Grid */}
      {filteredServices.length === 0 ? (
        <div className="p-12 text-center text-stone-500 text-xs italic bg-stone-950/60 rounded-3xl border border-stone-850 flex flex-col items-center justify-center gap-2">
          <Search size={24} className="text-stone-600 mb-1" />
          <p className="font-bold text-stone-400">No se encontraron servicios adicionales.</p>
          <p className="text-stone-600">Intenta con otro término de búsqueda o cambia la categoría seleccionada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {filteredServices.map(({ srv, originalIndex }) => {
            const summary = getApplicabilitySummary(srv, standardGarments, specialPresets);
            const isGlobal = srv.isGlobal === true || srv.garment === 'Global';

            return (
              <div
                key={`${srv.name || 'srv'}-${originalIndex}`}
                id={`service-card-${originalIndex}`}
                className="bg-stone-900/80 border border-stone-800 hover:border-stone-700/90 rounded-2xl p-3 shadow-sm flex flex-col justify-between gap-2.5 transition-all group relative"
              >
                {/* Compact Header: Service Number Badge, Name, Exclusion Group chip, and Delete Action */}
                <div className="flex items-center gap-2">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-black text-[11px] flex items-center justify-center">
                    #{originalIndex + 1}
                  </span>

                  <div className="flex-1 min-w-0 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={srv.name || ''}
                      onChange={e => updateServiceField(originalIndex, 'name', e.target.value)}
                      className="bg-stone-950/90 border border-stone-800/80 focus:border-amber-500/80 px-2.5 py-1.5 rounded-xl font-bold text-stone-100 outline-none text-xs flex-1 transition placeholder:text-stone-600 truncate"
                      placeholder="Nombre del servicio..."
                    />
                    <div className="relative shrink-0 w-24 sm:w-28" title="Grupo Excluyente (ej. TIPO, MANGA, CUELLO)">
                      <input
                        type="text"
                        value={srv.exclusionGroup || ''}
                        onChange={e => updateServiceField(originalIndex, 'exclusionGroup', e.target.value.toUpperCase())}
                        className={`bg-stone-950/90 border px-2 py-1.5 rounded-xl text-[10px] font-black uppercase outline-none w-full transition placeholder:text-stone-600 placeholder:normal-case truncate ${
                          srv.exclusionGroup
                            ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                            : 'border-stone-800/80 text-stone-400 hover:border-stone-700'
                        }`}
                        placeholder="Grupo (ej. TIPO)"
                      />
                    </div>
                  </div>

                  {confirmDeleteIdx === originalIndex ? (
                    <div className="flex items-center gap-1 bg-red-950/90 border border-red-800/80 px-2 py-0.5 rounded-xl animate-in fade-in shrink-0">
                      <span className="text-[10px] font-black text-red-300">¿Borrar?</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(originalIndex)}
                        className="bg-red-600 hover:bg-red-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded transition cursor-pointer"
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteIdx(null)}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-400 text-[9px] font-bold uppercase px-1 py-0.5 rounded transition cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteIdx(originalIndex)}
                      className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-stone-800/80 rounded-xl transition shrink-0 cursor-pointer"
                      title="Eliminar este servicio"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Horizontal Row: Compatible Garments tag, Service Type badge/selector, and Price input (Bs) */}
                <div className="flex items-center gap-2 pt-1 border-t border-stone-800/60">
                  {/* Compatible Garments tag */}
                  <button
                    type="button"
                    onClick={() => setSelectedServiceIndex(originalIndex)}
                    className={`flex-1 min-w-0 text-left px-2.5 py-1.5 rounded-xl border transition flex items-center justify-between gap-1.5 group/btn cursor-pointer ${
                      isGlobal
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-300 hover:border-amber-500/60'
                        : 'bg-stone-950/90 border-stone-800/80 text-stone-300 hover:border-stone-700 hover:text-white'
                    }`}
                    title={`Prendas Compatibles: ${summary}`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {isGlobal ? (
                        <Globe size={12} className="text-amber-400 shrink-0" />
                      ) : (
                        <Layers size={12} className="text-amber-500 shrink-0" />
                      )}
                      <span className="text-[10px] font-bold truncate">
                        {summary}
                      </span>
                    </div>
                    <Sliders size={11} className="text-stone-500 group-hover/btn:text-amber-400 shrink-0" />
                  </button>

                  {/* Service Type badge / select */}
                  <div className="shrink-0 w-28 sm:w-32">
                    <select
                      value={srv.type || 'Costo Adicional'}
                      onChange={e => updateServiceField(originalIndex, 'type', e.target.value)}
                      className="w-full bg-stone-950/90 text-[10px] font-bold text-stone-200 px-2 py-1.5 rounded-xl border border-stone-800/80 outline-none truncate hover:border-stone-700 focus:border-amber-500/50 transition cursor-pointer"
                      title={srv.type || 'Costo Adicional'}
                    >
                      <option value="Costo Adicional">Costo Adicional</option>
                      <option value="Opción de Confección">Opción Confección</option>
                      <option value="Costo Adicional Editable">Costo Editable</option>
                      <option value="Variante Base">Variante Base</option>
                      <option value="Escala de Volumen (Logos)">Escala Logos</option>
                    </select>
                  </div>

                  {/* Price Input (Bs) */}
                  <div className="relative shrink-0 w-20 sm:w-24">
                    <input
                      type="number"
                      placeholder={srv.type === 'Escala de Volumen (Logos)' ? "Escala" : "0"}
                      value={srv.type === 'Escala de Volumen (Logos)' ? '' : (srv.price ?? '')}
                      onChange={e => {
                        const nVal = e.target.value === '' ? null : parseFloat(e.target.value);
                        updateServiceField(originalIndex, 'price', nVal);
                      }}
                      disabled={srv.type === 'Escala de Volumen (Logos)'}
                      className={`bg-stone-950/90 px-2 py-1.5 rounded-xl w-full text-right font-mono text-amber-400 font-bold outline-none border border-stone-800/80 focus:border-amber-500 text-xs transition pr-6 ${
                        srv.type === 'Escala de Volumen (Logos)' ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-500 font-mono pointer-events-none">
                      Bs
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Save Bar for Immediate Action */}
      <div className="sticky bottom-3 z-20 bg-stone-900/95 backdrop-blur-md p-3 rounded-2xl border border-amber-500/30 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong className="text-white">{filteredServices.length}</strong> de <strong className="text-amber-400">{allServices.length}</strong> servicios
          </span>
        </div>
        <button
          type="submit"
          id="btn-save-services-sticky"
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
        >
          <CheckCircle2 size={15} /> Guardar Servicios
        </button>
      </div>

      {/* Target Items Modal */}
      {selectedServiceIndex !== null && allServices[selectedServiceIndex] && (
        <ServiceAppliesToModal
          service={allServices[selectedServiceIndex]}
          serviceIndex={selectedServiceIndex}
          settingsForm={settingsForm}
          setSettingsForm={setSettingsForm as unknown as React.Dispatch<React.SetStateAction<unknown>>}
          onClose={() => setSelectedServiceIndex(null)}
        />
      )}
    </div>
  );
};


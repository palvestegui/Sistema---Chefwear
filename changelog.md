# Changelog

All notable changes and architectural updates to Azafrán Chefwear are documented here.

## [Fix Parent Account Auto-Population & Preserve Selection Intent] - 2026-09-11
### Fixed / Refactored
- **Eliminated Auto-Selection of First Account on Category Change (`CustomerSection.tsx`)**:
  - Removed arbitrary `matchingAccounts[0]` selection logic when changing client categories (`clientType` / `tipoCliente`).
  - Category changes now exclusively filter dropdown options without imposing any account into state.
- **Default to 'Crear Nueva Empresa' for Unknown/New Clients**:
  - For new sales/quotes without an explicitly linked registered contact or account, `accountId` defaults to `'create_new'` (rendered as `+ Crear nueva empresa` in the dropdown).
  - Explicit company name input field automatically renders when `create_new` is active.
- **Preserved Explicit Selection Intent**:
  - If a user explicitly selects an existing account (or previously opted for `+ Crear nueva empresa`), subsequent category changes preserve that selection and do not wipe or overwrite it.
  - Accounts explicitly selected remain available and selected in the dropdown even if outside the active category filter.
- **Audited Contact Resolution Fallback (`contactResolution.ts`)**:
  - Removed `matchingAccounts[0]` fallback when resolving contacts having only a raw category without an explicit account assignment.

### Architecture & Compliance
- Adhered strictly to Rule 300 / Rule 500 limits:
  - `CustomerSection.tsx`: 414 lines (< 500 limit).
  - `contactResolution.ts`: 245 lines (< 300 limit).
- Type Safety & Verification: `lint_applet` (0 errors) and `compile_applet` passed cleanly.


## [NewOrderModal Desktop Widescreen Unclamp (1560px) & Grid Scaling] - 2026-09-11
### Redesigned / Refactored
- **Desktop Modal Container Unclamp (`NewOrderModal.tsx`)**:
  - Expanded modal card geometry to `w-full h-full lg:h-auto lg:max-h-[92vh] lg:w-[96vw] lg:max-w-[1560px] rounded-none lg:rounded-2xl m-0 lg:m-auto p-3 sm:p-4 lg:p-6 bg-stone-950 border-0 lg:border lg:border-stone-800`.
  - Replaced backdrop container classes with `fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 lg:p-4 overflow-hidden`, maximizing usable horizontal screen real estate.
- **Natural Grid Scaling Across Widescreen Viewport**:
  - Internal 12-column grid (`grid grid-cols-1 lg:grid-cols-12 gap-6`) spans smoothly up to 1560px width:
    - Left Column (Form, Customer, Garment Configurator, Notes): `lg:col-span-7 xl:col-span-7`.
    - Right Column (Cart, Summary, Total, Checkout): `lg:col-span-5 xl:col-span-5`.
- **Mobile Invariance**:
  - Preserved complete full-bleed edge-to-edge layout on mobile (<1024px) with single-row 32px header and slim scrollbars.

### Architecture & Compliance
- Verified strict line count compliance: `NewOrderModal.tsx` (362 lines < 500 limit).
- Verified type safety and clean build: `lint_applet` (0 errors) and `compile_applet` (success).

## [NewOrderModal Desktop Max-W-6xl Workspace & Mobile Decoupling] - 2026-09-11
### Redesigned / Refactored
- **Decoupled Desktop vs. Mobile Modal Viewport (`NewOrderModal.tsx`)**:
  - Restored expansive Tier 1 Workspace responsive sizing for desktop screens (`lg:max-w-6xl lg:h-auto lg:max-h-[90vh] lg:rounded-2xl lg:m-auto lg:p-6 lg:border lg:border-stone-800`), eliminating the restrictive `sm:max-w-3xl` constraint while maintaining full-bleed edge-to-edge on mobile (`w-full h-full rounded-none m-0 p-3 sm:p-4 bg-stone-950 border-0`).
  - Adjusted backdrop padding to seamlessly center the modal on desktop (`p-0 lg:p-6 flex items-center justify-center`).
- **Restored 2-Column Desktop Grid Spacing (`NewOrderModal.tsx`)**:
  - Enforced `grid grid-cols-1 lg:grid-cols-12 gap-6` internal split layout:
    - Left Column (Form, Customer, Configurator, Notes): `lg:col-span-7 xl:col-span-7 space-y-2.5 sm:space-y-4`.
    - Right Column (Cart, Summary, Total, Checkout): `lg:col-span-5 xl:col-span-5 space-y-4`.
  - Re-established wide horizontal clearance for 2-column dropdowns ("Particular / Individuo", "Cargo Específico") without text clipping or truncated labels.
- **Preserved Mobile Optimizations**:
  - Retained single-row 32px mobile header with unified segmented mode toggle, backdating trigger, and close button, while keeping the explicit title visible on desktop (`hidden lg:block`).

### Architecture & Compliance
- Verified strict line count compliance: `NewOrderModal.tsx` (362 lines < 500 limit).
- Verified type safety and clean build: `lint_applet` (0 errors) and `compile_applet` (success).

## [NewOrderModal & CustomerSection Mobile Edge-to-Edge & Vertical Compression] - 2026-09-11
### Redesigned / Refactored
- **Full-Bleed Edge-to-Edge Mobile Viewport (`NewOrderModal.tsx`)**:
  - Replaced outer lateral margins and padding on mobile screens (<640px) with `w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl rounded-none sm:rounded-2xl m-0 p-3 sm:p-6 bg-stone-950 border-0 sm:border sm:border-stone-800`.
  - Added custom scrollbar utilities (`scrollbar-thin` and `no-scrollbar` in `src/index.css`) to eliminate thick native scrollbars.
- **Single-Row Unified Mobile Header (`NewOrderModal.tsx`)**:
  - Hidden redundant headline text on mobile (`hidden sm:block`) and unified the mode toggle segmented pill, backdate button, and close icon into a single horizontal row.
- **Compact 2-Column Customer Inputs (`CustomerSection.tsx`)**:
  - Replaced stacked rows for "Tipo de Cliente (Categoría)" and "Cargo Específico" with a responsive 2-column grid (`grid grid-cols-2 gap-2`).
  - Tightened form vertical rhythm (`space-y-2.5 sm:space-y-4 mb-3`).
- **Streamlined Institutional Order Toggle (`CustomerSection.tsx`)**:
  - Converted the institutional roster section into a clean single-line toggle row (`flex items-center justify-between py-2 px-3 bg-stone-900/50 rounded-xl border border-stone-800/80`).
  - Removed verbose subtitle ("Compra masiva centralizada con nómina individual y tallas por empleado"), retaining the direct switch and animated roster chip.
- **Ultra-Compact Vendedor Asignado Row**:
  - Minified SuperAdmin seller row padding to `py-1` with `gap-1.5` and `text-xs`.

### Architecture & Compliance
- Verified strict line count compliance: `NewOrderModal.tsx` (360 lines < 500 limit), `CustomerSection.tsx` (393 lines < 500 limit).
- Verified type safety and clean build: `lint_applet` (0 errors) and `compile_applet` (success).

## [NewOrderModal Header De-bloating & Seller Lockdown] - 2026-09-11
### Redesigned / Refactored
- **Compact Header & Discreet Toggle (`NewOrderModal.tsx`)**:
  - Replaced oversized title and verbose explanatory subtitles ("MODO COTIZACIÓN: VALIDACIONES RELAJADAS..." / "MODO ORDEN ACTIVA: VALIDACIONES ACTIVAS...") with a sleek, compact title (`text-sm sm:text-base font-black uppercase tracking-wider text-stone-200`).
  - Redesigned mode selector into a discreet segmented toggle (`bg-stone-900/80 p-0.5 rounded-lg border border-stone-800 text-xs font-bold`) with active Cotización (`bg-stone-800 text-stone-200`) and active Orden Activa (`bg-amber-500 text-stone-950 font-black`).
  - Aligned title, historical toggle, mode selector, and close button on a single tidy header line, reclaiming vertical viewport space.
- **Lock & Minimize 'Vendedor Asignado' (`CustomerSection.tsx`, `AuthContext.tsx`, `sellerUtils.ts`, `useOrderState.ts`, `useOrderSubmission.ts`)**:
  - Gated seller assignment strictly behind `isSuperAdmin` permission.
  - Standard sellers (e.g., Matias, staff): The entire `Vendedor Asignado` card and selector are suppressed from rendering in the DOM. Order initialization and submission silently default to the authenticated user (`currentUser.uid` / `currentUser.displayName`).
  - SuperAdmin: Removed the bulky card container, avatar circle, and 'COMISIONES' badge; replaced it with a sleek, low-profile inline row directly above the customer inputs with a discreet dropdown selector for creating orders on behalf of team members.
  - Added first-class `isSuperAdmin` to `AuthContext` and enforced attribution resolution in `sellerUtils.ts`.

### Architecture & Compliance
- Strict line count compliance verified: `NewOrderModal.tsx` (359 lines < 500), `CustomerSection.tsx` (396 lines < 500), `sellerUtils.ts` (123 lines < 300), `useOrderState.ts` (72 lines < 300), `useOrderSubmission.ts` (291 lines < 300), `AuthContext.tsx` (124 lines < 300).
- Zero TypeScript diagnostics (`tsc --noEmit` passed cleanly) and production build verified via `compile_applet`.

## [Ajustes Layout Cleanup & Button Ergonomics] - 2026-09-11
### Redesigned / Refactored
- **ServicesCatalogTab Toolbar Unification**:
  - Removed top hero container ("CATÁLOGO DE SERVICIOS ADICIONALES (BS)" title banner, subtitle, and detached "+ NUEVO SERVICIO" button).
  - Elevated search and filter container to the top as a unified 2-row toolbar: Row 1 features a bounded search input (`w-full sm:w-80 md:w-96 max-w-sm`) paired with the "+ Nuevo Servicio" button aligned to the right; Row 2 houses horizontal category filter pills.
  - Updated bottom sticky action button label from "Actualizar Precios Globales" to "Guardar Servicios".
- **DiscountRulesTab Sticky Action Bar & Ergonomics**:
  - Replaced full-width wall-to-wall save button with an ergonomic sticky bottom action bar matching the design in Servicios.
  - Added pending change sentinel: save button is disabled (`disabled:opacity-40 disabled:cursor-not-allowed`) when no unsaved changes exist in discount policies.
  - Replaced giant submit button in `SettingsView.tsx` for base pricing and specials with a compact, right-aligned action button.
- **De-bloated Subtitle Text**:
  - Removed explanatory subtitle text under toggles in `TierVolumeDiscountEditor.tsx` and `TierDiscountRulesCard.tsx` (B2B warning, volume disabled notice, slider limit note, full package explanation), retaining clear titles and direct inputs.

### Architecture & Compliance
- Strict line count compliance verified: `ServicesCatalogTab.tsx` (467 lines < 500), `TierDiscountRulesCard.tsx` (300 lines < 500), `TierVolumeDiscountEditor.tsx` (110 lines < 500), `DiscountRulesTab.tsx` (179 lines < 500), `SettingsView.tsx` (193 lines < 500).
- Zero TypeScript diagnostics (`tsc --noEmit` passed cleanly) and production build verified via `compile_applet`.

## [Pass 5] - 2026-09-11
### Added / Migrated
- **Sidebar Settings Navigation**: Migrated Ajustes tab navigation into `SidebarNav.tsx` as an expandable accordion group with 5 discrete sub-items ("Tarifario Base", "Especiales", "Servicios", "Descuentos", "Roles & Usuarios").
- **Security Gating**:
  - Gated "Roles & Usuarios" in the sidebar and settings view exclusively to `canManageRoles || isSuperAdmin`.
  - Restricted "Registro Histórico" backdating mode and migration discount in `NewOrderModal.tsx` strictly to `isSuperAdmin === true`.
- **Validation Sentinels**: Added pulsating error indicators in the sidebar next to "Tarifario Base" and "Especiales" when invalid price inputs exist.
- **Global Settings Synchronization**: Wired `settingsTab` state through `App.tsx` and `MainLayout.tsx` down to `SettingsView.tsx` with dynamic breadcrumbs.

### Removed / De-bloated
- **SettingsView Horizontal Strip**: Liquidated redundant tab button strip in `SettingsView.tsx`.
- **PriceReference Hero Banner**: Eliminated oversized header card in `PriceReference.tsx`; replaced with a single responsive 40px toolbar containing garment counter and real-time search input.
- **SpecialPresetsTab Header Redundancy**: Removed duplicate secondary contract card box in `SpecialPresetsTab.tsx`; aligned preset deletion action alongside selector pills.
- **Text Bloat**: Removed repetitive explanatory guide text from `DiscountRulesTab.tsx` and `TierDiscountRulesCard.tsx`.

### Architecture & Compliance
- Adheres strictly to Rule 300 (logical files) and Rule 500 (visual components).
- Zero usage of `any` in new interfaces and strict TypeScript type-checking.

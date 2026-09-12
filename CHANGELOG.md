# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Feature: SuperAdmin in-app financial adjustment tool on order cards (`OrderFinancialAdjustmentModal.tsx`, `ActiveOrdersList.tsx`, `HistoryView.tsx`)**:
  - Implemented the `OrderFinancialAdjustmentModal` component (< 210 lines, strictly compliant with Rule 300 / Rule 500) enabling SuperAdmins to perform atomic adjustments to `totalPrice`, `manualDiscount`, and `amountCollected`.
  - Added live dynamic calculation of `Saldo` with responsive feedback badge (`Cuenta Balanceada (Bs0.00)` in emerald green when zero).
  - Enforced mandatory audit logging: all adjustments require an explicit justification note, permanently stamped into `order.timestamps` with format `"Ajuste financiero aplicado por SuperAdmin: [auditNote]"`.
  - Integrated `[ ✏️ Ajustar Valores ]` action button under the financial summary section in both `ActiveOrdersList.tsx` and `HistoryView.tsx`.
  - Guarded strictly by `isSuperAdmin` from `useAuth()`, ensuring standard sellers have zero visibility of this administrative utility.

### Fixed
- **Taller Mobile Ergonomics: Overflowing Buttons & Mobile Cards (`ProductionView.tsx`, `OperationsView.tsx`)**:
  - `ProductionView.tsx`: Converted rigid action buttons flex container into a responsive grid (`grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto`), preventing button overflow and text clipping on small mobile viewports.
  - `OperationsView.tsx`: Implemented a two-tier responsive view eliminating horizontal scrolling on mobile:
    * Desktop (`hidden md:block`): Preserved the full-width detailed operations data table.
    * Mobile (`md:hidden`): Rendered each active order as a stacked vertical card complete with Order ID & Seller header, compact garment item chips, 3-column financial summary (Total | Cobrado | Saldo), and stacked full-width touch action buttons (`Material Comprado`, `Ver Recibos`, `Ver Orden`).
  - Strict Rule 500 compliance maintained: `ProductionView.tsx` (196 lines) and `OperationsView.tsx` (308 lines).

### Changed
- **Pass 4B: Ajustes Single-Strip Navigation Consolidation (`SettingsView.tsx`)**:
  - Eliminated the redundant two-tiered navigation (`[ Precios ]` vs `[ Roles ]` block and secondary button strip).
  - Consolidated all navigation into a unified, compact 36px horizontal strip (`Tarifario Base`, `Especiales`, `Servicios`, `Descuentos`, divider, `Roles & Usuarios`).
  - Elevated content forms directly below the unified strip, reducing vertical layout jumping and improving data density.
  - Strict Rule 500 compliance maintained: `SettingsView.tsx` (262 lines).
- **Pass 4A: Reportes Single-Toolbar Refactor & Gmail Table Density (`ReportsView.tsx`)**:
  - Deleted redundant `• EN LÍNEA` status badge and the oversized `REPORTES / ANÁLISIS Y EXPORTACIÓN DE DATOS EN TIEMPO REAL` billboard banner.
  - Fused the two large separate cards (`PERÍODO DE ANÁLISIS` and `CENTRO DE EXPORTACIÓN`) into a single compact responsive 40px action toolbar (`bg-stone-900/60 p-1.5 rounded-xl border border-stone-800`).
  - Integrated timeframe selection pills (`HOY`, `ESTA SEMANA`, `ESTE MES`, `ESTE TRIMESTRE`, `TODO`, `PERSONALIZADO`) on the left and compact export buttons (`Snapshot Completo`, `Exportación Relacional / BI`, `Exportar CSV`) on the right.
  - Formatted the tabs selector (`DASHBOARD`, `REPORTE VENTAS`, `REPORTE PRENDAS`, `CANCELADOS`) into a sleek, compact single-line tab row.
  - Strict Rule 500 compliance maintained: `ReportsView.tsx` reduced from 289 lines down to 257 lines.
- **Final Polish: Gmail-Style Data Density & Menu Cleanup (`MainLayout.tsx`, `CRMView.tsx`, `SettingsView.tsx`)**:
  - `MainLayout.tsx`: Slimmed mobile/tablet top bar from `h-12` (48px) to `h-10` (40px), deleted redundant right user avatar button, and embedded the pulsing emerald online status dot right beside the section title.
  - `CRMView.tsx`: Implemented Gmail-style data density pass. Replaced chunky role badges with clean, muted plain text (`text-xs text-stone-400 font-medium uppercase tracking-wide`), tightened table rows to `py-2.5 px-4`, and used high-signal typography without oversized pill borders for maximum scannability.
  - `SettingsView.tsx`: Liquidated redundant `MANEJADOR DE PRECIOS` title banner and oversized card wrapper, and slimmed the tab bar (`Tarifario Base`, `Especiales`, `Servicios`, `Descuentos`) into a compact single-line button strip.
  - Strict Rule 500 compliance verified: `MainLayout.tsx` (149 lines), `CRMView.tsx` (485 lines), `SettingsView.tsx` (249 lines).
- **Strip Horizontal Pill Strip from SalesView & Wire App.tsx (`App.tsx`, `SalesView.tsx`)**:
  - Connected `ventasTab` and `setVentasTab` from `App.tsx` directly to `<MainLayout ...>` shell.
  - Removed duplicate `Ventas` title and legacy horizontal filter pills strip from `SalesView.tsx`.
  - Replaced view header with a sleek single-line action row featuring the dynamic active section status heading on the left (with timeframe controls when applicable) and the `+ NUEVA COTIZACIÓN` action button on the right.
  - Rendered order cards grid immediately below this single compact line.
  - Ensured strict compliance with Rule 500: `App.tsx` (448 lines) and `SalesView.tsx` (252 lines).
- **Embed Ventas Status Sub-Links into SidebarNav (`MainLayout.tsx`, `SidebarNav.tsx`)**:
  - Threaded `ventasTab` and `setVentasTab` through `MainLayoutProps` down into both desktop and mobile `<SidebarNav />` instances.
  - Rendered clean status sub-links within the `🛒 Ventas` navigation group when expanded and active: Cotizaciones, Órdenes Activas, Entregados, Sin Pendientes, Cancelados, and Expirados, alongside Tallas and Tarifario.
  - Linked each status click to route to `ventas` and set the designated `ventasTab` state seamlessly.
  - Verified strict compliance with Rule 500: `MainLayout.tsx` (161 lines) and `SidebarNav.tsx` (390 lines).
- **Embed Hamburger Toggle & Online Status into SidebarNav (`MainLayout.tsx`, `SidebarNav.tsx`)**:
  - Connected `onToggleCollapse` callback from `MainLayout.tsx` to `SidebarNav.tsx`.
  - Re-anchored the hamburger toggle `[☰]` directly within `SidebarNav`:
    * When expanded (`!isCollapsed`): displays brand header on left and collapse button on right.
    * When collapsed (`isCollapsed`): displays expand toggle centered at the top of the icon rail.
  - Integrated the live connectivity badge (`• En Línea` with pulsing emerald indicator) into the bottom profile dock beside the user's name and role (and as an active status pip in collapsed mode).
  - Maintained strict Rule 500 compliance: `MainLayout.tsx` (153 lines) and `SidebarNav.tsx` (349 lines).
- **Liquidate Desktop Top Bar in MainLayout (`MainLayout.tsx`)**:
  - Relegated the top header bar to mobile viewports only (`lg:hidden`), eliminating the redundant desktop header strip.
  - Allowed desktop `<main>` canvas to begin directly at the top with zero header offset (`flex-1 w-full h-full lg:h-screen overflow-y-auto p-2 sm:p-4`), providing true full vertical space on desktop screens.
  - Verified strict compliance with Rule 500 (152 lines).
- **Sidebar Architecture Step 1: Collapsible Left Sidebar Layout (`MainLayout.tsx`, `SidebarNav.tsx`)**:
  - Replaced the stacked multi-tier horizontal header with a modern, collapsible left sidebar layout inspired by Gmail/Linear, reclaiming 250px+ of vertical space on desktop and eliminating navigation clutter on mobile.
  - **Desktop Persistence**: Configured collapsible sidebar toggled between `w-60` (expanded) and `w-16` (collapsed, icon-only) with state persistence in `localStorage` (`azafran_sidebar_collapsed`).
  - **Mobile Off-Canvas Drawer**: Configured slide-over drawer with backdrop blur (`z-50`) triggered on viewport widths under 1024px.
  - **Sidebar Navigation**: Structured navigation groups for Ventas (with Tallas & Tarifario sub-pills), Taller (with Operaciones, Producción, Logística sub-pills), Directorio, Reportes, Historial, and Ajustes, anchored by an integrated bottom user profile dock with quick logout.
  - **Compact Top Header Bar**: Implemented ultra-compact 48px (`h-12`) single row featuring hamburger toggle `[☰]`, active view breadcrumbs, real-time connectivity status, and user avatar.
  - **Full Vertical Canvas**: Enforced `<main className="flex-1 w-full min-h-[calc(100vh-3rem)] overflow-y-auto p-2 sm:p-4">` allowing children to render with 100% vertical freedom.
  - **Rule 500 Compliance**: Extracted `SidebarNav.tsx` (311 lines) to ensure `MainLayout.tsx` (151 lines) stays far below the 500-line limit.
- **Gmail-Style Full-Bleed Viewport Trim — Eliminate Nested Padding (`MainLayout.tsx`, `SalesView.tsx`, `ReportsView.tsx`, `ProductionView.tsx`, `LogisticsView.tsx`, `OperationsView.tsx`, `CRMView.tsx`, `SettingsView.tsx`, `SizesView.tsx`, `HistoryView.tsx`)**:
  - Eliminated stacked 56px–64px lateral gutters by tightening `MainLayout.tsx` shell margin to native app proportions: `px-2 sm:px-3 pt-2 pb-16` on root container, `px-1 sm:px-2 mb-6 gap-4 pb-4` on header, and zero extra horizontal padding on `<main className="w-full">`.
  - Stripped redundant inner horizontal padding (`px-4 sm:px-6 lg:px-8`) across all 9 views (`SalesView`, `ReportsView`, `ProductionView`, `LogisticsView`, `OperationsView`, `CRMView`, `SettingsView`, `SizesView`, `HistoryView`), delegating boundary control solely to `MainLayout`.
  - Allowed operations tables, report analytics, and sales order card grids to stretch 100% edge-to-edge hugging the screen glass (8px–12px margins) like Gmail, Linear, or native desktop workspaces.
  - Verified that all modified files adhere strictly to Rule 500 limits without architectural regressions.
- **Systemic All-Level Screen Takeover — Full Viewport Freedom (`index.css`, `App.tsx`, `MainLayout.tsx`, `ReportsView.tsx`, `SizesView.tsx`, `HistoryView.tsx`, `ServicesCatalogTab.tsx`, `NewOrderModal.tsx`, `AccountProfileModal.tsx`, `ContactProfileModal.tsx`, `EditAccountModal.tsx`, `EditContactModal.tsx`, `NewAccountModal.tsx`, `NewContactModal.tsx`, `AdvancedExportModal.tsx`)**:
  - **Layer 1: Global DOM & Shell Liberation**:
    * Configured `html, body, #root` in `src/index.css` to `width: 100%; min-height: 100vh; margin: 0; padding: 0; background: #0c0a09;`, completely eliminating centering boilerplate and lateral letterboxing.
    * Removed restrictive `max-w-md` from empty/loading fallbacks in `src/App.tsx`, ensuring the app shell is strictly fluid `w-full min-h-screen`.
    * Upgraded `MainLayout.tsx` header and main wrappers to full-width containers with responsive gutters (`w-full px-2 sm:px-4 lg:px-6`).
  - **Layer 2: 100% Fluid Width across All Views & Sub-Views**:
    * Eliminated restrictive width constraints across `ReportsView.tsx`, `SizesView.tsx`, and `HistoryView.tsx`, wrapping them in unified `w-full px-4 sm:px-6 lg:px-8` containers.
    * Expanded `ServicesCatalogTab.tsx` service card grid to responsive multi-column scaling (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3`), utilizing wide display canvases effortlessly.
  - **Layer 3: Widescreen Modal Cockpit Upgrade**:
    * Standardized all primary modals to the expanded cockpit frame: `w-[95vw] max-w-[1700px] mx-auto max-h-[90vh]` / `h-[92vh]`.
    * Upgraded `NewOrderModal.tsx`, `AccountProfileModal.tsx`, `ContactProfileModal.tsx`, `EditAccountModal.tsx`, `EditContactModal.tsx`, `NewAccountModal.tsx`, `NewContactModal.tsx`, and `AdvancedExportModal.tsx`.
    * Preserved multi-column responsive form arrangements, allowing data fields, logistics sections, and measurement matrices to spread naturally across widescreen displays while retaining mobile touch ergonomics.
  - **Rule 500 Compliance Verified**:
    * All modified components remain strictly below Rule 500 limits: `MainLayout.tsx` (323 lines), `ReportsView.tsx` (485 lines), `SizesView.tsx` (458 lines), `HistoryView.tsx` (256 lines), `ServicesCatalogTab.tsx` (481 lines), `NewOrderModal.tsx` (361 lines), `AccountProfileModal.tsx` (465 lines), `ContactProfileModal.tsx` (485 lines), `EditAccountModal.tsx` (488 lines), `EditContactModal.tsx` (344 lines), `NewAccountModal.tsx` (346 lines), `NewContactModal.tsx` (472 lines), and `AdvancedExportModal.tsx` (360 lines).

- **Permanent Retroactive Order Registration & Backdating (`NewOrderModal.tsx`, `OrderSummaryAndCheckout.tsx`, `useOrderSubmission.ts`)**:
  - Rebranded the former "Modo Migración" into a permanent administrative feature: `🗓️ Registro Histórico (Fechas Personalizadas)`.
  - Added an accessible toggle button directly within `NewOrderModal.tsx`'s header, restricted exclusively to users with `isSuperAdmin` or `isAdmin` privileges.
  - Enabled retroactive backdating for both order creation dates (`createdAt` / `migrationDate`) and initial receipt/payment timestamps (`paymentHistory[0].date` / `customPaymentDate`), with direct flat discount overrides for legacy migrations.
  - Extracted shared hook interfaces into `useOrderSubmissionTypes.ts` ensuring strict compliance with Rule 300 (291 lines in `useOrderSubmission.ts`).
- **Widescreen Modal Expansion to `max-w-5xl` & 2-Column Responsive Form Grids (`AccountProfileModal.tsx`, `ContactProfileModal.tsx`, `EditAccountModal.tsx`, `EditContactModal.tsx`, `NewAccountModal.tsx`, `NewContactModal.tsx`)**:
  - Expanded all primary profile and entity modals to `max-w-5xl w-full max-h-[88vh] overflow-y-auto`, completely removing viewport cramping and eliminating massive empty side-voids on widescreen monitors.
  - Refactored `EditAccountModal.tsx` and `EditContactModal.tsx` from tall single-column vertical stacks into clean 2-column responsive layouts (`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6`):
    * `EditContactModal.tsx`: Left column houses Account ID, linked account selector, full name, contextual role/cargo, contact channels (phone, email), and social networks; Right column houses the complete 12-point tailoring measurement matrix (`Sizing_Matrix_12Pt_CM`).
    * `EditAccountModal.tsx`: Left column houses Account ID, account name, account type, parent account hierarchy, primary contact details, phone/email, and pricing tier; Right column houses logistics/delivery addresses, social networks, and logo/embroidery placement management.
  - Standardized `AccountProfileModal.tsx`, `ContactProfileModal.tsx`, `NewAccountModal.tsx`, and `NewContactModal.tsx` to `max-w-5xl` wrappers with centered positioning and smooth custom scrollbars.
  - Strictly respected Rule 500 across all modified modal components: `AccountProfileModal.tsx` (464 lines), `ContactProfileModal.tsx` (484 lines), `EditAccountModal.tsx` (487 lines), `EditContactModal.tsx` (299 lines), `NewAccountModal.tsx` (345 lines), `NewContactModal.tsx` (394 lines).

### Added
- **Smart Anatomical Waist Autofill Pairing (`NewContactModal.tsx`, `EditContactModal.tsx`)**:
  - Implemented automatic cross-populating between `Cintura (Filipina)` and `Cintura (Pantalón)` during contact creation and modification.
  - Built a manual override guard (`isPantalonWaistOverridden`) preventing auto-synchronization from overwriting intentional, custom adjustments made to the lower garment waistband.
  - Added visual pairing indicators (`Vinculado`) and a one-click `[Re-vincular]` button when overridden, permitting users to restore bidirectional synchronization if desired.
  - Maintained strict Rule 500 compliance: `NewContactModal.tsx` (472 lines) and `EditContactModal.tsx` (343 lines).
- **Editable Mutually Exclusive Groups (`exclusionGroup`) in Services Catalog (`ServicesCatalogTab.tsx`)**:
  - Replaced the static read-only badge with a compact, dedicated text input in each service card header (`placeholder="Grupo (ej. TIPO)"`).
  - Bound directly to `updateServiceField(originalIndex, 'exclusionGroup', e.target.value.toUpperCase())` for instantaneous state updates and persistence.
  - Implemented high-contrast amber active styling (`border-amber-500/50 text-amber-400 bg-amber-500/10`) when a service is assigned to an exclusion group (such as `TIPO`, `MANGA`, `CUELLO`).

### Removed
- **Decommissioned Developer Reset Tools & Test Seeding (`SettingsView.tsx`, `CRMView.tsx`)**:
  - Completely disarmed and removed `DangerZoneSection` and the destructive database purge tab ("Sistema" / "Zona de Peligro") from `SettingsView.tsx`, preventing accidental data loss in production.
  - Removed the development test seeding button (`SEED UDI`) and its associated trigger from the directory action bar in `CRMView.tsx`.
- **Redundant Global Pricing Update Button in Tab C (`SettingsView.tsx`)**:
  - Conditioned the static bottom submit button in `SettingsView.tsx` with `activeSettingsTab !== 'C'`, eliminating the duplicate button and retaining solely the sticky floating save bar in Tab C.

### Changed
- **Fluid Edge-to-Edge Responsive Layout Overhaul — Phase 1, Paso 1.1 (`MainLayout.tsx`, `SalesView.tsx`, `ProductionView.tsx`, `LogisticsView.tsx`, `OperationsView.tsx`, `CRMView.tsx`, `SettingsView.tsx`)**:
  - Stripped restrictive fixed and bounded wrappers (`max-w-5xl`, `max-w-6xl`, `max-w-7xl mx-auto`) from top-level application view containers and `MainLayout.tsx` header/main frames.
  - Implemented unified, fluid edge-to-edge root wrappers (`w-full px-4 sm:px-6 lg:px-8`) across Ventas (`SalesView.tsx`), Taller Producción (`ProductionView.tsx`), Logística (`LogisticsView.tsx`), Operaciones (`OperationsView.tsx`), Directorio CRM (`CRMView.tsx`), and Configuración (`SettingsView.tsx`).
  - Modernized order and garment card grids to responsive multi-column scaling (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`), ensuring fluid touch ergonomics on mobile devices and multi-column panoramic expansion on workshop displays in Satélite Norte.
  - Strictly verified that all modified files remain well under Rule 500 limits: `MainLayout.tsx` (323 lines), `SalesView.tsx` (202 lines), `ProductionView.tsx` (196 lines), `LogisticsView.tsx` (50 lines), `OperationsView.tsx` (155 lines), `CRMView.tsx` (415 lines), and `SettingsView.tsx` (254 lines).
- **Systemic Viewport & Modal Widescreen Overhaul (`SettingsView.tsx`, `NewOrderModal.tsx`, `AccountProfileModal.tsx`, `ContactProfileModal.tsx`, `NewAccountModal.tsx`, `NewContactModal.tsx`)**:
  - Upgraded Tier 1 workspace containers to eliminate empty voids on widescreen monitors:
    * `SettingsView.tsx`: Expanded container from narrow `max-w-3xl` to `max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8`, giving pricing tables and controls generous breathing room.
    * `NewOrderModal.tsx`: Expanded outer modal to `max-w-6xl w-full h-[90vh]` with a 12-column responsive layout (`lg:col-span-7` for Customer Data and Garment Configurator, `lg:col-span-5` for Cart Summary and Checkout), with seamless vertical scrolling and fixed action headers.
  - Calibrated Tier 2 Executive Profiles and Creation Modals to a unified `max-w-3xl w-full`:
    * `AccountProfileModal.tsx`: Upgraded from `max-w-2xl` to `max-w-3xl w-full`, enabling logistics and branding accordions to stretch smoothly.
    * `ContactProfileModal.tsx`: Upgraded from `max-w-2xl` to `max-w-3xl w-full`, optimizing tailored measurements matrix and history statistics display.
    * `NewAccountModal.tsx` & `NewContactModal.tsx`: Standardized modal width wrappers to `max-w-3xl w-full` for comfortable multi-field input flow without horizontal crowding.
  - Strictly verified line limits under Rule 500 across all modified components.

### Changed
- **Services Catalog UX Redesign with Category Pills and 2-Column Grid (`ServicesCatalogTab.tsx`)**:
  - Replaced single massive 52-service vertical stack with a responsive 2-column grid (`grid grid-cols-1 md:grid-cols-2 gap-3`), eliminating severe scroll fatigue.
  - Implemented dynamic Category Filter Pills under search: `Todos (${count})`, `Filipinas`, `Mandiles`, `Pantalones`, `Gorros`, `Bordados & Logos`, and `Especiales / Otros`.
  - Tightened service card architecture into a streamlined 2-row layout:
    * Compact header with service index badge (`#N`), inline service name input, exclusion group tag, and safe delete confirmation.
    * Responsive horizontal footer displaying Compatible Garments tag with quick modal trigger, Service Type badge/dropdown, and Price input with currency label (`Bs`).
  - Added sticky accessible save bar (`Actualizar Precios Globales`) with live filtered service counter to ensure instant global price persistence from any scroll position.
  - Strictly enforced zero `any` TypeScript type safety and verified Rule 500 limits (475 lines).

### Changed
- **Compact Pill Tab Styling for Pricing Manager (`SettingsView.tsx`)**:
  - Replaced wide text-based tabs (`TAB A: TARIFARIO BASE...`) with compact, responsive pill buttons (`Tarifario Base`, `Especiales`, `Servicios`, `Descuentos`).
  - Applied compact pill styling (`px-3.5 py-1.5 rounded-xl text-xs font-bold`) allowing all 4 buttons to sit comfortably side-by-side without horizontal scrolling or text clipping.
  - Implemented high-contrast amber active state (`bg-amber-500 text-stone-950 font-black shadow-md`) and subtle dark hover states for improved readability and tactile feedback.

### Removed
- **Decommissioned Phantom Contrato Institucional Tier (`DiscountRulesTab.tsx`)**:
  - Removed "Contrato Institucional" from the discount rules tier selector list.
  - Constrained selectable core tiers strictly to `Estándar Raleo` (Minorista / Público), `Estándar B2B` (Mayorista), and `UDI Especial` (Convenio UDI), plus dynamic custom presets from Firestore.
  - Cleaned up tier badges and filtered out institutional references from dynamic preset enumerations.

### Added
- **Dedicated TAB D: REGLAS DE DESCUENTO (`SettingsView.tsx`, `DiscountRulesTab.tsx`, `useSettingsMutations.ts`)**:
  - Extracted cross-cutting financial policies out of `SpecialPresetsTab.tsx` (Tab B) into a dedicated 4th tab in the Pricing Manager (`MANEJADOR DE PRECIOS`):
    * `TAB A: TARIFARIO BASE`
    * `TAB B: TARIFARIOS ESPECIALES`
    * `TAB C: SERVICIOS ADICIONALES`
    * `TAB D: REGLAS DE DESCUENTO`
  - Restored `TAB B: TARIFARIOS ESPECIALES` to its clean, original purpose: contracted garment pricing rates, custom preset creation, and special bundle summaries (e.g. UDI Package).
  - Built `DiscountRulesTab.tsx` with a responsive tier selector grid showing status badges (`Minorista / Público`, `Mayorista (Sin Vol)`, `Convenio UDI`, `Institucional`, etc.) and live state indicators (`Vol: On/Off`, `% Contado`).
  - Enhanced `TierDiscountRulesCard.tsx` with controlled `selectedTier`, `onSelectTier`, `showTierSelector` toggling, and full package discount percentage customization.
  - Updated `useSettingsMutations.ts` to manage `'A' | 'B' | 'C' | 'D'` tabs and guarantee clean persistence of `discountRulesByTier` in Firestore global pricing document.
  - Strictly verified Rule 300 / Rule 500 limits: `DiscountRulesTab.tsx` (136 lines), `TierDiscountRulesCard.tsx` (311 lines), `SpecialPresetsTab.tsx` (280 lines), `SettingsView.tsx` (269 lines), `useSettingsMutations.ts` (241 lines).

### Added
- **Unified Tier-Agnostic Discount Configuration Engine (`src/types/pricing.ts`, `src/utils/discountRulesUtils.ts`, `src/utils/pricingCalculator.ts`)**:
  - Implemented `TierDiscountRules` and `VolumeTierRule` interfaces with strict TypeScript typing, stored per tier in `discountRulesByTier: Record<string, TierDiscountRules>`.
  - Completely decoupled discount rules from `UDI Especial`, giving every tier (`Estándar Raleo`, `Estándar B2B`, `UDI Especial`, `Contrato Institucional`, and custom presets) independent rules for Cash (100% Adelantado), Volume Tiers, Seller Closing Cap, and Full Package discounts.
  - **B2B Wholesale Stacking Resolution**: Disabled automatic volume discounts by default for B2B (`volumeDiscountEnabled: false`), preventing wholesale orders from double-dipping volume discounts on top of wholesale unit prices.
  - **Preserved Mandatory Financial Invariant (Embroidery Quarantine)**: All discounts (volume, cash, seller closing) apply strictly to base garment manufacturing after extracting subcontracted embroidery services and matrices.
  - **Dynamic Salesperson Closing Cap (`NewOrderModal.tsx`, `useOrderCreator.ts`, `OrderSummaryAndCheckout.tsx`)**:
    * Dynamically bound the manual discount slider's `max` to the active tier's `maxSellerDiscountPercent`.
    * Hidden/disabled the manual discount slider when `sellerDiscountEnabled` is toggled off for the tier.
  - **Modularized UI (`TierDiscountRulesCard.tsx`, `TierVolumeDiscountEditor.tsx`)**:
    * Replaced monolithic 361-line `PresetDiscountRulesCard.tsx` with reusable `TierDiscountRulesCard.tsx` (273 lines) and `TierVolumeDiscountEditor.tsx` (123 lines), strictly complying with Rule 300 / Rule 500 limits.
    * Integrated interactive tier switcher and embroidery quarantine protection notices into `SpecialPresetsTab.tsx`.

### Added
- **Social Media Support Across Accounts & Contacts (`SocialBadges.tsx`, `src/types/index.ts`, `src/types/crm.ts`)**:
  - Introduced unified `Socials` data model (`instagram`, `facebook`, `tiktok`, `website`) to both `Contact` and `ClientAccount` / `MasterContact`.
  - Built dedicated `SocialBadges` component (`src/components/crm/SocialBadges.tsx`) that gracefully normalizes usernames/handles (`@handle`) and full URLs, providing high-contrast clickable badges with platform-specific branding (Instagram, Facebook, TikTok, Website).
  - Integrated badge strip into both `AccountProfileModal.tsx` and `ContactProfileModal.tsx` summary sections; renders nothing if no social handles are configured, preserving clean layout without empty spaces.
- **Secondary Footer Edit Action (`AccountProfileModal.tsx`, `ContactProfileModal.tsx`)**:
  - Added a secondary `[✏️ Editar Cuenta]` / `[✏️ Editar Contacto]` action button in the bottom modal footer alongside `Cerrar`, allowing immediate editing without having to scroll back to the top header.

### Removed
- **Decommissioned Read-Only Metrics Footer in Edit Modals (`EditContactModal.tsx`)**:
  - Removed misleading static purchase/orders footer block (`PEDIDOS (LECTURA)`, `GENERADO`, `PENDIENTE`) from `EditContactModal.tsx` as real-time financial metrics are computed and displayed dynamically on profile cards.

### Changed
- **Edit Modals Socials Management (`EditContactModal.tsx`, `EditAccountModal.tsx`)**:
  - Added a compact "Redes Sociales (Opcional)" input card to both modal forms with fields for Instagram, Facebook, TikTok, and Website.
  - Persists `socials` structure directly to Firestore documents with merge support and full TypeScript type safety.
  - Adhered strictly to Rule 300 / Rule 500 limits across all files (`EditAccountModal.tsx`: 479 lines, `ContactProfileModal.tsx`: 484 lines, `AccountProfileModal.tsx`: 464 lines, `EditContactModal.tsx`: 291 lines, `SocialBadges.tsx`: 107 lines).

### Fixed
- **CRM Directory Accordion Expansion & Layout Height Integrity (`AccountProfileModal.tsx`, `ContactProfileModal.tsx`)**:
  - Replaced problematic CSS height-clamping and `max-h-0` transition logic with explicit React boolean states (`isMeasurementsOpen`, `isLogisticsOpen`, `isBrandingOpen`).
  - Accordions now conditionally render their containers (`{isOpen && (<div className="p-4 bg-stone-950/80 border border-t-0 border-stone-800 rounded-b-xl space-y-3">...</div>)}`), eliminating zero-height crushing upon collapse/expansion.
  - Retained permanently visible accordion toggle headers with `ChevronDown` icons smoothly rotating 180° on expansion.
  - Set modal inner bodies to `overflow-y-auto max-h-[85vh]` with `shrink-0` on section wrappers, allowing cards to scroll comfortably without clipping when multiple accordions are unfolded.

### Changed
- **Relocated Deletion Actions to Profile Cards & Decommissioned Row-Level Delete (`MasterContactsTable.tsx`, `ClientAccountsTable.tsx`, `AccountProfileModal.tsx`, `ContactProfileModal.tsx`, `CRMView.tsx`)**:
  - Removed row-level `ELIMINAR` button from `MasterContactsTable.tsx` and cleaned table layout to purely selection interactions.
  - In `ContactProfileModal.tsx`:
    * Added left-aligned `[🗑️ Eliminar Contacto]` button in the modal footer (`text-red-400 hover:bg-red-950/40 border border-red-900/40 rounded-xl px-4 py-2`).
    * Enforced active order protection, disabling deletion if the contact has active orders (`status !== 'Entregado' && status !== 'Cancelado'`) or is an inherited historical contact.
    * Integrated confirmation dialog and wired to `onRequestDelete` / `DeleteContactModal` via `CRMView.tsx`.
  - In `AccountProfileModal.tsx`:
    * Added left-aligned `[🗑️ Eliminar Cuenta]` button in the footer alongside `Historial de Pedidos`.
    * Protected system accounts (`ACC-000` and `ACC-001` via `isSystemAccount`) with disabled states and descriptive tooltips.
    * Added confirmation modal that safely deletes the account document and unlinks associated branch child accounts.
  - Cleaned up icon imports to use standard named imports from `lucide-react`.
  - Strict Rule 300 / Rule 500 compliance maintained across all modified components (`ContactProfileModal.tsx`: 469 lines, `AccountProfileModal.tsx`: 449 lines, `CRMView.tsx`: 427 lines, `MasterContactsTable.tsx`: 96 lines, `ClientAccountsTable.tsx`: 89 lines).

### Added
- **Directory CRM UX Overhaul & Decommissioned Cluttered Row Actions (`ClientAccountsTable.tsx`, `MasterContactsTable.tsx`, `CRMView.tsx`)**:
  - Decommissioned obsolete `FUSIONAR` and `EDITAR` buttons from row action columns in both `ClientAccountsTable` and `MasterContactsTable`, eliminating table clutter and scroll fatigue.
  - Converted table rows (`<tr>`) into clickable elements with hover feedback (`cursor-pointer hover:bg-stone-800/50`) that seamlessly open dedicated profile cards.
  - Preserved standalone row actions (`Historial` and `Sistema` lock badge in Accounts, `Eliminar` and `Heredado` badge in Contacts).
- **Read-Only Profile Cards with Collapsible Accordions (`AccountProfileModal.tsx`, `ContactProfileModal.tsx`)**:
  - Created `ContactProfileModal.tsx`:
    * Default read-only layout displaying full name, role badge, linked account ID & name, phone with direct WhatsApp link, email, and order metrics (order count, total revenue, and pending balance).
    * Header `[✏️ Editar]` button to transition into `EditContactModal`.
    * Collapsible accordion `📐 Medidas Anatómicas (12 Puntos)` (closed by default) presenting a 12-point tailoring matrix chip grid with recorded centimeters.
  - Created `AccountProfileModal.tsx`:
    * Default read-only layout presenting account name, parent account affiliation, account type, contact person, phone with WhatsApp link, email, and pricing tier badge.
    * Header `[✏️ Editar]` button for non-system accounts and `Historial de Pedidos` footer action.
    * Collapsible accordions for `📍 Logística & Entrega` (delivery city, address, dispatch notes) and `🎨 Branding & Bordados` (embroidery status, placement chips, thread colors, and logo assets).
- **CRM Modular Architecture & Strict Rule 300 / Rule 500 Compliance (`crmSeedUtils.ts`, `CRMView.tsx`)**:
  - Extracted seed provisioning logic from `CRMView.tsx` into `/src/utils/crmSeedUtils.ts` (158 lines, < 300 line ceiling).
  - Streamlined `CRMView.tsx` to 420 lines (< 500 line limit).
  - All visual components (`ContactProfileModal.tsx`: 367 lines, `AccountProfileModal.tsx`: 349 lines, `ClientAccountsTable.tsx`: 89 lines, `MasterContactsTable.tsx`: 120 lines) maintain strict Rule 500 compliance with zero `any` types.

### Added
- **Workshop Governance Lockdown for Institutional Roster (`OperationsView.tsx`, `ProductionView.tsx`, `InstitutionalRosterModal.tsx`, `EditInstitutionalRosterModal.tsx`)**:
  - Implemented strict read-only governance for Taller (Operaciones and Producción) workshop personnel inspecting institutional order rosters.
  - Replaced `EDITAR NÓMINA` buttons in `OperationsView.tsx` and `ProductionView.tsx` with `VER NÓMINA COMPLETA`, automatically binding `readOnly={true}`.
  - In `InstitutionalRosterModal.tsx` and `EditInstitutionalRosterModal.tsx`:
    * Added visual `Modo Lectura de Taller` badge with `Lock` icon in the modal header.
    * Completely hidden the action toolbar (adding employees, batch generation, Excel/Sheets paste, bulk sizing).
    * Passed `readOnly={true}` to `RosterGarmentTemplateBar` (hiding the `+ Añadir Prenda` button and template deletion trash icons).
    * Passed `readOnly={true}` to `InstitutionalRosterTable` (replacing inputs and dropdowns with static display spans, disabling modifications, and completely hiding employee deletion actions).
    * Replaced modal confirmation / save buttons with a single `Cerrar` dismissal button, eliminating unbilled garment injection and contract tampering risk.
    * Propagated `readOnly` into `EmployeeCustomMeasurementsModal.tsx`, disabling all custom measurement inputs and converting "Guardar Medidas" into a read-only "Cerrar" action.
  - Preserved full interactive editing capabilities exclusively for Ventas (quote/order authoring) and Administración.
  - Strict Rule 300 / Rule 500 compliance maintained across all modified visual components (`EditInstitutionalRosterModal.tsx`: 492 lines, `InstitutionalRosterModal.tsx`: 489 lines, `InstitutionalRosterTable.tsx`: 296 lines, `OperationsView.tsx`: 154 lines, `ProductionView.tsx`: 195 lines, `App.tsx`: 445 lines).

### Fixed
- **Synchronized Template Garment Removal & Roster Pruning (`InstitutionalRosterModal.tsx`, `RosterGarmentTemplateBar.tsx`)**:
  - Resolved state mismatch and re-render loop where deleting a template garment from `RosterGarmentTemplateBar` (e.g. removing "Pantalón" or "Mandil") caused parent `garmentTemplates` prop regeneration to trigger an uncontrolled `useEffect` that overwrote `templates` back to defaults while `emp.garments` remained pruned.
  - Guarded `useEffect` in `InstitutionalRosterModal` with `useRef` to only synchronize from `garmentTemplates` on initial modal open transitions (`show: false -> true`), preventing parent re-render loops from corrupting active editing state.
  - Implemented `handleRemoveTemplateGarment(index: number)` in `InstitutionalRosterModal.tsx` to atomically filter `templateGarments` and map over `roster` to prune each employee's corresponding garment sub-column by index (`(emp.garments || []).filter((_, i) => i !== index)`).
  - Enhanced `RosterGarmentTemplateBar.tsx` with explicit event prevention (`e.preventDefault()`, `e.stopPropagation()`) and dual support for `onRemove` and `onRemoveTemplateColumn`.
  - Replaced loose `any` types with strict `PricingGarmentsConfig`, `Contact`, and `GarmentTemplateInput` interfaces, maintaining full TypeScript strictness with zero `any`.
  - Strict Rule 300 / Rule 500 compliance maintained (`InstitutionalRosterModal.tsx`: 472 lines, `RosterGarmentTemplateBar.tsx`: 123 lines).

### Added
- **Ring-Fenced UDI Student Bundle Engine (`src/domains/udi/udiBundleEngine.ts`)**: Extracted all university student package logic into a dedicated, self-contained domain module. Isolates 4-piece student kit breakdown (`getUdiBundleBreakdown`), group bundling into `"Uniforme Completo UDI"` (`collapseUdiStudentPackage`), and the 10% cash discount calculation (`calculateUdiPackageDiscount`). Operates with zero generic product merging and zero external B2B dependencies.
- **Agnostic Commercial Item Consolidator (`src/utils/orderItemConsolidation.ts`)**: Implemented `consolidateCommercialItems(items: OrderItem[], isInstitutional?: boolean)` for presentation views across the application. Grouping criteria combines `name`, `fabric`, `fabricColor`, and base services.
  - In institutional roster orders (`isInstitutional === true`), individual employee pocket names (`it.pocketName`) are ignored from the grouping hash, cleanly collapsing bulk orders (e.g., 30 Filipinas) into a single row.
  - Automatically summarizes individual pocket name embroideries into unified sub-service rows (e.g. `· Bordado de Nombre en Bolsillo: Nómina (30 personas)`).
  - Raw `order.items` and `order.institutionalRoster` remain pristine and unmutated in Firestore/state for full tailor Kanban ticket generation and `InstitutionalPackingSlip.tsx` signatures.

### Changed
- **Purged UDI Domain Pollution from Generic Views**: Replaced direct usage of `collapseUdiItems` with `consolidateCommercialItems` across `InvoiceModal.tsx`, `OrderReceiptDocument.tsx`, `ActiveOrdersList.tsx`, `QuotesList.tsx`, `QuotesHistoryList.tsx`, `OperationsView.tsx`, `CancellationVoucherModal.tsx`, `ProductionView.tsx`, and `useExportEngine.ts`.
- **UDI Legacy Compatibility Layer (`src/utils/udiPackageUtils.ts`)**: Refactored into a thin re-export adapter (34 lines) delegating to `udiBundleEngine.ts` and `orderItemConsolidation.ts` to preserve backwards compatibility with existing consumers.
- **Strict Rule 300/500 Compliance**: All updated logical modules (`udiBundleEngine.ts`: 183 lines, `orderItemConsolidation.ts`: 125 lines, `pricingCalculator.ts`: 274 lines) remain strictly under the 300-line ceiling. All visual components remain well within the 500-line limit. Zero `any` or `@ts-ignore` used.

### Added
- **Order-Wide Logo Pooling (`src/utils/embroideryPricingUtils.ts`, `src/hooks/usePricingEngine.ts`, `src/utils/pricingCalculator.ts`)**: Implemented aggregate logo quantity pooling across orders via `calculateOrderWideLogoQuantity`. Orders split across size rows (e.g., 2 S, 3 M, 3 L, 2 XL) now receive the pooled bulk rate (10 units = Bs 20.00) rather than fragmented small-batch rates.
- **Subcontracted Embroidery Quarantine from Discounts (`src/utils/pricingCalculator.ts`, `src/utils/embroideryPricingUtils.ts`)**: Quarantined subcontracted embroidery (logos, pocket names, external embroideries) from garment volume, cash (100% Contado), and manual closing discounts. Confection trims and functional hardware (argollas, reguladores, hebillas) remain in the discountable base. Protects workshop cash outlays.
- **Centralized Logo Tier Rates Table (`src/utils/constants.ts`)**: Centralized `LOGO_VOLUME_RATE_TABLE` defining volume tiers (1 = Bs 70, 2 = Bs 40, 3 = Bs 30, 4 = Bs 25, 5 = Bs 22, 6+ = Bs 20).

### Fixed
- **Deduplicated Math in `ActiveOrdersList.tsx`**: Removed duplicate inline volume ladder logic and wired the centralized `calculateVolumeScaledServiceUnitPrice` and `calculateOrderWideLogoQuantity` helpers.
- **Unified Order-Wide Pricing Across Checkout & Receipts**: Updated `OrderSummaryAndCheckout.tsx`, `InvoiceModal.tsx`, and `OrderReceiptDocument.tsx` to pass order items to `getServiceUnitPrice`, guaranteeing unified pooled pricing display across summaries, invoices, and print receipts.
- **Type Safety and Compiler Errors**: Fixed `ServicePricing` interface in `src/types/index.ts` to include optional `garment?: string`. Resolved reference in `OrderSummaryAndCheckout.tsx` from `orderData.items` to `newOrder.items`. Linter (`tsc --noEmit`) and Vite compilation now pass with zero errors.

### Changed
- **Rule 300 / Rule 500 Architecture Compliance**: Refactored `collapseUdiItems` into `src/utils/udiPackageUtils.ts` and re-exported from `src/utils/pricingCalculator.ts`. `pricingCalculator.ts` is 269 lines (< 300 limit), `embroideryPricingUtils.ts` is 134 lines, and all visual files remain well under 500 lines.
- Correctly implemented mutually exclusive logic for "Tiros" (Tiros sencillos vs Tiros cruzados) within the services catalog, instantly deselecting conflicting variations.
- Restructured `CARRITO / RESUMEN` and `PDF Invoice / Document` templates to render detailed dynamic discount breakdowns (`Descuento por Volumen`, `Descuento por Pago al Contado`, `Descuento Especial`) explicitly instead of just lowering the final amount invisibly.
- Configured individual item prices inside `CARRITO / RESUMEN` to display `(+BsX.xx)` text when variations that have an additional cost (e.g. Logo en el pecho) are added.
- Displayed actual `Mínimo` amount strictly based on the payment intent configuration (e.g., if set to 100% Contado, minimum must be 100%, previously capped at 50% universally in some labels).
- Increased height tolerance for the `CARRITO / RESUMEN` interface to prevent hidden scrolling overlaps on dense orders.
- Segregated "Nombre para el bolsillo" and added "Detalle de personalización de bolsillos" conditional form fields depending on the exact extra service toggled.
- Enforced visually structured `Saldo` labels colored red even when the debt sits cleanly at 0.00 across `Operaciones` and Active Order panes for accounting compliance.
- Restructured `Plazo de Entrega` to default to `15 días hábiles a partir del primer depósito`.

- Configured "Tipo de Impacto" dropdown in the Ajustes catalog to include a `Costo Adicional Editable` option.
- Engineered conditional inputs inside the Ventas flow when a `Costo Adicional Editable` variation is tapped, prompting manual price entry seamlessly integrated into price calculation loops.
- Extended the catalog matrix with a "Grupo Mutuamente Excluyente" tag system, granting administrators power to map custom UI collision constraints directly (e.g. binding tirote variations natively without hardcoded checks).

### Fixed
- Reverted all fragile visual patches in `HistoryView`, `OperationsView`, `ReporteVentasTable`, `AccountHistoryModal`, `ReceiptsModal`, `QuotesHistoryList`, `OrderReceiptDocument`, and `InvoiceModal`. The UI components are now purely declarative and do not manipulate database totals.
- Repaired the core `computeDiscountEngine` inside `pricingCalculator.ts`. It now strictly enforces a bypass rule: if `migrationFlatDiscount` is present, all automated discount logic (volume, cash, UDI packages) is entirely bypassed and only the explicit manual discount is applied.

### Changed
- **Architecture (Phase 1.1 - Initiated)**: Enforced Zero Hardcoding Policy in `src/utils/pricingCalculator.ts`. Stripped legacy hardcoded matching for `ACC-001`, `ACC-002`, and `"Estudiante UDI"`. The pricing engine's tier resolution (`getPricingTierFromClientType`) and preset triggers (`computeDiscountEngine`) have been refactored to rely exclusively on dynamic, database-driven `accountPricingTier` attributes. System now safely defaults to `Estándar Raleo` if no explicit database tier is provided, eliminating hidden logic bypasses and mathematical ambiguities.
- **Architecture (Phase 1.2)**: Eliminated fragile literal string matching (`"Uniforme Completo UDI"`) from `src/utils/pricingCalculator.ts`. The calculation engine now relies entirely on robust boolean properties (`isPackage`, `isUdiGroup`) to detect bundle items, calculate UDI package discounts, and assign presets. This fulfills Zero Hardcoding Policy for bundle identification, making the pricing engine resilient to future product catalog name changes.
- **Architecture (Phase 1.3)**: Purged hardcoded string intercepts (`'UDI Especial'`, `'UDI'`) from `getEffectiveDiscountConfig` in `src/utils/discountRulesUtils.ts`. The discount engine now strictly applies dynamic rule property merging. Special behaviors (like disabling volume discounts and enabling package discounts) are no longer triggered by naming conventions, but exclusively by the boolean configurations provided by the database via `allPresetDiscounts`.
- **Architecture (Phase 1.4 - Finalizing Phase 1)**: Completely eradicated the hardcoded `DEFAULT_UDI_PRICES` dictionary from `src/utils/udiPackageUtils.ts`. UDI bundle component pricing is now resolved exclusively against the dynamic master product catalog retrieved from the database. Fallback prices have been explicitly set to `0`, ensuring that any missing catalog mappings are immediately visible rather than being masked by legacy code-level patches.

### Removed
- **Deprecation (Phase 2.1)**: Deleted the orphaned zombie hook `src/hooks/useCRMMutations.ts`. Comprehensive codebase scanning confirmed this module was completely unlinked from the execution flow. Removing it reduces technical debt and eliminates obsolete, hardcoded mutation logic (e.g., forced fallback to 'Santa Cruz') that was flagged during the architectural audit.
- **Deprecation (Phase 2.2)**: Purged the orphaned utility function `syncOrphanedInstitutionalAccountsAndContacts` from `src/utils/accountContactUtils.ts`. Dependency scanning verified this function was completely unreferenced, contributing to dead code bloat. Removing it streamlines the utility file and adheres to the structural line limits logic.
- **Deprecation (Phase 2.3 - Finalizing Phase 2)**: Removed the uncalled validation function `checkQuoteMissingData` from `src/utils/orderUtils.ts`. Dependency scanning confirmed it was an orphaned utility. Its removal concludes the Dead Code Deprecation phase, ensuring a cleaner utility layer and reduced technical debt.
- **Architecture (Phase 3.1)**: Refactored `src/utils/accountContactUtils.ts` to enforce strict modular segregation. Extracted side-effect database mutation handlers (`ensureContactExists`, `ensureCorporateAccountExists`) into a newly created `src/utils/accountContactMutations.ts` module. The original file now acts strictly as a pure-function utility module for ID generation, reducing module complexity and enforcing cleaner data boundaries.
- **Architecture (Phase 3.2 - Finalizing Phase 3)**: Modularized the overgrown `src/hooks/useOrderCreator.ts` (331 lines) to comply with the Rule 300 constraint. Segregated responsibilities into `useOrderState` (local React state management) and `useOrderSubmission` (asynchronous Firestore mutations and image compression). `useOrderCreator` now acts solely as an orchestrator hook, preserving the exact return interface so consumer UI components required zero modifications. Replaced hardcoded default seller name with strict dynamic profile lookup.
- **Type Safety Hardening (Phase 4.1)**: Replaced pervasive `any` types and escape hatches (`[key: string]: any`) across the order lifecycle. 
  - Defined explicit boundaries in `src/types/index.ts` (`Order`, `OrderItem`, `PaymentEntry`, `OrderLogo`, `PricingData`, `AuthUserProfile`).
  - Implemented strict constructor and engine payload interfaces in `src/hooks/useOrderSubmission.ts` (`OrderSubmissionState`, `OrderSubmissionActions`, `OrderPricingEngine`, `PaymentOptions`).
  - Purged `any` from `src/utils/pdfGenerator.ts`, `src/hooks/useOrderCreator.ts`, and `src/hooks/useOrderState.ts` to block untyped data flows.
- **Type Safety Hardening (Phase 4.2)**: Enforced 100% strict typing in the CSV export engine (`src/utils/csvFormatters.ts`). Replaced all `any[]` and unstructured callback typings with explicit boundaries (`Order`, `OrderItem`, `PricingData`, `OrderBreakdown`). Defined specific output row interfaces (`CsvOrderHeaderRow`, `CsvOrderLineItemRow`, `CsvLineItemModifierRow`) and mapped missing supplementary properties into the root interfaces to prevent implicit untyped evaluations during array iteration mapping.
- **Type Safety Hardening (Phase 4.3)**: Applied absolute strict TypeScript interfaces across `useReportsEngine.ts`. 
  - Implemented analytical accumulator interfaces (`SalesReportData`, `CityStat`, `SellerArrayStat`, etc.) inside `src/types/index.ts` to strictly type the KPI return block. 
  - Eliminated implicit `any[]` collections and replaced all `any` iterators with exact `Order`, `OrderItem`, and `PaymentEntry` references. 
  - Supplemented missing properties like `deliveryCity`, `embroideryType` and `logoPlacement` inside root entities to natively support existing reporting extractor logics, closing structural compilation blind spots.

### Phase 5 - Testing & Polish (Pre-Flight Checks)
- **Build Integrity Verification**: Verified strict compilation zero-defect status across `tsc` and `vite build`. Successfully merged structural boundaries without generating circular dependencies.
- **Rule 300 / 500 Audit**: Confirmed near-perfect compliance across the logical and visual component tree (exceptions: `useOrderSubmission.ts` at 307 lines, `CRMView.tsx` at 504 lines).
- **Hardcoding & Type Audit Execution**: Traced and mapped remaining residual `any` boundaries in peripheral sibling engines (`usePricingEngine.ts`, `useExportEngine.ts`) and identified raw static string fallback injections (`Cliente Particular`) to be resolved in the final polish layer.

### Bug Fix: Service Unit Price Display & Pricing Engine Centralization
- **Issue**: Cart View (`CARRITO / RESUMEN`) displayed service add-ons without an inline unit price, causing inconsistencies vs the finalized Order Card. Additionally, volume-scaled logo rules were being manually hacked with inline math across multiple frontend views.
- **Root Cause**: The UI calculated single-line item strings manually instead of consuming the scaled math from `pricingCalculator.ts`.
- **Architectural Solution**: Extracted and centralized a strictly-typed `getServiceUnitPrice(serviceName: string, item: OrderItem)` exposed directly by `usePricingEngine.ts`. Eradicated raw price logic and implicit `any` fallbacks from `OrderSummaryAndCheckout.tsx`, `OrderReceiptDocument.tsx`, and `InvoiceModal.tsx`, unifying the output layout and math logic strictly under the engine's authority.

### Bug Fix: Institutional Roster & Cart Upgrades
- **Feature (UX):** Upgraded `InstitutionalRosterTable.tsx` role input to a native `<datalist>` dynamically driven by `constants.ts/getRolesForAccountType`, adding auto-complete structured dropdowns without losing free-text capability.
- **Refactor (UI):** Implemented visual grouping map (`displayItems`) in `OrderSummaryAndCheckout.tsx` to stop "cart item explosion" caused by massive institutional rosters, elegantly aggregating identical line-items visually.
- **Bugfix (Data Integrity):** Fixed contact creation deduplicator in `institutionalOrderUtils.ts` to strictly scope lookups by `accountId` and `phone`, preventing cross-company collisions of same-named employees.
- **Bugfix (Persistence):** Fixed critical bug in `useOrderSubmission.ts` where generating a "Cotización" skipped generating CRM contacts for roster employees. All data handling and mappings respect strict TypeScript typings (`Contact`, `OrderItem`, `GroupedCartItem`).

### Bug Fix: Institutional Roster Roles UI & Domain Alignment
- **Feature (Domain Rules):** Audited `constants.ts` to strictly reserve the "Personal" / "Particular" role for B2C clients only. Rewrote `ROLES_BY_ACCOUNT_TYPE` to enforce domain-accurate defaults (e.g., `CHEF`/`COCINERO` for Restaurants, `ESTUDIANTE` for Universities, `COLABORADOR` for Corp).
- **Refactor (UI):** Replaced ambiguous `<datalist>` in `InstitutionalRosterTable.tsx` with a strongly-controlled `<select>` component, defaulting to the primary domain role. Included an interactive toggle to display a secondary text input when "OTRO" is selected, creating a foolproof entry UX.
- **Bugfix (Persistence):** Removed aggressive `normalizeRole` bottleneck inside `institutionalOrderUtils.ts`. User-defined custom roster roles (e.g., "AYUDANTE") are now accurately preserved and written to the `Contact.role` document in Firestore instead of being wiped by the B2B fallback mapping.

### Feature: Mock Directory Purge Trigger
- **Description**: Wired the Phase 1 Database Mock Directory Purge utility directly into the CRM View.
- **Implementation**: 
  - Centralized target definitions (`MOCK_ACCOUNT_IDS`, `MOCK_CONTACT_IDS`) and strict protection filters (`PROTECTED_ACCOUNT_IDS`, `PROTECTED_CONTACT_IDS`, `PROTECTED_NAMES`) in `src/utils/databaseScripts.ts` under a new atomic batch operation implementation of `purgeMockDirectoryData`.
  - Added a strict-gated SuperAdmin trigger button (`🧹 Purgar Mock Data`) located next to the `+ Nuevo Contacto` action in `CRMView.tsx`.
  - Implemented explicit native browser confirmation citing exactly which target models will be eradicated and which production profiles will be preserved (Hugo Salazar, UDI, Mil Caprichos).
- **Compliance**: Verified strict compliance with Rule 300 / Rule 500 file limits, Zero Hardcoding, and Strict Type Safety across changes.

### Bug Fix: Mock Purge Confirmation & DB Scope
- **Issue**: The mock purge button failed to execute due to native `window.confirm` and `window.alert` being silently blocked by the iframe sandbox. Additionally, passing `db` downwards as a parameter caused unreliability if the context wasn't guaranteed.
- **Architectural Solution**:
  - Imported the Firestore `db` instance directly into `src/utils/databaseScripts.ts` and set it as the default fallback parameter for `executeMockDirectoryPurge` and `purgeMockDirectoryData`, decoupling the utility from UI-layer injections.
  - Replaced the blocked native `window.confirm` with a custom two-step React state confirmation (`confirmPurge`) directly inside `CRMView.tsx`. The button transitions from a red initial state to an amber pulsing confirmation state, bypassing iframe sandbox restrictions.
  - Added inline async feedback (loading state and success/error status pill) to replace `alert`.
- **Compliance**: Verified strict compliance with Rule 300 / Rule 500 file limits, Zero Hardcoding, and Strict Type Safety across changes.

### Decommissioning: Mock Purge Trigger
- **Description**: Safely decommissioned and removed the temporary Phase 1 Mock Purge UI trigger from `CRMView.tsx`.
- **Implementation**: 
  - Stripped the `🧹 Purgar Mock Data` button and its associated `isSuperAdmin` gating.
  - Eliminated the two-step confirmation React states (`confirmPurge`, `isPurging`, `purgeStatus`) and the `handlePurgeMockData` action.
  - Removed unused imports for `useAuth` and `purgeMockDirectoryData` to ensure clean file state.
- **Compliance**: Verified strict compliance with Rule 300 / Rule 500 file limits, Zero Hardcoding, and Strict Type Safety across changes.

### Feature: Correlative Sequential Migration Engine
- **Description**: Implemented a standalone JSON-driven migration modal (`MigrationModal.tsx`) to process legacy historical orders and bootstrap foundational entities safely.
- **Implementation**: 
  - **Pre-Flight**: Reconstructed temporal event sequences by parsing JSON arrays and sorting ascending chronologically by `createdAt`. Built deterministic memory maps (`contactNameMap`, `corporateAccountMap`) for deduplication.
  - **ID Generators**: Designed custom alphanumeric sequence generators enforcing rigid boundaries: 
    - Active Orders (`#ORD-00002+`), Quotes (`#COT-00001+`). Reserved `#ORD-00001` for the initial founder order.
    - Contacts: Protected base sequence (Matias `CON-0001`, Daniela `CON-0004`, Hugo `CON-0005`) while staging dynamic sequences starting exactly from `CON-0006`.
    - Accounts: Enforced structural mapping (UDI to `ACC-001`, Mil Caprichos to `ACC-002`, Retail to `ACC-000`) while sequentially staging new corporate accounts from `ACC-003+`.
  - **Transaction Boundary**: Implemented atomic chunking across four collections (`orders`, `masterContacts`, `clientAccounts`, `account_contacts`) using sequential `writeBatch(db)` cycles segmented into blocks of 20 to guarantee consistency without exceeding Firestore API limits.
  - **Integration**: Injected a direct modal trigger into `DangerZoneSection.tsx` immediately below the historical mode activation.
- **Compliance**: Verified strict compliance with Rule 300 / Rule 500 file limits, Zero Hardcoding (explicitly implementing literal structural reservations), and Strict Type Safety.

### UI/UX: Migration Engine Dashboard Injection
- **Description**: Mounted the `MigrationModal` sequentially on the core Settings view, directly accessible to super-administrators.
- **Implementation**: 
  - Placed the trigger button (`📦 Importar Órdenes & CRM`) at the very top of the layout inside `src/components/views/SettingsView.tsx`, ensuring immediate operational visibility regardless of the active settings tab.
  - Wrapped the trigger securely inside an `isSuperAdmin` execution gate to prevent unauthorized access by standard employees.
  - Linked standard React `useState` hooks to mount the actual modal structurally at the bottom of the DOM node, preserving clean markup topology.
- **Compliance**: Verified strict compliance with Rule 300 / Rule 500 file limits, Zero Hardcoding, and Strict Type Safety, with 0 compilation errors and a clean `vite build`.

### Decommissioning: Migration Engine Trigger
- **Description**: Safely decommissioned and removed the temporary Migration JSON trigger from `SettingsView.tsx` post-migration execution.
- **Implementation**: 
  - Purged the `📦 Importar Órdenes & CRM (JSON)` trigger button and its `isSuperAdmin` wrapping block from the render tree.
  - Removed the `showMigrationModal` state, unused React imports (`useState`), and the physical JSX mount at the bottom of the component.
  - Removed unused import of `MigrationModal`.
- **Compliance**: Maintained zero dead code, preserved structural boundaries (Rule 300 / Rule 500), and achieved 0 compilation errors across strict type safety tests.

### UI/UX: Unauthenticated Login Branding Update
- **Description**: Rebranded the initial unauthenticated access screen to align with the new corporate identity.
- **Implementation**: 
  - Substituted legacy title ("RALEO WORKWEAR") with the official brand name: **AZAFRÁN CHEFWEAR**.
  - Updated the subtitle to `Confección de Autor • Sistema de Gestión y Logística`.
  - Refined the central card wrapper layout injecting a `shadow-2xl`, `backdrop-blur-sm`, and `bg-stone-900/90` overlay to match the executive dark theme.
- **Compliance**: Verified strict compliance with Rule 300 / Rule 500 file limits, Zero Hardcoding, and Strict Type Safety, resolving to 0 compilation errors and a clean `vite build`.

### Security & Lifecycle: Production Authentication and Query Guards
- **Description**: Hardened authentication lifecycle and Firestore query streams for production deployment (`*.ai.studio`) enforcing strict data-access rules.
- **Implementation**:
  - Replaced `signInWithPopup` with `signInWithRedirect` and `getRedirectResult` inside `AuthContext.tsx` to eliminate Cross-Origin-Opener-Policy (COOP) blocking and streamline redirect processing.
  - Hardened `DataContext.tsx` lifecycle hooks to strictly guard `onSnapshot` listener initialization behind validated `currentUser` states. All background queries are safely bypassed for unauthenticated visitors.
  - Enforced memory-safe listener unmounting across `AuthContext` and `DataContext` utilizing `Unsubscribe` arrays.
- **Compliance**: Verified strict rule observance (Rule 300 / Rule 500 file limits), zero explicit 'any' types on boundaries, and successful `vite build` compilation with 0 TypeScript errors.

### Feature Porting: Cross-View Receipt Auditing
- **Description**: Ported the "VER RECIBOS" auditing action from `OperationsView.tsx` to `ActiveOrdersList.tsx` and all historical sales lists, exposing payment history globally.
- **Implementation**: 
  - Refactored `App.tsx` and `SalesView.tsx` to cascade the `setViewingReceiptId` action handler across all sales child components.
  - Injected `[ 👁 VER RECIBOS (${validReceiptsCount}) ]` buttons into the financial status blocks of `ActiveOrdersList.tsx`, `HistoryView.tsx`, and `QuotesHistoryList.tsx`.
  - Conditioned buttons to dynamically render only when `order.paymentHistory` maps at least one valid receipt structure.
- **Compliance**: Sustained Rule 300 / Rule 500 file limits. Validated TypeScript integrity (0 `any` mutations, `tsc --noEmit`) and achieved a flawless `vite build` production exit code.

### Asset Optimization: 64x64 Azafrán crest favicon
- **Description**: Replaced the unoptimized 3.8 MB PNG favicon with an optimized lightweight 64x64 PNG format (< 25 KB).
- **Implementation**: 
  - Placed the optimized icon in the `public/` directory as `favicon.png`.
  - Injected the standard `<link rel="icon" type="image/png" href="/favicon.png" />` header tag in `index.html`.
  - Retained `Azafrán Chefwear - Order Management` as the precise primary page title.

### Brand Identity: Generated 64x64 favicon from authentic master asset in assets/
- **Description**: Configured the application favicon and cleaned up redundant large image files to ensure high-performance loading.
- **Implementation**: 
  - Generated an optimized 64x64 `favicon.png` with transparency and saved it securely to the `public/` directory, adhering to the < 25 KB budget constraint.
  - Asserted the correct injection of `<link rel="icon" type="image/png" href="/favicon.png" />` in `index.html`.
  - Maintained the official application title `Azafrán Chefwear - Order Management`.

### Brand Identity: Transparent alpha background applied to favicon.png
- **Description**: Optimized the application's favicon by stripping its opaque white background to render with a seamless alpha transparency channel.
- **Implementation**: Manipulated image matrix byte data via native canvas buffers, clamping threshold-white pixels (`>240` RGB delta) to absolute `0` alpha. The file was securely overwritten into `public/favicon.png`.

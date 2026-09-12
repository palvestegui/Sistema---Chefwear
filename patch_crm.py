import re

with open('src/components/views/CRMView.tsx', 'r') as f:
    content = f.read()

# 1. Add state variables
state_vars = """  const { isSuperAdmin } = useAuth();
  const [confirmPurge, setConfirmPurge] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeStatus, setPurgeStatus] = useState<string | null>(null);"""
content = content.replace("  const { isSuperAdmin } = useAuth();", state_vars)

# 2. Replace handlePurgeMockData function
old_handle = """  const handlePurgeMockData = async () => {
    if (window.confirm("¿Eliminar las 4 cuentas de prueba (ACC-003 a ACC-006) y contactos simulados? Hugo Salazar, UDI y Mil Caprichos quedarán intactos.")) {
      const result = await purgeMockDirectoryData(db);
      alert(result.message);
      // Optional: trigger reload if you have a refresh mechanism, or just let Firestore listeners handle it.
    }
  };"""

new_handle = """  const handlePurgeMockData = async () => {
    if (!confirmPurge) {
      setConfirmPurge(true);
      setTimeout(() => setConfirmPurge(false), 5000);
      return;
    }
    setIsPurging(true);
    try {
      const result = await purgeMockDirectoryData();
      setPurgeStatus(result.message);
      setTimeout(() => setPurgeStatus(null), 6000);
    } catch (err: any) {
      setPurgeStatus(`Error: ${err?.message || 'Fallo de purga'}`);
    } finally {
      setIsPurging(false);
      setConfirmPurge(false);
    }
  };"""
content = content.replace(old_handle, new_handle)

# 3. Replace the button JSX
old_btn = """            {isSuperAdmin && (
              <button type="button" onClick={handlePurgeMockData} className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 text-xs font-bold transition-all shadow-sm">
                <span>🧹 Purgar Mock Data</span>
              </button>
            )}"""

new_btn = """            {isSuperAdmin && (
              <>
                <button
                  type="button"
                  onClick={handlePurgeMockData}
                  disabled={isPurging}
                  className={`ml-2 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    confirmPurge
                      ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-black animate-pulse'
                      : 'bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300'
                  }`}
                >
                  <span>
                    {isPurging
                      ? '⏳ Purgando...'
                      : confirmPurge
                      ? '⚠️ ¿Seguro? Click para Confirmar'
                      : '🧹 Purgar Mock Data'}
                  </span>
                </button>
                {purgeStatus && (
                  <span className="ml-2 text-xs font-bold text-emerald-400 bg-stone-900/90 px-3 py-1 rounded-lg border border-stone-800">
                    {purgeStatus}
                  </span>
                )}
              </>
            )}"""

# We use re.sub just in case spacing varies slightly
content = re.sub(
    r"\{isSuperAdmin && \(\s*<button type=\"button\" onClick=\{handlePurgeMockData\}[^>]*>\s*<span>.*?</span>\s*</button>\s*\)\}",
    new_btn.replace("\\", "\\\\"),
    content,
    flags=re.DOTALL
)


with open('src/components/views/CRMView.tsx', 'w') as f:
    f.write(content)

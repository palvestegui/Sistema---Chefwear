with open('src/components/views/settings/DangerZoneSection.tsx', 'r') as f:
    content = f.read()

content = content.replace("{setIsMigrationMode && (", "{setIsMigrationMode && (\n            <div className=\"flex flex-wrap gap-3\">")
content = content.replace("Importar JSON de Órdenes Históricas\n            </button>", "Importar JSON de Órdenes Históricas\n            </button>\n            </div>")

with open('src/components/views/settings/DangerZoneSection.tsx', 'w') as f:
    f.write(content)

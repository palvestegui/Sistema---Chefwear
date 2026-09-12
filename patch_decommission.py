import re

with open('src/components/views/CRMView.tsx', 'r') as f:
    content = f.read()

# 1. Remove imports
content = content.replace("import { useAuth } from '../../contexts/AuthContext';\n", "")
content = content.replace("import { purgeMockDirectoryData } from '../../utils/databaseScripts';\n", "")

# 2. Remove states
states_to_remove = """  const { isSuperAdmin } = useAuth();
  const [confirmPurge, setConfirmPurge] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeStatus, setPurgeStatus] = useState<string | null>(null);"""
content = content.replace(states_to_remove, "")

# 3. Remove handlePurgeMockData (using regex to be safe)
content = re.sub(r"  const handlePurgeMockData = async \(\) => \{.*?\n  \};\n", "", content, flags=re.DOTALL)

# 4. Remove the button block
# Note: The original file has "                        {isSuperAdmin && ("
btn_block = r"                        \{isSuperAdmin && \(\s*<>\s*<button.*?</>\s*\)\}\n"
content = re.sub(btn_block, "", content, flags=re.DOTALL)

with open('src/components/views/CRMView.tsx', 'w') as f:
    f.write(content)

import re

with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

# Fix imports
content = content.replace("import { onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';", 
                          "import { onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult, User, Auth } from 'firebase/auth';")
content = content.replace("import { doc, onSnapshot, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';",
                          "import { doc, onSnapshot, getDoc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';")
content = content.replace("import { DEFAULT_USER_CONFIGS } from '../utils/constants';",
                          "import { DEFAULT_USER_CONFIGS } from '../utils/constants';\nimport { AuthUserProfile } from '../types';")

# Fix typings
content = content.replace("user: any | null;", "user: User | null;")
content = content.replace("userProfile: any | null;", "userProfile: AuthUserProfile | null;")
content = content.replace("const [user, setUser] = useState<any | null>(null);", "const [user, setUser] = useState<User | null>(null);")
content = content.replace("const [userProfile, setUserProfile] = useState<any | null>(null);", "const [userProfile, setUserProfile] = useState<AuthUserProfile | null>(null);")
content = content.replace("export const AuthProvider: React.FC<{ children: React.ReactNode, auth: any, db: any }> = ({ children, auth, db }) => {",
                          "export const AuthProvider: React.FC<{ children: React.ReactNode, auth?: Auth, db?: Firestore }> = ({ children, auth = defaultAuth, db = defaultDb }) => {")

# We need to import defaultAuth and defaultDb properly to alias them if they are passed. But wait, in the file it imports them as `auth` and `db` from '../firebase'. Let's rename the import.
content = content.replace("import { auth, db } from '../firebase';", "import { auth as defaultAuth, db as defaultDb } from '../firebase';")

# Fix login
content = content.replace("await signInWithPopup(auth, provider);", "await signInWithRedirect(auth, provider);")

# Add getRedirectResult
redirect_logic = """  useEffect(() => {
    // Process redirect result if any
    getRedirectResult(auth).catch(err => {
      console.error("Auth Redirect Error:", err);
    });

    const unsubAuth = onAuthStateChanged(auth, async (authUser) => {"""
content = content.replace("  useEffect(() => {\n    const unsubAuth = onAuthStateChanged(auth, async (authUser) => {", redirect_logic)

with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write(content)

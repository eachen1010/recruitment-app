import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"

// Validate Firebase configuration
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0 && typeof window !== "undefined") {
  console.error(
    "Firebase configuration error: Missing environment variables:",
    missingVars.map((key) => `NEXT_PUBLIC_${key.toUpperCase().replace(/([A-Z])/g, "_$1")}`).join(", ")
  )
  console.error(
    "Please check your .env.local file and ensure all Firebase configuration variables are set."
  )
}

// Only initialize if we have all required config values (not empty strings)
const hasValidConfig = 
  requiredEnvVars.apiKey && 
  requiredEnvVars.authDomain && 
  requiredEnvVars.projectId && 
  requiredEnvVars.storageBucket && 
  requiredEnvVars.messagingSenderId && 
  requiredEnvVars.appId

const firebaseConfig = hasValidConfig ? {
  apiKey: requiredEnvVars.apiKey!,
  authDomain: requiredEnvVars.authDomain!,
  projectId: requiredEnvVars.projectId!,
  storageBucket: requiredEnvVars.storageBucket!,
  messagingSenderId: requiredEnvVars.messagingSenderId!,
  appId: requiredEnvVars.appId!,
} : null

// Initialize Firebase only if we have valid configuration
let app: FirebaseApp | undefined
let auth: Auth | undefined

if (typeof window !== "undefined") {
  // Only initialize on client-side
  if (getApps().length === 0) {
    if (firebaseConfig && hasValidConfig) {
      try {
        app = initializeApp(firebaseConfig)
        auth = getAuth(app)
        console.log("Firebase initialized successfully")
      } catch (error) {
        console.error("Failed to initialize Firebase:", error)
        auth = undefined
        app = undefined
      }
    } else {
      console.error(
        "Firebase cannot be initialized: Missing required configuration."
      )
      console.error("Missing variables:", missingVars)
      console.error("Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set.")
      auth = undefined
      app = undefined
    }
  } else {
    app = getApps()[0]
    try {
      auth = getAuth(app)
    } catch (error) {
      console.error("Failed to get Firebase Auth:", error)
      auth = undefined
    }
  }
}

// Export auth with a check
if (!auth && typeof window !== "undefined") {
  console.error(
    "Firebase Auth is not initialized. Please check your environment variables in .env.local"
  )
  console.error("Required variables:")
  console.error("- NEXT_PUBLIC_FIREBASE_API_KEY")
  console.error("- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN")
  console.error("- NEXT_PUBLIC_FIREBASE_PROJECT_ID")
  console.error("- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET")
  console.error("- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID")
  console.error("- NEXT_PUBLIC_FIREBASE_APP_ID")
}

export { auth }
export default app

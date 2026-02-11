import { initializeApp, getApps, cert, App } from "firebase-admin/app"
import { getAuth, Auth } from "firebase-admin/auth"

// Only initialize on server-side
let adminApp: App | undefined
let adminAuth: Auth | undefined

if (typeof window === "undefined") {
  if (getApps().length === 0) {
    // Initialize Firebase Admin
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : undefined

    if (!serviceAccount) {
      console.warn(
        "Firebase Admin SDK: FIREBASE_SERVICE_ACCOUNT_KEY not found. Admin features will not be available."
      )
    } else {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
      adminAuth = getAuth(adminApp)
    }
  } else {
    adminApp = getApps()[0]
    adminAuth = getAuth(adminApp)
  }
}

export { adminAuth, adminApp }

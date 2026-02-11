# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the recruitment app.

## Prerequisites

1. A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
2. Firebase Authentication enabled in your Firebase project

## Step 1: Get Firebase Client Configuration

1. Go to Firebase Console > Project Settings > General
2. Scroll down to "Your apps" section
3. If you don't have a web app, click "Add app" and select the web icon
4. Copy the Firebase configuration object

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration values.

## Step 3: Set Up Firebase Admin SDK

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Convert the JSON to a single-line string (you can use a JSON minifier or just remove all newlines)
5. Add it to your `.env.local` file:

```env
# Firebase Admin SDK (as a single-line JSON string)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Important:** Make sure the entire JSON is on a single line with no line breaks.

## Step 4: Enable Authentication Methods

### Enable Email/Password Authentication

1. Go to Firebase Console > Authentication > Sign-in method
2. Click on "Email/Password"
3. Enable "Email/Password" authentication
4. Click "Save"

### Enable Google Authentication

1. Go to Firebase Console > Authentication > Sign-in method
2. Click on "Google"
3. Enable "Google" authentication
4. Enter your project support email (or use the default)
5. Click "Save"

**Note:** For production, you may need to configure OAuth consent screen in Google Cloud Console if you haven't already.

## Step 5: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/signup` to create a new account
3. Navigate to `/login` to sign in with your account

## Usage

### Client-Side Authentication

The app uses Firebase Auth for client-side authentication. Users can:
- Sign up at `/signup`
- Sign in at `/login`
- Auth state is managed globally via `AuthProvider`

### Server-Side Authentication (Admin SDK)

The Firebase Admin SDK is available for server-side operations:
- User management
- Token verification
- Custom claims
- User data access

Import it in your API routes or server components:

```typescript
import { adminAuth } from "@/lib/firebase/admin"
```

## Security Notes

- Never commit your `.env.local` file to version control
- The `FIREBASE_SERVICE_ACCOUNT_KEY` contains sensitive credentials
- Keep your Firebase API keys secure
- Use Firebase Security Rules to protect your data

## Troubleshooting

### "Firebase Admin SDK requires FIREBASE_SERVICE_ACCOUNT_KEY"
- Make sure you've added the service account key to your `.env.local` file
- Ensure it's a valid JSON string on a single line

### "auth/email-already-in-use"
- The email is already registered. Try signing in instead.

### "auth/weak-password"
- Firebase requires passwords to be at least 6 characters. The app enforces 8 characters minimum.

### Authentication not working
- Check that Email/Password authentication is enabled in Firebase Console
- Verify all environment variables are set correctly
- Check the browser console for error messages

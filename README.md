# Speak Notes

Talk, watch your words appear live, save notes, and learn how speech-to-text works.

Phase 1 MVP: Expo (web + iOS + Android) · Convex · Convex Auth (email + Google) · NativeWind · `expo-speech-recognition`.

> **Expo Go does not support speech recognition.** Prefer **web** for the live transcript path (`npm run web`). Native needs a [development build](https://docs.expo.dev/develop/development-builds/introduction/).

## Quick start (web first)

### 1. Install

```bash
npm install
```

### 2. Create a Convex project

```bash
npx convex dev
```

Log in, create/link a project. This writes `EXPO_PUBLIC_CONVEX_URL` to `.env.local` and generates `convex/_generated`.

Leave `npx convex dev` running in one terminal.

### 3. Convex Auth keys

In another terminal (or the Convex dashboard → Settings → Environment Variables):

```bash
npm run auth:keys
# or: npx @convex-dev/auth
```

Set on the Convex **deployment** (not only `.env.local`):

| Variable | Required for | Notes |
|----------|--------------|--------|
| `JWT_PRIVATE_KEY` | Email + Google | Auth signing key |
| `JWKS` | Email + Google | Public JWKS JSON |
| `SITE_URL` | Google OAuth | e.g. `http://localhost:8081` (Expo web) |
| `AUTH_GOOGLE_ID` | Google | Google Cloud OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google | Google Cloud OAuth client secret |
| `EXPO_URL` | Google on native | e.g. `speaknotes://` (matches `scheme` in `app.json`) |

```bash
npx convex env set SITE_URL http://localhost:8081
npx convex env set AUTH_GOOGLE_ID <client-id>
npx convex env set AUTH_GOOGLE_SECRET <client-secret>
npx convex env set EXPO_URL speaknotes://
```

**Google Cloud console:** create an OAuth client. Add authorized redirect URI:

`https://<your-deployment>.convex.site/api/auth/callback/google`

Email/password sign-in works once JWT keys are set — no Google secrets needed for that path.

### 4. Run the app (web)

```bash
npm run web
```

Open the URL Expo prints (usually `http://localhost:8081`). Use **Chrome, Edge, or Safari** — Firefox shows an unsupported-browser message.

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run web` | Expo web (preferred for Phase 1 speech testing) |
| `npm start` | Expo dev server |
| `npm run convex:dev` | Convex backend watcher |
| `npm run typecheck` | TypeScript check |
| `npm run auth:keys` | Print JWT_PRIVATE_KEY + JWKS for Convex Auth |

## App structure

Matches the Speak Notes plan: Record / Notes / Learn / Account tabs, note detail, Convex `notes` table, `useSpeechToText` with auto-restart on silence.

## Privacy & COPPA

- Sign-up requires confirming **13+** (US COPPA).
- Mic permission rationale is shown before the system prompt.
- Record screen reminds users to get consent before recording others.

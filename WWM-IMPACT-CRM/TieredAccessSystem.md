# Tiered Access System — Documentation

This document explains the client-side tiered access system added to the `WWM-IMPACT-CRM` Nuxt app. It describes each new file, how the role hierarchy works, how to test it locally, and recommended next steps to integrate with your Prisma backend.

## Files added

- `composables/useAuth.ts`
  - Purpose: a simple in-memory auth composable that stores the current user and provides utility computed properties and helper functions.
  - Exposes:
    - `user` (ref) — holds the current user object or null.
    - `setUser(user|null)` — set or clear the current user (used by the mock login).
    - `logout()` — clears user and redirects to `/login`.
    - `isAdmin`, `isOrgLeader`, `isDonor`, `isBasicUser` (computed) — easy role checks.
    - `canAccessFeature(requiredRole)` — a role-hierarchy comparison to check if the current user meets a minimum role.
  - Implementation: uses the Composition API (`ref`, `computed`) and `vue-router` to navigate.

- `types/user.ts`
  - Purpose: TypeScript types used by the composable and pages.
  - Contains `UserRole` enum (`ADMIN`, `ORGANIZATION_LEADER`, `DONOR`, `BASIC_USER`) and a `User` interface describing the client-side user shape and permissions.
  - Note: This is a client-side representation. Map your server Prisma `User.role` values into this enum when you implement real auth.

- `middleware/auth.ts`
  - Purpose: Route middleware to protect pages and redirect unauthorized or unauthenticated users.
  - Behavior:
    - Redirects to `/login` when no `user` state is present and the route isn't `/login`.
    - If `to.meta.requiredRole` exists, compares the user's role using `hasRequiredRole` (role hierarchy) and redirects to `/unauthorized` if not authorized.
  - How to protect a page: in your page component set `definePageMeta({ middleware: 'auth', requiredRole: UserRole.ORGANIZATION_LEADER })`.

- `pages/login.vue`
  - Purpose: A simple mock login UI used during development to set the in-memory `user`.
  - Mock behavior: infers role from the typed email (contains `admin` → Admin, `org` → Organization Leader, `donor` → Donor, otherwise Basic User). Replace with real login logic when integrating the backend.

- `pages/unauthorized.vue`
  - Purpose: Simple page shown when a user attempts to access a protected route without sufficient permissions.

- `pages/index.vue`
  - Purpose: A role-aware main page showcasing the UI sections shown for each role. Demonstrates how to use `useAuth()` to branch UI by role.

## How the role hierarchy works

- Roles (highest to lowest): ADMIN (4) → ORGANIZATION_LEADER (3) → DONOR (2) → BASIC_USER (1)
- `canAccessFeature(requiredRole)` and `hasRequiredRole` compare numeric rank values. The function returns true if user's role rank >= requiredRole rank.

Example: A user with role `ORGANIZATION_LEADER` can access features requiring `BASIC_USER` or `DONOR` but cannot access `ADMIN`-only features.

## Mapping to Prisma schema

- Your Prisma `schema.prisma` currently defines `enum Role { STANDARD ADMIN }`.
- When you integrate real authentication, convert the Prisma `role` value to the client `UserRole` enum. Example mapping:
  - Prisma `ADMIN` → `UserRole.ADMIN`
  - Prisma `STANDARD` → `UserRole.BASIC_USER` (or `ORGANIZATION_LEADER` / `DONOR` depending on additional fields or a joined table)

If you need more granular server-side roles (Org leaders, Donors), update the Prisma enum and run a migration. See `prisma` docs for adding enum values or for careful renames.

## Testing locally

1. Start the Nuxt dev server in `WWM-IMPACT-CRM`:
```powershell
cd 'WWM-IMPACT-CRM'
npm install
npm run dev
```
2. Open `/login`, type an email to choose a role (see mock rules above), and submit.
3. Visit `/`. The main page will show UI per role.
4. Protect a page by setting `requiredRole` in `definePageMeta` and confirm that users without the proper role are redirected to `/unauthorized`.

## Next steps (integration with backend)

1. Replace mock login with a real API call to your auth endpoint (e.g., `POST /api/login`) that returns a JWT or session cookie and the user profile.
2. On app load or after login, call `GET /api/me` to fetch the current user shape and call `useAuth().setUser(serverUser)` with a mapped user object.
3. Map Prisma Role values to the client `UserRole` in one central place (an adapter) to avoid scattered mappings.
4. Persist user state in a secure cookie or token; store minimal info in Nuxt `useState('user')` and use server middleware for SSR-protected pages if needed.

## Prisma migration notes (if you change server enums)

- Adding enum values is straightforward; renaming enum values requires a manual SQL ALTER for PostgreSQL. Plan migrations carefully and back up production DB before applying.

## Files to remove or modify later

- Remove or update the mock login page when real auth is implemented.
- Remove any temporary TypeScript declaration files used to silence editors once proper dependencies are installed.

## Troubleshooting

- If TypeScript complains about missing `vue` types, ensure you run `npm install` in `WWM-IMPACT-CRM` and restart your editor TS server.
- If route middleware doesn't run, ensure your page sets `definePageMeta({ middleware: 'auth' })` and that `middleware/auth.ts` is in the `middleware` directory.

---

If you'd like, I can:
- Produce a mapping adapter that converts your Prisma `User` row into the client `User` object shape (example code for the server and client).
- Add server-side login and `/api/me` endpoint stubs wired to Prisma and demonstrate setting the client user from the server response.
- Create SQL migration snippets if you plan to extend the Prisma `Role` enum.

Tell me which follow-up you want and I'll implement it next.

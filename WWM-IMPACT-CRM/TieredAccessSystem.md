Tiered Access System

This document explains the client-side tiered access system added to the `WWM-IMPACT-CRM` Nuxt app. It describes each new file, how the role hierarchy works, how to test it locally, and recommended next steps to integrate with your Prisma backend.

Files for tiered system

- `composables/useAuth.ts`
  - Purpose: a simple auth composable foler that stores the current user and provides specfic funtcions based on hierachy.
  - User Info:
    - `user (ref)`: holds the current user object or null.
    - setUser(user|null): set or clear the current user.
    - logout(): clears user and redirects to `/login`.
    - isAdmin: `isOrgLeader`, `isDonor`, `isBasicUser` (computed) — easy role checks.
    - `canAccessFeature(requiredRole)`: a role-hierarchy comparison to check if the current user meets a minimum role.
  - Implementation: Composition API (`ref`, `computed`) and `vue-router` for navigation.

- `types/user.ts`
  - Purpose: TypeScript types used from the composable and pages.
  - Contains `UserRole` enum (`ADMIN`, `ORGANIZATION_LEADER`, `DONOR` (might be removed later), `BASIC_USER`) and a `User` interface describing the client side user shape and permissions.
  - This is a client side representation. Map your server Prisma `User.role` values into this enum when you implement real authentication.

- `middleware/auth.ts`
  - Purpose: Route middleware to restricting pages to unauthorized users.
  - Behavior:
    - Redirects to `/login` when no `user` state is present and the route isn't `/login`.
    - If `to.meta.requiredRole` exists, compares the user's role using `hasRequiredRole` (role hierarchy) and redirects to `/unauthorized` if not authorized.
  - How to protect a page: in your page component set `definePageMeta({ middleware: 'auth', requiredRole: UserRole.ORGANIZATION_LEADER })`.

- `pages/login.vue`
  - Purpose: A simple mock login UI used during development to set the in-memory `user`.
  - Mock behavior: infers role from the typed email (contains `admin` → Admin, `org` → Organization Leader, `donor` to Donor, otherwise Basic User). Replace with real login logic when integrating the backend.

- `pages/unauthorized.vue`
  - Purpose: Simple page shown when a user attempts to access a protected route without sufficient permissions.

- `pages/index.vue`
  - Purpose: A role-aware main page showcasing the UI sections shown for each role. Demonstrates how to use `useAuth()` to branch UI by role.

Role hierarchy funcationality

- Roles (highest to lowest): Admin 4, Organizaton leader 3, Donor 2, Basic User 1 (thinking about getting rid of donor role for now to focus on the basic user authentication)
- `canAccessFeature(requiredRole)` and `hasRequiredRole` compare rank hierarchy roles. The function returns true if user's role rank is at least at a certain level.

Example: A user with role `ORGANIZATION_LEADER` can access features requiring `BASIC_USER` or `DONOR` but cannot access `ADMIN` only features.

Migrating with prisma

- The Prisma `schema.prisma` currently defines `enum Role { STANDARD ADMIN }`.
- When it integrates real authentication, convert the Prisma `role` value to the client `UserRole` enum. Example mapping:
  - Prisma `ADMIN` to `UserRole.ADMIN`
  - Prisma `STANDARD` to `UserRole.BASIC_USER` (or `ORGANIZATION_LEADER` / `DONOR` depending on additional fields or a joined table)

If you need more granular server-side roles (Org leaders, Donors), update the Prisma enum and run migration. See `prisma` docs for adding enum values or for careful renames.
Using sqlite for host provider as of right now

Local Testing

- Start the Nuxt dev server in `WWM-IMPACT-CRM`:
```powershell

- cd 'WWM-IMPACT-CRM'

- npm install

- npm run dev
```

- Open `/login`, type an email to choose a role (see mock rules above), and submit.
- Visit `/`. The main page will show UI per role.

- Protect a page by setting `requiredRole` in `definePageMeta` and confirm that users without the proper role are redirected to `/unauthorized`.

Next steps for backend integration

- Replace mock login with a real API call to your auth endpoint (e.g., `POST /api/login`) that returns a JWT or session cookie and the user profile.

- On app load or after login, call `GET /api/me` to fetch the current user shape and call `useAuth().setUser(serverUser)` with a mapped user object.

- Map Prisma Role values to the client `UserRole` in one central place (an adapter) to avoid scattered mappings.

- Persist user state in a secure cookie or token; store minimal info in Nuxt `useState('user')` and use server middleware for SSR-protected pages if needed.

Prisma migration

- Adding enum values is straightforward; renaming enum values requires a manual SQL ALTER for PostgreSQL. Plan migrations carefully and back up production DB before applying.

Files to remove or modify later

- Remove or update the mock login page when the authentication file is implemented.
- Remove any temporary TypeScript declaration files used to silence editors once proper dependencies are installed.

Troubleshooting

- If TypeScript complains about missing `vue` types, make sure to run `npm install` in `WWM-IMPACT-CRM` and restart editor and program.
- If route middleware doesn't run, ensure the page sets `definePageMeta({ middleware: 'auth' })` and that `middleware/auth.ts` is in the `middleware` folder.

If you'd like, we can:
- Produce a mapping adapter that converts your Prisma `User` row into the client `User` object shape (example code for the server and client).
- Add server-side login and `/api/me` endpoint stubs wired to Prisma and demonstrate setting the client user from the server response.
- Create SQL migration snippets if you plan to extend the Prisma `Role` enum.

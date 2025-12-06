# WalkWithMe Global — Impact CRM

A modern, open-source Customer Relationship Management (CRM) platform built for nonprofits.

Impact CRM is designed to replace WalkWithMe Global's current CRM (Bloomerang) by providing a flexible, cost-effective, role-based system that supports multi-organization workflows and can be reused by other nonprofits.

---

##  Conceptual Overview

WalkWithMe Global currently uses Bloomerang, a commercial nonprofit CRM platform. While powerful, Bloomerang presents several issues:

- High cost for long-term use
- Rigid permission structure — users can either see everything or nothing
- Lack of customization
- Closed-source, limiting its adoption by partner nonprofits in other regions

Impact CRM solves these problems by delivering a fully custom, open-source CRM tailored to WalkWithMe Global's needs, featuring:

- A tiered role & access control system
- Support for multiple organizations (chapters) under one system
- A foundation for future nonprofit tooling integrations

---

##  User Roles

### 1. Admin

- Manages all organizations within the system
- Creates new organizations
- Manages user permissions
- Has full database and settings access

### 2. Organization Leader

- Manages their specific nonprofit chapter
- Creates and manages donors, funds, campaigns
- Adds and manages members of their organization
- Limited access to only their organization's data

### 3. Standard User

- Can view and manage only assigned data (donors, reports, campaigns)
- Cannot view or modify data outside assigned permissions
- Cannot alter role configurations

---

##  Functional Requirements (by page/module)

### Dashboard

- View high-level statistics: total donors, total donations, campaigns, revenue
- Quick links to core modules: Donors, Funds, Organizations
- Role-based visibility (admins see all organizations, leaders see only theirs)

### Authentication / Authorization

- Login / logout
- Role-based access enforcement
- Account provisioning (admin only)

### Organization Management

- Create new organizations (admin only)
- Edit organization metadata
- View organization-level metrics
- Manage members of that organization

### User Management

- Add new users
- Assign roles (admin → org leader → standard user)
- Enable/disable accounts
- Reset passwords (via Auth provider)

### Donor Management

- Create, edit, and view donor profiles
- Track donor history
- Log donation records
- Filter donors by organization, campaign, and status

### Campaign & Fund Management

- Create new fundraising campaigns
- Assign donors and donations to campaigns
- Track campaign progress

### Reporting

- Generate donor activity reports
- Export donor lists
- (Future) Financial reports
- (Future) Cross-organization analytics

---

## 🔌 Third-Party Integrations

### ✔️ Better Auth (current)

Used for:
- Authentication
- User account provisioning
- Session and token management

### 🔜 Future Integrations

- **QuickBooks** – accounting + transaction syncing
- **Stripe** – handling online donor payments
- **Email Provider (TBD)** – automated donor emails and receipts

---

##  Tech Stack

### Framework

**Nuxt 3 (Vue.js meta-framework)**  
Handles routing, server endpoints, and UI in a unified full-stack architecture.

### Database

**SQLite (development only)**  
Small, file-based database for local work.  
*(Future migration to PostgreSQL or MySQL for production.)*

### ORM / Database Tools

**Prisma** – type-safe database access, migrations, and schema management

### Other Tools

- **Postman** – API testing
- **npm / npx** – package management & script execution

---

##  Deployment Notes

The system is **not deployed yet** and is currently running locally only.

### Long-term plan:

- Deploy on **Azure**
- Integrate **CI/CD** for schema migrations

---

## 🗄️ Migration Scripts

No migration scripts from Bloomerang have been implemented yet.

### Future needs:

- Donor import from CSV/Excel
- Donation history migration
- Organization metadata import

---

##  Development Environment Setup

> **Assumption:** Node.js, npm, and dependencies like Docker are already installed.

### 1. Clone the repository

```bash
git clone https://github.com/your-org/wwm-impact-crm.git
cd wwm-impact-crm
```

### 2. Create a `.env` file

Create a `.env` in the project root:

```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_CLIENT_ID="your-client-id"
BETTER_AUTH_CLIENT_SECRET="your-client-secret"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Initialize the database

Prisma will generate the SQLite DB file and apply migrations:

```bash
npx prisma migrate dev
```

If this is the first time running the project:

```bash
npx prisma db push
```

### 5. Generate the Prisma client

```bash
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

Nuxt will run at: **http://localhost:3000**

### 7. (Optional) Open Prisma Studio

GUI for viewing your database:

```bash
npx prisma studio
```

---

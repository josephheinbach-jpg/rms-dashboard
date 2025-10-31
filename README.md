# RMS Client Dashboard (Vercel-Ready, Postgres)

A production-ready starter for a **multi-tenant IoT client portal** with:
- Next.js (App Router) on Vercel
- Postgres (via Prisma)
- Monnit **webhook stub** (`/api/imonnit/webhook`)
- Basic dashboard & sensor trends (Recharts)
- Demo auth via cookie-based org selector (replace with Clerk/Auth0 when ready)

---

## 1) One-time: create a Postgres DB
Use **Neon** (free), **Supabase**, or **Railway**. Copy the connection string and set it in Vercel as:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
```
Also set (for demo):
```
DEMO=true
```

## 2) Deploy to Vercel
1. Push this project to a new GitHub repo.
2. In Vercel, “New Project” → Import the repo.
3. Add the two env vars above.
4. Deploy.

## 3) Run migrations and seed (on Vercel)
- Go to “Settings → Functions → Create a new deployment” or use Vercel CLI to run:
  - **Migrations:** Vercel runs `prisma migrate deploy` during the build.
  - **Seed:** After first deploy, open a shell locally with the same env and run:
    ```bash
    npm run prisma:generate
    npm run db:push   # safe if no migrations yet
    npm run seed
    ```
  Alternatively, run seed locally pointing to your production `DATABASE_URL`.

## 4) Local dev (optional)
```
cp .env.example .env
# set DATABASE_URL to your Postgres
npm install
npm run prisma:generate
npm run db:push
npm run seed
npm run dev
```
Open http://localhost:3000

## 5) Webhook test (fake Monnit payload)
```
curl -X POST https://YOUR-DEPLOYMENT-URL/api/imonnit/webhook   -H "Content-Type: application/json"   -d '{
    "readings":[
      {"sensorId":"MONNIT-S-1","deviceId":"MONNIT-D-1","ts":"2025-10-30T12:00:00Z","value":72.5,"type":"temperature","unit":"°F","accountId":"ACCT-1"}
    ]
  }'
```

## 6) Next steps
- Replace demo org cookie with real auth (Clerk/Auth0) and organization membership.
- Implement signature verification in `lib/imonnit-verify.ts`.
- Add wildcard subdomain routing in Vercel (Domain → Add `*.yourdomain.com` CNAME to `cname.vercel-dns.com`).

---

## Structure
```
app/
  api/
    imonnit/webhook/route.ts
    sensors/[sensorId]/series/route.ts
  page.tsx                      # demo org selector
  dashboard/page.tsx            # tiles with latest values
  dashboard/sensors/[id]/page.tsx
components/
  widgets/TemperatureTrend.tsx
lib/
  prisma.ts
  authz.ts
  imonnit-verify.ts
prisma/
  schema.prisma
scripts/
  seed.js
```

---

**Tip:** For DNS on GoDaddy: add `*.yourdomain.com` as CNAME → `cname.vercel-dns.com`, then add the domain in Vercel.

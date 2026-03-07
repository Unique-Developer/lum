# Lumin Art – Deployment Guide (Vercel)

## Phase 10: Production Deployment

This guide covers deploying the Lumin Art website to Vercel.

---

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- Git repository (GitHub, GitLab, or Bitbucket) with your code pushed
- Domain (optional; Vercel provides `*.vercel.app` by default)

---

## 0. Finalize Before Deploy

1. **Generate production admin password hash** (do not use plain `ADMIN_PASSWORD` in production):
   ```bash
   node scripts/generate-admin-hash.js YourSecurePassword
   ```
   Copy the output and set `ADMIN_PASSWORD_HASH` in Vercel (leave `ADMIN_PASSWORD` unset in production).

2. **Generate a strong JWT secret** (e.g. PowerShell):
   ```powershell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
   ```
   Or use any long random string. Set as `JWT_SECRET` in Vercel.

3. **Confirm build works locally**:
   ```bash
   npm run build
   ```

4. **MongoDB Atlas**: In Network Access, allow `0.0.0.0/0` so Vercel serverless can connect (or add Vercel’s IP ranges if you prefer to restrict).

5. **Do not commit** `.env.local` — it is gitignored. Add all variables in the Vercel dashboard.

---

## 1. Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will auto-detect Next.js – no build config changes needed

---

## 2. Environment Variables

In **Project Settings → Environment Variables**, add these for **Production** (and Preview if you want full features in previews):

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Full site URL (e.g. `https://theluminart.com`) | Yes (for SEO, sitemap, canonical URLs) |
| `JWT_SECRET` | Strong random string for admin sessions (e.g. `openssl rand -base64 32`) | Yes |
| `ADMIN_EMAIL` | Admin login email | Yes |
| `ADMIN_PASSWORD_HASH` | bcrypt hash: `node scripts/generate-admin-hash.js yourpassword` — use this in prod, not plain password | Yes |
| `MONGODB_URI` | MongoDB Atlas connection string (same as in `.env.local`) | Yes |
| `MONGODB_DB` | Database name (e.g. `luminart`) | Yes |
| `B2_APPLICATION_KEY_ID` | Backblaze B2 Application Key ID | Yes (for admin uploads) |
| `B2_APPLICATION_KEY` | Backblaze B2 Application Key | Yes |
| `B2_BUCKET_NAME` | B2 bucket name | Yes |
| `B2_REGION` | B2 region (e.g. `us-east-005`) | Yes |
| `B2_ENDPOINT` | B2 S3-compatible endpoint URL | Yes |
| `RESEND_API_KEY` | Resend API key (for contact form) | Yes (if contact form needed) |
| `RESEND_FROM_EMAIL` | From address (e.g. `onboarding@resend.dev` or your verified domain) | If using contact form |
| `CONTACT_EMAIL` | Email where contact form submissions go | If using contact form |

---

## 3. Build & Deploy

```bash
npm run build
```

If the build succeeds locally, Vercel will build it successfully. Push to your main branch to trigger a deployment.

---

## 4. Post-Deploy Checks

- [ ] Home page loads with 3D experience
- [ ] Catalogue grid shows thumbnails
- [ ] Flipbook viewer works
- [ ] Blog and slug pages load
- [ ] Contact form submits (check Resend / CONTACT_EMAIL)
- [ ] Architect collaboration form works
- [ ] Admin login at `/admin` (use `ADMIN_PASSWORD_HASH` in production)
- [ ] Sitemap at `/sitemap.xml`
- [ ] Custom domain (if configured) resolves correctly

---

## 5. Content Storage Note

The site uses **MongoDB Atlas** for catalogues and blog content, and **Backblaze B2** for PDFs and cover images. On Vercel:

- **Reads and writes** both work – MongoDB and B2 are external services, so admin uploads and edits persist.
- Ensure **MongoDB Network Access** allows `0.0.0.0/0` (or add Vercel IPs) so serverless functions can connect.

---

## 6. Security Headers

`vercel.json` adds:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 7. Deploy (choose one)

### Option A: Deploy from Vercel Dashboard (recommended)

1. Push your code to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new), sign in, and **Import** your repository.
3. Leave **Framework Preset** as Next.js; leave **Root Directory** blank unless the app is in a subfolder.
4. Before clicking **Deploy**, open **Environment Variables** and add all variables from the table in §2 (Production).
5. Click **Deploy**. After the first deploy, go to **Settings → Environment Variables** to add or edit variables; redeploy for changes to apply.

### Option B: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts (link to existing project or create new). Then add environment variables in the Vercel dashboard (**Project → Settings → Environment Variables**) and run `vercel --prod` for production.

---

## Checklist summary

- [ ] Code pushed to Git; repo connected in Vercel  
- [ ] All env vars set in Vercel (see §2), including `ADMIN_PASSWORD_HASH` and `JWT_SECRET`  
- [ ] MongoDB Atlas allows connections from `0.0.0.0/0` (or Vercel IPs)  
- [ ] `npm run build` passes locally  
- [ ] After deploy: test home, catalogue, contact form, admin login, sitemap

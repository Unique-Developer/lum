# Backend Setup Guide (MongoDB + Backblaze B2 + Resend)

This guide walks you through setting up the backend services for Lumin Art. Complete each section in order. All services offer free tiers suitable for development and small production deployments.

---

## Prerequisites

- Node.js 18+ installed
- A code editor (VS Code, Cursor, etc.)
- The project cloned and dependencies installed (`npm install`)

---

## 1. MongoDB Atlas Setup

MongoDB Atlas provides the database for catalogues and blog content.

### Step 1.1: Create an Account

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click **Try Free** (or **Sign In** if you have an account)
3. Sign up with email or Google
4. Verify your email if prompted

### Step 1.2: Create a Free Cluster

1. After logging in, you’ll see **Create a Deployment**
2. Choose **M0 Sandbox** (Free) — default option
3. Choose a cloud provider and region (e.g. **AWS**, **US East (N. Virginia)**)
4. Click **Create Deployment**
5. Wait 1–3 minutes for the cluster to be created

### Step 1.3: Create a Database User

1. On the **Security Quickstart** screen, choose **Username and Password**
2. Enter:
   - **Username:** e.g. `luminart_admin`
   - **Password:** Use a strong password (or the built‑in generator)
3. Click **Create Database User**
4. **Important:** Save the username and password securely

### Step 1.4: Allow Network Access


1. For **Where would you like to connect from?** choose **My Local Environment** (or **Cloud** if deploying to Vercel)
2. Click **Add My Current IP Address** (or add `0.0.0.0/0` for any IP, needed for Vercel)
3. Click **Finish and Close**

### Step 1.5: Get the Connection String

1. Click **Connect** on your cluster
2. Choose **Drivers**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://luminart_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password (URL‑encode special characters if needed)
5. **Modify the connection string to include your database name:**  
   - When you copy the connection string from MongoDB Atlas, it might look like this:
     ```
     mongodb+srv://jenishsonani_db_user:<db_password>@cluster0.ajtiqqz.mongodb.net/?appName=Cluster0
     ```
   - **You must add the database name you want to use (e.g., `luminart`) right after `.net/` and before any `?`.**
   - For example, if your database name is `luminart`, update your string to look like this:
     ```
     mongodb+srv://jenishsonani_db_user:<db_password>@cluster0.ajtiqqz.mongodb.net/luminart?appName=Cluster0
     ```
   - **Step-by-step:**
     1. **Replace `<db_password>` with your actual password.**
     2. **Add `/luminart` after `.net`.**
     3. **Leave everything after `?` as it is (e.g., `?appName=Cluster0`)**, unless your project has a different query string.
   - **Summary:**  
     - The part immediately after `.net/` is where your database name goes (e.g., `/luminart`).
     - Not adding the database name may cause the app to connect to the default `test` database, not the intended one.
     - Your final connection string should look similar to:
       ```
       mongodb+srv://jenishsonani_db_user:yourActualPassword@cluster0.ajtiqqz.mongodb.net/luminart?appName=Cluster0
       ```
     - Copy and paste this full line (with your actual password) into your `.env.local` file for the `MONGODB_URI=...` variable.

### Step 1.6: Add to `.env.local`

1. In the project root, copy `.env.example` to `.env.local` if needed:
   ```bash
   cp .env.example .env.local
   ```
2. Edit `.env.local` and add:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/luminart?retryWrites=true&w=majority
   MONGODB_DB=luminart
   ```
3. Replace `user`, `pass`, and `cluster.xxxxx` with your values

### Step 1.7: Seed the Database (Optional)

If the project includes seed data (e.g. sample catalogues or blog posts):

```bash
npm run seed
```

You should see output like `Seeding complete` or similar. If you get connection errors, verify `MONGODB_URI` and network access.

---

## 2. Backblaze B2 Setup

Backblaze B2 stores PDFs and cover images.

### Step 2.1: Create an Account

1. Go to [backblaze.com/b2](https://www.backblaze.com/b2/cloud-storage.html)
2. Click **Sign Up** (or **Sign In**)
3. Complete registration and verify your email

### Step 2.2: Create a Bucket

1. After logging in, open **Buckets** in the sidebar
2. Click **Create a Bucket**
3. Set:
   - **Bucket Name:** e.g. `luminart-files` (must be globally unique)
   - **Files in Bucket:** Public
   - **Default Encryption:** Enabled (recommended)
4. Click **Create a Bucket**

### Step 2.3: Create Application Keys

1. Open **App Keys** in the left sidebar
2. Click **Add a New Application Key**
3. Use:
   - **Name of Key:** e.g. `luminart-app`
   - **Permissions:** Read and Write (or Full Account for simplicity)
4. Click **Create New Key**
5. **Important:** Copy both:
   - `keyID` (Application Key ID)
   - `applicationKey` (shown once; save it securely)

### Step 2.4: Find Your Endpoint and Region

- Region format: e.g. `us-west-004`, `eu-central-003`
- Endpoint format: `https://s3.<region>.backblazeb2.com`
- Example: `https://s3.us-west-004.backblazeb2.com`

You can confirm region in the bucket URL or B2 dashboard.

### Step 2.5: Add to `.env.local`

Add these to `.env.local`:

```
B2_APPLICATION_KEY_ID=your_key_id
B2_APPLICATION_KEY=your_application_key
B2_BUCKET_NAME=luminart-files
B2_REGION=us-west-004
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

Replace with your actual values.

### Step 2.6: Configure CORS (for PDF.js and Admin Uploads)

CORS must allow: (1) PDFs to load in the browser (PDF.js), (2) Admin file uploads (presigned PUT from the live site).

**Option A – B2 Web UI (if your bucket has “Edit as JSON”)**

1. In B2: **Buckets** → select your bucket → **Bucket Settings** (gear) → **CORS Rules**
2. Choose **Edit as JSON** and use rules that include **s3_put** (not only s3_get). Example:

```json
[
  {
    "corsRuleName": "allowAll",
    "allowedOrigins": ["*"],
    "allowedOperations": ["s3_get", "s3_put"],
    "allowedHeaders": ["*"],
    "exposeHeaders": [],
    "maxAgeSeconds": 3600
  }
]
```

3. Save. If the UI only allows “all HTTPS origins” and no custom JSON, it may allow reads only; use Option B.

**Option B – AWS CLI (S3-compatible; guarantees PUT works)**

If the web UI doesn’t allow PUT, set CORS with the S3-compatible API. Replace `luminart-app`, `us-east-005`, and your B2 key ID/application key.

```bash
# Create cors.xml (allowed methods must include PUT)
cat > cors.xml << 'EOF'
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://theluminart.com</AllowedOrigin>
    <AllowedOrigin>https://www.theluminart.com</AllowedOrigin>
    <AllowedOrigin>http://localhost:3000</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
EOF

# Set CORS (use your B2_APPLICATION_KEY_ID and B2_APPLICATION_KEY)
aws s3api put-bucket-cors --bucket luminart-app --cors-configuration file://cors.xml \
  --endpoint-url https://s3.us-east-005.backblazeb2.com \
  --region us-east-005
```

Configure AWS CLI to use B2 credentials for this endpoint (e.g. `aws configure` with the endpoint, or env vars `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` set to your B2 Application Key ID and Key).

**If CORS for PUT is not fixed:** The app will fall back to uploading via your API. That works for **files under ~4.5 MB** on Vercel; larger PDFs will get “413 Payload Too Large” until B2 CORS allows presigned PUT.

---

## 3. Resend Setup (Email)

Resend handles the contact form emails.

### Step 3.1: Create an Account

1. Go to [resend.com](https://resend.com)
2. Click **Start Building** or **Sign Up**
3. Sign up with email or GitHub
4. Verify your email

### Step 3.2: Create an API Key

1. In the dashboard, open **API Keys** (left sidebar)
2. Click **Create API Key**
3. Name it (e.g. `luminart-local`)
4. Choose permissions (e.g. **Sending access**)
5. Click **Add**
6. Copy the key (starts with `re_`); it’s only shown once

### Step 3.3: Add to `.env.local`

Add:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=contact@yourdomain.com
RESEND_FROM_EMAIL=onboarding@resend.dev
```

- `CONTACT_EMAIL`: where contact form submissions are sent
- `RESEND_FROM_EMAIL`: default sender; use `onboarding@resend.dev` for testing (no domain verification)

### Step 3.4: Production Email (Optional)

For production:

1. In Resend: **Domains** → **Add Domain**
2. Add your domain (e.g. `luminart.com`)
3. Add the DNS records Resend provides
4. After verification, set:
   ```
   RESEND_FROM_EMAIL=hello@luminart.com
   ```

---

## 4. Optional: Remove Nodemailer

If the project uses Resend exclusively and you don’t need Nodemailer:

```bash
npm uninstall nodemailer @types/nodemailer
```

---

## 5. Verify Your Setup

1. Ensure `.env.local` exists and contains all variables
2. Start the app:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000` and check:
   - Blog/catalogue pages load (MongoDB)
   - PDFs/images load (B2)
   - Contact form sends a test email (Resend)

---

## 6. Deployment (Vercel)

For Vercel:

1. Project **Settings** → **Environment Variables**
2. Add each variable from `.env.local` (except secrets you prefer to set separately)
3. For MongoDB: ensure **Network Access** in Atlas includes `0.0.0.0/0` or Vercel’s IP range
4. Redeploy after changing environment variables

---

## Quick Reference: `.env.local` Template

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/luminart?retryWrites=true&w=majority
MONGODB_DB=luminart

# Backblaze B2
B2_APPLICATION_KEY_ID=your_key_id
B2_APPLICATION_KEY=your_application_key
B2_BUCKET_NAME=luminart-files
B2_REGION=us-west-004
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com

# Resend
RESEND_API_KEY=re_xxxxx
CONTACT_EMAIL=contact@yourdomain.com
RESEND_FROM_EMAIL=onboarding@resend.dev

# Admin (optional)
ADMIN_EMAIL=admin@luminart.com
ADMIN_PASSWORD=admin123
JWT_SECRET=change-in-production
```

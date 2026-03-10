# Backend Setup Guide (MongoDB + Cloudflare R2 + Resend)

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

## 2. Cloudflare R2 Setup

Cloudflare R2 stores PDFs and cover images. R2 offers 10GB free storage and no egress fees.

### Step 2.1: Create an Account

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up or sign in with your Cloudflare account

### Step 2.2: Create an R2 Bucket

1. In the left sidebar, go to **R2 Object Storage**
2. Click **Create bucket**
3. Enter a **Bucket name** (e.g. `luminart-files`)
4. Choose a location (optional)
5. Click **Create bucket**

### Step 2.3: Enable Public Access

1. Open your bucket
2. Go to **Settings**
3. Under **Public access**, click **Allow Access**
4. Choose either:
   - **R2.dev subdomain** – Use the generated URL (e.g. `https://pub-xxxx.r2.dev`) – suitable for development and small production
   - **Custom domain** – Connect a domain you own (e.g. `files.theluminart.com`) for production with better performance
5. Copy the **Public Bucket URL** – you'll need it for `R2_PUBLIC_BASE_URL`

### Step 2.4: Create API Token

1. Go to **R2** → **Manage R2 API Tokens** (or **Overview** → **Manage API Tokens**)
2. Click **Create API token**
3. Name it (e.g. `luminart-app`)
4. Permissions: **Object Read & Write**
5. Optional: restrict to your bucket
6. Click **Create API Token**
7. **Important:** Copy the **Access Key ID** and **Secret Access Key** (secret is shown only once)

### Step 2.5: Get Your Account ID

- In the R2 Overview, find **Account ID** in the right sidebar
- Or use the URL: `https://dash.cloudflare.com/<ACCOUNT_ID>/r2`

### Step 2.6: Add to `.env.local`

Add these to `.env.local`:

```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=luminart-files
R2_PUBLIC_BASE_URL=https://pub-xxxx.r2.dev
```

Replace with your actual values. `R2_PUBLIC_BASE_URL` is the Public Bucket URL from Step 2.3 (no trailing slash).

### Step 2.7: Configure CORS (if needed for uploads over 4 MB)

R2 buckets with public access often work without extra CORS config. If uploads **over 4 MB** fail with a CORS error, configure CORS for presigned PUT uploads.  

**Why you still see “blocked by CORS policy”:**  
Use the AWS CLI below to set CORS and allow PUT (“Share with this one origin”, “Share with every origin”, etc.) only enable **read (GET)** for the S3-compatible API. They do **not** enable **PUT**, so browser uploads from theluminart.com are blocked. To allow PUT you must set CORS via the **S3-compatible API** (e.g. AWS CLI) as below.

---

#### Fix CORS for uploads (step-by-step with AWS CLI)

Do this once; it configures the bucket so `https://theluminart.com` can both read files and upload (PUT) via presigned URLs.

**1. Install AWS CLI (if you don’t have it)**

- **Windows:** Download and run the MSI from [AWS CLI v2](https://aws.amazon.com/cli/), or in PowerShell: `msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi`
- **Mac:** `brew install awscli`
- **Linux:** See [AWS CLI install](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

**2. Get your R2 values**

From your `.env.local`: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ACCOUNT_ID`

**3. Create the CORS file (AWS CLI requires JSON)**

Create a file named `cors.json` in a folder you can use in the terminal (e.g. your project folder). Put this inside (edit `AllowedOrigins` if needed):

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "https://theluminart.com",
        "https://www.theluminart.com",
        "http://localhost:3000"
      ],
      "AllowedMethods": ["GET", "PUT", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

**4. Run the command (one-time)**

Use your R2 credentials. Replace placeholders with values from `.env.local`:

**Windows (PowerShell):**

```powershell
cd "D:\Project\Lumin Art\lum"
$env:AWS_ACCESS_KEY_ID = "YOUR_R2_ACCESS_KEY_ID"
$env:AWS_SECRET_ACCESS_KEY = "YOUR_R2_SECRET_ACCESS_KEY"
aws s3api put-bucket-cors --bucket YOUR_R2_BUCKET_NAME --cors-configuration file://cors.json --endpoint-url "https://YOUR_R2_ACCOUNT_ID.r2.cloudflarestorage.com" --region auto
```

**Mac / Linux (bash):**

```bash
cd /path/to/your/project
export AWS_ACCESS_KEY_ID="YOUR_R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_R2_SECRET_ACCESS_KEY"
aws s3api put-bucket-cors --bucket YOUR_R2_BUCKET_NAME --cors-configuration file://cors.json --endpoint-url "https://YOUR_R2_ACCOUNT_ID.r2.cloudflarestorage.com" --region auto
```

- Endpoint: `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`

**5. Confirm success**

- If it works, the command finishes with no output.  
- Wait **1–2 minutes**, then try uploading a catalogue PDF again from https://theluminart.com (admin → edit catalogue → Upload PDF).  
- If you still see a CORS error, check: (1) bucket name and region match your R2 bucket, (2) no typo in key ID/key, (3) you’re testing from https://theluminart.com (or another origin you put in `cors.json`).

**6. (Optional) Remove env vars after**

So the keys don’t stay in your shell:

- **PowerShell:** `Remove-Item Env:AWS_ACCESS_KEY_ID; Remove-Item Env:AWS_SECRET_ACCESS_KEY`
- **Bash:** `unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY`

---

#### Note


Files **under 4 MB** can use the server fallback (upload via your API) and do not need CORS.

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
   - PDFs/images load (R2)
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

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=luminart-files
R2_PUBLIC_BASE_URL=https://pub-xxxx.r2.dev

# Resend
RESEND_API_KEY=re_xxxxx
CONTACT_EMAIL=contact@yourdomain.com
RESEND_FROM_EMAIL=onboarding@resend.dev

# Admin (optional)
ADMIN_EMAIL=admin@luminart.com
ADMIN_PASSWORD=admin123
JWT_SECRET=change-in-production
```


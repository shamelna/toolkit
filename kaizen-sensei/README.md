# 🥋 Kaizen Sensei

A conversational AI assistant for Kaizen Academy — powered by Claude, grounded in your uploaded PDFs and Markdown files, deployed free on Vercel + Firebase.

---

## What It Does

- **Sensei chat interface** — visitors ask Lean/Kaizen questions and get answers grounded in your uploaded knowledge base
- **Admin panel** — you upload PDFs/Markdown files, they're automatically indexed and searchable
- **Smart retrieval** — each upload is chunked and keyword-indexed in Firestore; relevant chunks are injected into every Claude response
- **Course recommendations** — Sensei naturally guides visitors toward the right Kaizen Academy course
- **Free hosting** — Vercel (frontend + API) + Firebase (storage + database) both have generous free tiers

---

## Tech Stack

| Layer | Service | Free Tier |
|-------|---------|-----------|
| Frontend + API | Vercel | 100GB bandwidth/mo |
| Database (chunks) | Firebase Firestore | 1GB storage, 50k reads/day |
| File Storage | Firebase Storage | 5GB storage |
| AI Brain | Anthropic Claude | Pay-per-use |

---

## Setup Guide

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/kaizen-sensei.git
cd kaizen-sensei
npm install
```

---

### Step 2 — Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `kaizen-sensei` → Create
3. In the left sidebar, click **Firestore Database** → **Create database** → choose **Production mode** → pick a region (e.g. `australia-southeast1`) → Enable
4. In the left sidebar, click **Storage** → **Get started** → Production mode → same region → Done

#### Get Firebase Client Config (for the frontend)
1. Go to **Project Settings** (gear icon) → **General** tab
2. Scroll to **Your apps** → click **</>** (Web app) → Register app → name it `kaizen-sensei-web`
3. Copy the `firebaseConfig` values — you'll need all 6 fields for `.env.local`

#### Get Firebase Admin Config (for the server)
1. Go to **Project Settings** → **Service accounts** tab
2. Click **Generate new private key** → Download the JSON file
3. Open the JSON — you need `project_id`, `client_email`, and `private_key`

#### Set Firestore Security Rules
In Firebase Console → Firestore → **Rules** tab, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for chat (server-side reads use Admin SDK, so this is fine)
    match /{document=**} {
      allow read, write: if false; // All access via Admin SDK only
    }
  }
}
```

#### Set Storage Security Rules
In Firebase Console → Storage → **Rules** tab, paste:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if false; // All access via Admin SDK only
    }
  }
}
```

---

### Step 3 — Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. **API Keys** → **Create Key** → copy it

---

### Step 4 — Configure Environment Variables

Create `.env.local` in the project root (this file is gitignored — never commit it):

```bash
cp .env.example .env.local
```

Then fill in all values in `.env.local`:

```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Firebase Client (from Step 2 → Web app config)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kaizen-sensei.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kaizen-sensei
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kaizen-sensei.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (from the downloaded service account JSON)
FIREBASE_ADMIN_PROJECT_ID=kaizen-sensei
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@kaizen-sensei.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Admin panel password — choose something strong
ADMIN_PASSWORD=your-strong-password-here
```

> ⚠️ **Important:** When copying the `private_key` from the JSON file, keep it as one line with literal `\n` characters. Wrap the whole value in double quotes.

---

### Step 5 — Run Locally

```bash
npm run dev
```

- **Sensei chat:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin

Test by uploading one of the PDFs from the Kaizen Academy folder via the admin panel, then ask a question in the chat.

---

### Step 6 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial Kaizen Sensei setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kaizen-sensei.git
git push -u origin main
```

---

### Step 7 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo (`kaizen-sensei`)
3. Framework preset: **Next.js** (auto-detected)
4. Click **Environment Variables** → add every variable from your `.env.local` file
   - Be careful with `FIREBASE_ADMIN_PRIVATE_KEY` — paste the full key including the `\n` characters
5. Click **Deploy**

Your app will be live at `https://kaizen-sensei.vercel.app` (or a custom domain).

#### Custom Domain (optional)
In Vercel → your project → **Settings** → **Domains** → add `sensei.kaizenacademy.education` or similar.

---

## Using the Admin Panel

1. Visit `yoursite.com/admin`
2. Enter your `ADMIN_PASSWORD`
3. (Optional) Give the document a descriptive title
4. Drag & drop a PDF or Markdown file
5. The file uploads to Firebase Storage and is automatically chunked + indexed in Firestore
6. The Sensei can now answer questions using that content immediately

### What happens when you upload a file?
```
PDF/MD file
    ↓
Firebase Storage (original file saved)
    ↓
Text extracted (pdf-parse for PDFs)
    ↓
Split into ~800 character chunks with 100-char overlap
    ↓
Each chunk saved to Firestore → document_chunks collection
    ↓
Searchable immediately
```

### Deleting a document
Click the trash icon on any document in the admin panel. This deletes:
- The document metadata record
- All indexed chunks in Firestore
- The original file in Firebase Storage

---

## How the Sensei Answers Questions

```
Visitor asks a question
    ↓
Extract keywords from question
    ↓
Search Firestore document_chunks (keyword scoring)
    ↓
Top 5 matching chunks selected
    ↓
Chunks injected into Claude's system prompt as context
    ↓
Claude responds as "Kaizen Sensei" using both the
retrieved context AND its general lean/TPS knowledge
    ↓
Streamed back to visitor in real-time
```

---

## Embedding on Your Existing Website

To add the Sensei to your Teachable or any other site as an iframe:

```html
<iframe
  src="https://kaizen-sensei.vercel.app"
  width="100%"
  height="700px"
  frameborder="0"
  style="border-radius: 12px;"
/>
```

Or link to it from a button:
```html
<a href="https://kaizen-sensei.vercel.app" target="_blank">
  Ask the Kaizen Sensei
</a>
```

---

## Updating the Sensei's Persona

Edit `lib/sensei-prompt.ts` to change:
- How the Sensei speaks
- Which courses it recommends
- What topics it covers
- Its personality and tone

---

## File Structure

```
kaizen-sensei/
├── app/
│   ├── page.tsx              ← Sensei chat interface
│   ├── admin/page.tsx        ← Admin upload panel
│   ├── layout.tsx            ← Root layout + fonts
│   ├── globals.css           ← Global styles
│   └── api/
│       ├── chat/route.ts     ← Streaming chat endpoint
│       ├── upload/route.ts   ← PDF/MD upload + indexing
│       └── documents/route.ts ← List + delete documents
├── lib/
│   ├── firebase.ts           ← Firebase client config
│   ├── firebase-admin.ts     ← Firebase Admin SDK
│   ├── search.ts             ← Keyword search + chunking
│   └── sensei-prompt.ts      ← Sensei system prompt
├── .env.example              ← Environment variable template
├── .env.local                ← Your secrets (gitignored)
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Costs (Approximate)

| Service | Free Tier | Overage |
|---------|-----------|---------|
| Vercel | 100GB bandwidth, unlimited deployments | ~$20/mo Pro |
| Firebase Firestore | 1GB storage, 50k reads/day | ~$0.06/100k reads |
| Firebase Storage | 5GB | $0.026/GB |
| Anthropic Claude | None — pay per use | ~$0.003 per conversation |

For a typical academy with hundreds of conversations/month, total cost is usually **under $5/month**.

---

## Troubleshooting

**Admin upload fails with 401**
→ Check `ADMIN_PASSWORD` in Vercel environment variables matches what you type in the login form.

**Chat returns errors**
→ Check `ANTHROPIC_API_KEY` is set correctly in Vercel.

**Firebase errors in logs**
→ The `FIREBASE_ADMIN_PRIVATE_KEY` must have literal `\n` characters (not actual newlines) and be wrapped in double quotes in Vercel's env var settings.

**Documents not being found in chat**
→ Upload at least one document first. Check Firestore Console → `document_chunks` collection to confirm chunks exist.

---

## Support

Questions? Email learn@continuousimprovement.education

© Kaizen Academy Australia
